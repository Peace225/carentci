import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './context/CartContext'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5min
      retry: 1, // Évite de spammer ton backend Render si il cold start
      refetchOnWindowFocus: false, // Évite les requêtes à chaque retour sur l'onglet
    },
    mutations: {
      retry: 0, // Pas de retry sur POST/PUT/DELETE
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)