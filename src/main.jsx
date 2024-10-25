import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Searcher from './components/Searcher'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Searcher />
  </StrictMode>,
)
