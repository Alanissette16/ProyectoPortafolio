//punto de entrada de la aplicación React
//monta contextos globales (autenticación, tema) y el sistema de enrutamiento
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

//obtener elemento raíz del DOM
const rootElement = document.getElementById('root') as HTMLElement

//renderizar la aplicación con todos los providers necesarios
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
