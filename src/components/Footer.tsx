/**
 * Footer FOREING - Estilo femenino, elegante y sofisticado
 * Versión mejorada visualmente: mejor jerarquía, más respiro y detalles premium
 */

import { motion } from 'framer-motion'
import {
  ArrowUp,
  Flower2,
  Github,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles
} from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'

// Colores por tema
const themeColors = {
  rosegold: {
    primary: '#D4AF37',
    secondary: '#B8860B',
    accent: '#D4A574',
    textDark: '#5D4E37',
    textMid: '#6B5A3C',
    textLight: '#7A6743',
    textMuted: '#8B7355',
    bgFrom: '#FFF9F2',
    bgVia: '#FFF4E4',
    bgTo: '#FFE7C7',
    bgCard: 'rgba(255,255,255,0.95)',
    bgCardAlt: 'rgba(255,248,231,0.96)',
  },
  lavender: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    textDark: '#4C4160',
    textMid: '#5B4B6E',
    textLight: '#6D5D8A',
    textMuted: '#9D8FB5',
    bgFrom: '#FAF5FF',
    bgVia: '#F3E8FF',
    bgTo: '#E9D5FF',
    bgCard: 'rgba(255,255,255,0.95)',
    bgCardAlt: 'rgba(250,245,255,0.96)',
  },
  rosepink: {
    primary: '#EC4899',
    secondary: '#DB2777',
    accent: '#F472B6',
    textDark: '#9D174D',
    textMid: '#831843',
    textLight: '#BE185D',
    textMuted: '#F9A8D4',
    bgFrom: '#FFF0F5',
    bgVia: '#FFE4EC',
    bgTo: '#FFD6E0',
    bgCard: 'rgba(255,255,255,0.95)',
    bgCardAlt: 'rgba(255,240,245,0.96)',
  },
}

