import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './global.css'
import { BrowserRouter } from 'react-router-dom'
import ContextProvider from './components/context/mainContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextProvider>
  /* </React.StrictMode>  */
)
