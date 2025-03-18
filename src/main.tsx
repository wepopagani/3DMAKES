import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Fix per useLayoutEffect in ambienti SSR/SSG
if (typeof window === 'undefined') {
  React.useLayoutEffect = React.useEffect;
} else if (!React.useLayoutEffect) {
  React.useLayoutEffect = React.useEffect;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)