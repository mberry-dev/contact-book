import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Global styles
import App from './App.jsx'  // Root component

/**
 * Application Entry Point
 * Renders the React app into the DOM root element
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode helps catch common mistakes in development */}
    <App />
  </StrictMode>
)