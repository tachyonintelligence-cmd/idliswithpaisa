// Transparent, deterministic forecasting used by the dashboard and the lab:
// a least-squares trend over eight weeks. It is not a trained AI model.

// Share of weekly demand attributed to each location in the sample.
export const DEMAND_SHARE = { all: 1, indiranagar: 0.34, peenya: 0.42, mysuru: 0.24 }

export const sum = (xs) => xs.reduce((a, b) => a + b, 0)

export const onHand = (product, location) =>
  location === 'all' ? sum(Object.values(product.stock)) : product.stock[location]

export function trend(series) {
  const n = series.length
  const mx = (n - 1) / 2
  const my = sum(series) / n
  let num = 0
  let den = 0
  series.forEach((y, x) => {
    num += (x - mx) * (y - my)
    den += (x - mx) ** 2
  })
  const slope = num / den
  return { slope, intercept: my - slope * mx, mean: my }
}

export function forecast(series, weeks = 4) {
  const { slope, intercept } = trend(series)
  return Array.from({ length: weeks }, (_, i) => Math.max(0, Math.round(intercept + slope * (series.length + i))))
}

export function analyse(product, location = 'all') {
  const share = DEMAND_SHARE[location]
  const sales = product.sales.map((v) => v * share)
  const next = forecast(sales)
  const stock = onHand(product, location)
  const daily = next[0] / 7
  const cover = daily > 0 ? stock / daily : Infinity
  const { slope, mean } = trend(sales)
  const change = mean > 0 ? slope / mean : 0 // weekly change relative to the average
  // Enough for the lead time plus two weeks of buffer.
  const reorder = Math.max(0, Math.ceil(daily * (product.lead + 14) - stock))
  const status = cover <= product.lead ? 'low' : cover <= product.lead + 7 ? 'watch' : cover > 60 ? 'excess' : 'ok'
  return { ...product, sales, next, stock, daily, cover, change, reorder, status }
}

export const analyseAll = (products, location = 'all') => products.map((p) => analyse(p, location))

export const days = (cover) => (cover === Infinity ? 'no demand' : cover > 99 ? '99+ days' : `${Math.round(cover)} days`)

export const rupees = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${Math.round(n).toLocaleString('en-IN')}`

/** Rule-based answers to the questions the lab offers. */
export function answer(question, rows) {
  const byCover = [...rows].sort((a, b) => a.cover - b.cover)
  if (question === 'reorder') {
    const due = byCover.filter((r) => r.status === 'low' || r.status === 'watch')
    return due.length
      ? {
          headline: `${due.length} item${due.length > 1 ? 's need' : ' needs'} attention.`,
          points: due.map(
            (r) =>
              `${r.name}: ${days(r.cover)} of cover against a ${r.lead}-day lead time. ${r.reorder > 0 ? `Suggested order: ${r.reorder} units.` : 'Plan the next order now.'}`,
          ),
          basis: 'Cover = stock on hand ÷ next week’s forecast daily demand.',
        }
      : {
          headline: 'Nothing is due for reorder.',
          points: [`The tightest item is ${byCover[0].name}, with ${days(byCover[0].cover)} of cover.`],
          basis: 'Cover compared with each supplier lead time plus seven days.',
        }
  }
  if (question === 'trends') {
    const ranked = [...rows].sort((a, b) => b.change - a.change)
    const rising = ranked.filter((r) => r.change > 0.03)
    const falling = ranked.filter((r) => r.change < -0.03)
    return {
      headline: `${rising.length} rising, ${falling.length} falling, ${rows.length - rising.length - falling.length} steady.`,
      points: [
        ...rising.map((r) => `${r.name} is up about ${Math.round(r.change * 100)}% a week.`),
        ...falling.map((r) => `${r.name} is down about ${Math.round(-r.change * 100)}% a week. Avoid over-ordering.`),
      ],
      basis: 'Least-squares slope over eight weeks, relative to average weekly sales. Changes within ±3% count as steady.',
    }
  }
  const excess = [...rows].filter((r) => r.cover > 35).sort((a, b) => b.cover - a.cover)
  return {
    headline: excess.length ? 'Some stock is moving slowly relative to what you hold.' : 'No item holds more than 35 days of cover.',
    points: excess.map(
      (r) => `${r.name}: ${days(r.cover)} of cover, ${rupees(r.stock * r.price)} held. Consider pausing orders or moving stock between locations.`,
    ),
    basis: 'Items with more than 35 days of forecast cover.',
  }
}
