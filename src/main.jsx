import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Scroll reveals hide their content only once we know JS is live to reveal it
// again. Without this class every .reveal is simply visible.
if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-reveal')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
