import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

// Preload intro video before React tree mounts
const preloadVideo = document.createElement('link')
preloadVideo.rel = 'preload'
preloadVideo.as = 'video'
preloadVideo.href = '/videos/katana-intro.mp4'
document.head.appendChild(preloadVideo)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
