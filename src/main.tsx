
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Buffer } from 'buffer'

// Polyfill Buffer for browser compatibility
window.Buffer = Buffer

// Get the root element and create a React root
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id "root" in your HTML.')
}

// Create and render the React root
createRoot(rootElement).render(<App />)