const Footer = () => {
  const { theme } = useTheme()
  // Fallback a rosegold si el tema no existe en themeColors
  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.rosegold
  const currentYear = new Date().getFullYear()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [clickCount, setClickCount] = useState(0)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Login secreto: 5 clics en el icono de corazón
  const handleSecretClick = () => {
    if (isAuthenticated) return
    
    const newCount = clickCount + 1
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
    }
    
    if (newCount >= 5) {
      setClickCount(0)
      // Usar setTimeout para evitar el error de setState durante render
      setTimeout(() => navigate('/login'), 0)
      return
    }
    
    setClickCount(newCount)
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0)
    }, 2000)
  }

  const footerLinks = {
    empresa: [
      { label: 'Sobre Nosotras', href: '/#sobre-nosotras' },
      { label: 'Nuestro Equipo', href: '/programadores' },
      { label: 'Proyectos', href: '/proyectos' },
      { label: 'Blog', href: '#' },
    ],
    servicios: [
      { label: 'Desarrollo Web', href: '#' },
      { label: 'Diseño UI/UX', href: '#' },
      { label: 'Apps Móviles', href: '#' },
      { label: 'Consultoría', href: '/agendar-asesoria' },
    ],
    legal: [
      { label: 'Política de Privacidad', href: '#' },
      { label: 'Términos de Servicio', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-[#D4AF37]' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-[#D4AF37]' },
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-[#8B7355]' },
  ]

  return (
    <footer 
      className="relative mt-16 pt-20 overflow-hidden border-t transition-colors duration-300"
      style={{
        background: `linear-gradient(to bottom, ${colors.bgFrom}, ${colors.bgVia}, ${colors.bgTo})`,
        borderColor: `${colors.primary}33`
      }}
    >
      {/* Fondo decorativo premium */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute bottom-0 right-0 w-[420px] h-[260px] blur-2xl" 
          style={{ background: `linear-gradient(to top left, ${colors.primary}1F, transparent)` }}
        />
        <div 
          className="absolute top-0 left-0 w-[280px] h-[180px] blur-2xl" 
          style={{ background: `linear-gradient(to bottom right, ${colors.secondary}1A, transparent)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[420px] rounded-full blur-3xl" 
          style={{ background: `radial-gradient(circle, ${colors.primary}1A, transparent, transparent)` }}
        />
        {/* Partículas suaves */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              top: `${20 + (i % 4) * 18}%`,
              left: `${15 + i * 10}%`,
              opacity: 0.4,
              backgroundColor: `${colors.primary}99`,
              boxShadow: `0 0 14px ${colors.primary}99`,
            }}
          />
        ))}
      </div>

      {/* Botón scroll to top - FIJO en la esquina inferior derecha */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-5 sm:right-8 bottom-6 sm:bottom-8 p-3.5 sm:p-4 rounded-full text-white shadow-xl border border-white/40 z-50"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          boxShadow: `0 12px 40px ${colors.primary}73`
        }}
        aria-label="Volver arriba"
      >
        <ArrowUp size={18} />
      </motion.button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div
          className="relative mb-16 p-6 sm:p-8 md:p-10 rounded-3xl border backdrop-blur-md transition-colors duration-300"
          style={{
            background: `linear-gradient(135deg, ${colors.bgCard}, ${colors.bgCardAlt})`,
            borderColor: `${colors.primary}40`,
            boxShadow: `0 18px 60px ${colors.primary}40`
          }}
        >
          {/* Badge superior */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border bg-white/70"
            style={{ borderColor: `${colors.primary}4D` }}
          >
            <Sparkles style={{ color: colors.primary }} size={14} />
            <span 
              className="text-[11px] tracking-[0.18em] uppercase font-semibold font-body"
              style={{ color: colors.textMuted }}
            >
              Newsletter exclusivo
            </span>
          </div>

          <div className="absolute -top-6 right-4 sm:right-8">
            <motion.div
              animate={{ y: [0, -4, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="p-3 rounded-2xl bg-white/70 border"
              style={{ 
                borderColor: `${colors.primary}40`,
                boxShadow: `0 10px 30px ${colors.primary}59`
              }}
            >
              <Flower2 style={{ color: colors.primary }} size={22} />
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-[1.4fr_minmax(0,1.3fr)] gap-8 items-center">
            <div>
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3 leading-tight"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`, 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}
              >
                Mantente inspirada y a la vanguardia.
              </h3>
              <p className="text-sm sm:text-base font-body max-w-md"
                style={{ color: colors.textMid }}
              >
                Recibe ideas, tips de diseño, recursos descargables y novedades de nuestros proyectos directamente en tu bandeja de entrada.
              </p>
            </div>
            
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.primary }} size={18} />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white/90 outline-none transition-all font-body text-sm sm:text-base shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
                  style={{ 
                    border: `1px solid ${colors.primary}59`, 
                    color: colors.textDark,
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base text-white font-semibold transition-all font-body hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 10px 34px ${colors.primary}73`
                }}
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-12">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <Logo size={56} />
                <motion.span
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <div>
                <span 
                  className="text-2xl font-display font-bold tracking-wide"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}
                >
                  FOREING
                </span>
                <p
                  className="text-[11px] tracking-[0.2em] uppercase font-body mt-1"
                  style={{ color: colors.textMuted }}
                >
                  Creative Tech Studio
                </p>
              </div>
            </Link>
            
            <p
              className="text-sm sm:text-base mb-6 font-body leading-relaxed max-w-sm"
              style={{ color: colors.textMid }}
            >
              Transformamos ideas en experiencias digitales únicas.  
              Diseño elegante, código impecable y una experiencia pensada para tu marca.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:hola@foreing.tech"
                className="flex items-center gap-3 text-sm sm:text-base transition-colors font-body group"
                style={{ color: colors.textMid }}
              >
                <div
                  className="p-2 rounded-xl shrink-0 transition-all group-hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}29, ${colors.secondary}24)` 
                  }}
                >
                  <Mail size={16} style={{ color: colors.primary }} />
                </div>
                hola@foreing.tech
              </a>
              <a
                href="tel:+59312345678"
                className="flex items-center gap-3 text-sm sm:text-base transition-colors font-body group"
                style={{ color: colors.textMid }}
              >
                <div
                  className="p-2 rounded-xl shrink-0 transition-all group-hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}29, ${colors.secondary}24)` 
                  }}
                >
                  <Phone size={16} style={{ color: colors.primary }} />
                </div>
                +593 55 1234 5678
              </a>
              <div
                className="flex items-center gap-3 text-sm sm:text-base font-body"
                style={{ color: colors.textMid }}
              >
                <div
                  className="p-2 rounded-xl shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}29, ${colors.secondary}24)` 
                  }}
                >
                  <MapPin size={16} style={{ color: colors.primary }} />
                </div>
                CUENCA-ECUADOR
              </div>
            </div>
          </div>

          {/* Empresa Links */}
          <div>
            <h4
              className="font-display font-semibold text-lg mb-4 flex items-center gap-2"
              style={{ color: colors.textDark }}
            >
              <Flower2 style={{ color: colors.primary }} size={18} />
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm sm:text-base flex items-center gap-2 group font-body"
                    style={{ color: colors.textLight }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full transition-colors" 
                      style={{ backgroundColor: `${colors.primary}73` }}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios Links */}
          <div>
            <h4
              className="font-display font-semibold text-lg mb-4 flex items-center gap-2"
              style={{ color: colors.textDark }}
            >
              <Sparkles style={{ color: colors.secondary }} size={18} />
              Servicios
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm sm:text-base flex items-center gap-2 group font-body"
                    style={{ color: colors.textLight }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full transition-colors" 
                      style={{ backgroundColor: `${colors.secondary}73` }}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4
              className="font-display font-semibold text-lg mb-4 flex items-center gap-2"
              style={{ color: colors.textDark }}
            >
              <Heart style={{ color: colors.accent, fill: colors.accent }} size={18} />
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm sm:text-base flex items-center gap-2 group font-body"
                    style={{ color: colors.textLight }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full transition-colors" 
                      style={{ backgroundColor: `${colors.accent}73` }}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t py-6 sm:py-8 transition-colors duration-300"
          style={{ borderColor: `${colors.primary}33` }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Copyright con icono secreto */}
            <p
              className="text-[11px] sm:text-sm font-body flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center"
              style={{ color: colors.textLight }}
            >
              © {currentYear} FOREING. Hecho con 
              <motion.button
                onClick={handleSecretClick}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer select-none inline-flex items-center justify-center"
                title={clickCount > 0 ? `${5 - clickCount} clics más...` : undefined}
              >
                <Heart 
                  className={`transition-all duration-300 ${
                    clickCount > 0 ? 'scale-110 animate-bounce' : 'animate-pulse'
                  }`} 
                  style={{ 
                    color: clickCount > 0 ? colors.secondary : colors.primary,
                    fill: clickCount > 0 ? colors.secondary : colors.primary
                  }}
                  size={14} 
                />
                {clickCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-[8px] text-white flex items-center justify-center font-bold"
                    style={{ background: colors.secondary }}
                  >
                    {clickCount}
                  </span>
                )}
              </motion.button>
              por Claudia &amp; Valeria
            </p>

            {/* Social Links */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <span
                className="text-[11px] uppercase tracking-[0.24em] font-semibold font-body"
                style={{ color: colors.textMuted }}
              >
                Síguenos
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl transition-all"
                    style={{ 
                      color: colors.textMid,
                      background: `linear-gradient(135deg, rgba(255,255,255,0.92), ${colors.primary}26)`,
                      boxShadow: '0 10px 26px rgba(0,0,0,0.06)'
                    }}
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
