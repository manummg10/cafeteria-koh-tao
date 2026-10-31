import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TrabajaConNosotros from './pages/TrabajaConNosotros.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrabajaConNosotros />
  </StrictMode>,
)
