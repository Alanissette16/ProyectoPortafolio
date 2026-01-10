/**
 * Layout para vistas públicas.
 * Prácticas: Routing y UX (diferenciar público vs dashboard).
 */
import { Outlet } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
const PublicLayout = () => (
  <div className="min-h-screen bg-base-100 text-base-content">
    <NavBar />
    <main className="container mx-auto px-4 py-10 pt-24">
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default PublicLayout
