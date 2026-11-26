// Fictional sample data for an auto-parts retailer with three locations.
// `sales` = units sold per week, oldest first. `lead` = supplier lead time in days.

export const LOCATIONS = [
  { id: 'all', label: 'All locations' },
  { id: 'indiranagar', label: 'Indiranagar' },
  { id: 'peenya', label: 'Peenya warehouse' },
  { id: 'mysuru', label: 'Mysuru' },
]

const item = (sku, name, price, lead, stock, sales) => ({
  sku,
  name,
  price,
  lead,
  stock: { indiranagar: stock[0], peenya: stock[1], mysuru: stock[2] },
  sales,
})

export const PRODUCTS = [
  item('EO-1040', 'Engine oil 10W-40, 1 L', 420, 7, [18, 64, 12], [52, 55, 58, 61, 66, 68, 74, 79]),
  item('BP-220', 'Brake pad set', 380, 10, [8, 20, 6], [14, 16, 15, 19, 18, 21, 22, 24]),
  item('AF-118', 'Air filter', 260, 6, [34, 120, 28], [22, 20, 21, 19, 23, 20, 18, 19]),
  item('SP-09', 'Spark plug', 140, 5, [60, 240, 45], [41, 44, 39, 43, 40, 42, 45, 43]),
  item('CK-512', 'Chain and sprocket kit', 1450, 14, [11, 48, 16], [9, 8, 7, 7, 6, 5, 5, 4]),
  item('BT-5L', 'Two-wheeler battery 5 Ah', 1250, 12, [5, 15, 4], [8, 9, 9, 10, 12, 11, 13, 14]),
]
