/**
 * Layout para panel (admin o programador) con área de contenido.
 * Prácticas: UX (consistencia), Routing anidado protegido.
 */
import { Outlet, Link, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { Home, Users, FolderOpen, Calendar, Briefcase, MessageSquare, User } from 'lucide-react'
import { motion } from 'framer-motion'

const DashboardLayout = ({ role }: { role: 'admin' | 'programmer' }) => {
  const location = useLocation()

  const adminLinks = [
    { to: '/admin', label: 'Resumen', icon: Home },
    { to: '/admin/programadores', label: 'Programadores', icon: Users },
    { to: '/admin/proyectos', label: 'Proyectos', icon: FolderOpen },
    { to: '/admin/horarios', label: 'Horarios', icon: Calendar },
  ]

  const programmerLinks = [
    { to: '/panel', label: 'Dashboard', icon: Home },
    { to: '/panel/perfil', label: 'Mi Perfil', icon: User },
    { to: '/panel/portafolio', label: 'Portafolio', icon: Briefcase },
    { to: '/panel/proyectos', label: 'Proyectos', icon: FolderOpen },
    { to: '/panel/asesorias', label: 'Asesorías', icon: MessageSquare },
  ]

  const links = role === 'admin' ? adminLinks : programmerLinks

  const isActive = (path: string) => {
    if (path === '/admin' || path === '/panel') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFFAF0 0%, #FFF8E7 50%, #FFF5E6 100%)' }}>
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="sticky top-24 rounded-2xl bg-white border border-[#D4AF37]/15 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-[#D4AF37]/10" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(184, 134, 11, 0.04))' }}>
                <p className="text-xs uppercase tracking-wider text-[#8B7355] font-body mb-1">Panel</p>
                <h2 className="text-xl font-display font-bold text-[#5D4E37] capitalize">
                  {role === 'admin' ? 'Administración' : 'Mi Panel'}
                </h2>
              </div>

              {/* Navigation */}
              <nav className="p-3">
                <ul className="space-y-1">
                  {links.map((link) => {
                    const Icon = link.icon
                    const active = isActive(link.to)
                    return (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all duration-200 ${
                            active 
                              ? 'text-white shadow-md' 
                              : 'text-[#5D4E37]/70 hover:bg-[#FFF5E6] hover:text-[#D4AF37]'
                          }`}
                          style={active ? { background: 'linear-gradient(135deg, #D4AF37, #B8860B)' } : {}}
                        >
                          <Icon size={18} />
                          {link.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Footer Info */}
              <div className="p-4 border-t border-[#D4AF37]/10">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-[#8B7355] font-body">Sistema activo</span>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0"
          >
            <div className="rounded-2xl bg-white border border-[#D4AF37]/15 shadow-lg overflow-hidden">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
