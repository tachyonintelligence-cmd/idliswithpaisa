import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
// Indic faces carry unicode-range, so each downloads only when its script is rendered.
import '@fontsource-variable/noto-sans-kannada'
import '@fontsource-variable/noto-sans-devanagari'
import '@fontsource-variable/noto-sans-tamil'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
