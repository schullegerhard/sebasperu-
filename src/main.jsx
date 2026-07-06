import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { ProductOverridesProvider } from './context/ProductOverrides.jsx'
import './index.css'
import './pages.css'
import './theme.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductOverridesProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ProductOverridesProvider>
    </BrowserRouter>
  </React.StrictMode>
)
