import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import 'sonner/dist/styles.css'
import './index.css'
import 'tailwindcss'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster richColors closeButton position="bottom-right" />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
