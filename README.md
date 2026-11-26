# Tachyon Intelligence — website

Live: https://tachyonintelligence-cmd.github.io/idliswithpaisa/

React, Vite, Tailwind CSS and Motion. Requires Node 20.19 or newer.

```bash
npm install
npm run dev       # local development
npm run build     # production output in dist/
npm run preview   # serve the production build
npm run brand     # regenerate logo variants, favicon and share image
```

## Deployment

GitHub Pages serves the **`gh-pages`** branch, which holds the contents of `dist/`.
Pushing to `main` alone does not update the live site: build, then publish `dist/`
to `gh-pages`.

## To finish

| Item | Where |
|---|---|
| Official email (currently a placeholder) | `src/config/site.js` → `email` |
| Social profile links | `src/config/site.js` → `socials` |
| Custom domain, if any | `index.html`, `public/robots.txt`, `public/sitemap.xml` |
| Contact form backend (optional) | `VITE_CONTACT_ENDPOINT`, a URL accepting a JSON POST. Without it the form hands the enquiry to WhatsApp |
| Native-speaker review of Kannada, Hindi and Tamil lines | `src/data/voiceScripts.js`, `src/lib/intents.js`, `src/sections/Voice.jsx` |
| Confirm product claims match what is offered today | `src/sections/` |
| Vector (SVG) logo, if available | current assets are extracted from the supplied JPEG |

## What is simulated

Nothing on the site calls an AI, speech, NFC or inventory service. The voice demo
plays scripted calls (the mic button only draws the input level on the device),
the voice lab uses keyword rules, inventory uses fictional data with a
least-squares forecast, and the NFC tap is simulated.

## Connecting real voice AI

Implement the contract in `src/lib/voice/index.js` against your own backend
(streaming STT → LLM → TTS), export it there and set `isLive: true`. Keep API keys
on the server, and update the simulation wording in `VoiceConsole.jsx` and `Footer.jsx`.
