import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BusProvider } from './context/BusContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BusProvider>
      <App/>
    </BusProvider>
  </React.StrictMode>,
)
