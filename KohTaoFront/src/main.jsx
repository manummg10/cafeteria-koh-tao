import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <- Añadimos esto
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* <- Añadimos la apertura */}
      <App />
    </BrowserRouter> {/* <- Añadimos el cierre */}
  </StrictMode>,
)