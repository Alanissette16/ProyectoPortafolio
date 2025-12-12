/**
 * NavBar FOREING - Estilo femenino, elegante y sofisticado
 * Navegación con efectos suaves y colores pasteles
 * Fondo estático (no cambia al hacer scroll)
 */

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase,
  Calendar,
  ChevronDown,
  FileText,
  Flower2,
  Heart,
  Home,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NavBar = () => {
  const { user, role, isAuthenticated, logout } = useAuth()
  const { theme, changeTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const navLinks = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/programadores', icon: Users, label: 'Equipo' },
    { to: '/proyectos', icon: Briefcase, label: 'Proyectos' },
  ]

  const isActive = (path: string) => location.pathname === path

  const themeIcons: Record<string, typeof Sparkles> = {
    rosegold: Flower2,
    lavender: Sparkles,
    rosepink: Heart,
  }

  const themeLabels: Record<string, string> = {
    rosegold: 'Rosa Dorado',
    lavender: 'Lavanda',
    rosepink: 'Rosa Pink',
  }

  const ThemeIcon = themeIcons[theme] || Sparkles

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-lg border-b transition-all duration-500'
      )}
      style={{
        backgroundColor: 'rgba(250, 245, 255, 0.95)',      // fondo estático
        borderColor: 'rgba(139, 92, 246, 0.15)',           // borde estático
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)',  // sombra estática
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo y Marca */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span 
                className="text-2xl font-display font-bold tracking-wide"
                style={{ 
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}
              >
                FOREING
              </span>
              <span 
                className="text-[10px] font-medium tracking-[0.2em] uppercase font-body"
                style={{ color: '#6D5D8A' }}
              >
                ✨ Creative Studio
              </span>
            </div>
          </Link>

          {/* Links Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 font-body',
                  isActive(link.to)
                    ? 'text-white shadow-lg'
                    : 'hover:bg-[#F3EEFF]'
                )}
                style={isActive(link.to) 
                  ? { 
                      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', 
                      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' 
                    }
                  : { color: '#4C4160' }
                }
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && role === 'external' && (
              <div className="relative group">
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium hover:bg-[#F3EEFF] transition-all font-body" 
                  style={{ color: '#4C4160' }}
                >
                  <Calendar size={18} />
                  Agendar
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </button>
                <div 
                  className="absolute top-full left-0 mt-2 w-52 py-3 bg-white rounded-2xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                  style={{ 
                    borderColor: 'rgba(139, 92, 246, 0.2)', 
                    boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)' 
                  }}
                >
                  <Link 
                    to="/agendar-asesoria" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F3EEFF] transition-colors font-body" 
                    style={{ color: '#4C4160' }}
                  >
                    <Calendar size={16} style={{ color: '#8B5CF6' }} />
                    Agendar Cita
                  </Link>
                  <Link 
                    to="/mis-solicitudes" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F3EEFF] transition-colors font-body" 
                    style={{ color: '#4C4160' }}
                  >
                    <FileText size={16} style={{ color: '#8B5CF6' }} />
                    Mis Solicitudes
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Acciones Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-3 rounded-full transition-all duration-300 group hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #F3EEFF, #E9DEFF)' }}
              >
                <ThemeIcon 
                  size={20} 
                  style={{ color: '#8B5CF6' }} 
                  className="group-hover:rotate-12 transition-transform" 
                />
              </button>
              
              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 py-2 bg-white rounded-2xl shadow-xl border"
                    style={{ 
                      borderColor: 'rgba(139, 92, 246, 0.2)', 
                      boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)' 
                    }}
                  >
                    {(['rosegold', 'lavender', 'rosepink'] as const).map((t) => {
                      const Icon = themeIcons[t]
                      return (
                        <button
                          key={t}
                          onClick={() => { changeTheme(t); setThemeDropdownOpen(false); }}
                          className={clsx(
                            'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors font-body',
                            theme === t 
                              ? 'text-[#6D5D8A]' 
                              : 'hover:bg-[#F3EEFF] text-[#4C4160]'
                          )}
                          style={theme === t 
                            ? { background: 'linear-gradient(to right, #F3EEFF, #E9DEFF)' } 
                            : {}}
                        >
                          <Icon size={16} style={{ color: '#8B5CF6' }} />
                          {themeLabels[t]}
                          {theme === t && (
                            <Heart 
                              size={12} 
                              className="ml-auto" 
                              style={{ color: '#8B5CF6', fill: '#8B5CF6' }} 
                            />
                          )}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #F3EEFF, #E9DEFF)' }}
                >
                  <img
                    src={user.photoURL || '/default-avatar.svg'}
                    alt="Usuario"
                    className="w-9 h-9 rounded-full object-cover bg-[#E9D5FF]"
                    style={{ boxShadow: '0 0 0 2px #8B5CF6' }}
                    onError={(e) => { e.currentTarget.src = '/default-avatar.svg' }}
                  />
                  <ChevronDown 
                    size={16} 
                    className={clsx('transition-transform', userDropdownOpen && 'rotate-180')} 
                    style={{ color: '#8B5CF6' }} 
                  />
                </button>
                
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-60 py-2 bg-white rounded-2xl shadow-xl border"
                      style={{ 
                        borderColor: 'rgba(139, 92, 246, 0.2)', 
                        boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)' 
                      }}
                    >
                      <div 
                        className="px-4 py-3 border-b" 
                        style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}
                      >
                        <p className="font-semibold truncate font-body" style={{ color: '#3D3D3D' }}>
                          {user.displayName}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#6D5D8A' }}>
                          {user.email}
                        </p>
                      </div>
                      
                      {role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F3EEFF] transition-colors font-body"
                          style={{ color: '#4C4160' }}
                        >
                          <Settings size={16} style={{ color: '#8B5CF6' }} />
                          Panel Admin
                        </Link>
                      )}
                      
                      {role === 'programmer' && (
                        <Link
                          to="/panel"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F3EEFF] transition-colors font-body"
                          style={{ color: '#4C4160' }}
                        >
                          <Briefcase size={16} style={{ color: '#8B5CF6' }} />
                          Mi Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors font-body"
                      >
                        <LogOut size={16} />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded-full transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #F3EEFF, #E9DEFF)' }}
          >
            {mobileMenuOpen ? (
              <X size={24} style={{ color: '#8B5CF6' }} />
            ) : (
              <Menu size={24} style={{ color: '#8B5CF6' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden backdrop-blur-xl border-t"
            style={{ 
              backgroundColor: 'rgba(250, 245, 255, 0.98)', 
              borderColor: 'rgba(139, 92, 246, 0.15)' 
            }}
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all font-body',
                    isActive(link.to)
                      ? 'text-white'
                      : 'hover:bg-[#F3EEFF]'
                  )}
                  style={isActive(link.to) 
                    ? { background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }
                    : { color: '#4C4160' }
                  }
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated && role === 'external' && (
                <>
                  <div 
                    className="pt-2 pb-1 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2" 
                    style={{ color: '#8B5CF6' }}
                  >
                    <Sparkles size={12} />
                    Asesorías
                  </div>
                  <Link
                    to="/agendar-asesoria"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#F3EEFF] transition-all font-body"
                    style={{ color: '#4C4160' }}
                  >
                    <Calendar size={20} style={{ color: '#8B5CF6' }} />
                    Agendar Cita
                  </Link>
                  <Link
                    to="/mis-solicitudes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#F3EEFF] transition-all font-body"
                    style={{ color: '#4C4160' }}
                  >
                    <FileText size={20} style={{ color: '#8B5CF6' }} />
                    Mis Solicitudes
                  </Link>
                </>
              )}

              {/* Theme buttons mobile */}
              <div 
                className="pt-4 border-t" 
                style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}
              >
                <p 
                  className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2" 
                  style={{ color: '#8B5CF6' }}
                >
                  <Heart size={12} style={{ fill: '#8B5CF6' }} />
                  Tema
                </p>
                <div className="flex gap-2 px-2">
                  {(['rosegold', 'lavender', 'rosepink'] as const).map((t) => {
                    const Icon = themeIcons[t]
                    return (
                      <button
                        key={t}
                        onClick={() => changeTheme(t)}
                        className={clsx(
                          'flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-medium capitalize transition-all font-body',
                          theme === t 
                            ? 'text-white' 
                            : 'hover:bg-[#E9DEFF]'
                        )}
                        style={theme === t 
                          ? { background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }
                          : { 
                              background: 'linear-gradient(135deg, #F3EEFF, #E9DEFF)', 
                              color: '#4C4160' 
                            }
                        }
                      >
                        <Icon size={16} />
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {isAuthenticated && user && (
                <div className="pt-4 border-t border-[#8B5CF6]/20 space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={user.photoURL || '/default-avatar.svg'}
                      alt="Usuario"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8B5CF6] bg-[#E9D5FF]"
                      onError={(e) => { e.currentTarget.src = '/default-avatar.svg' }}
                    />
                    <div>
                      <p 
                        className="font-semibold text-sm font-body" 
                        style={{ color: '#3D3D3D' }}
                      >
                        {user.displayName}
                      </p>
                      <p className="text-xs" style={{ color: '#6D5D8A' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  {role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#4C4160] hover:bg-[#F3EEFF] hover:text-[#8B5CF6] transition-all"
                    >
                      <Settings size={20} />
                      Panel Admin
                    </Link>
                  )}
                  
                  {role === 'programmer' && (
                    <Link
                      to="/panel"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex itemscenter gap-3 px-4 py-3 rounded-2xl text-[#4C4160] hover:bg-[#F3EEFF] hover:text-[#8B5CF6] transition-all"
                    >
                      <Briefcase size={20} />
                      Mi Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={20} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default NavBar
