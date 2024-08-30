import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MusicProvider } from './context/MusicContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MusicProvider>
      <App />
    </MusicProvider>
  </StrictMode>,
)
