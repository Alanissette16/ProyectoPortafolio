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
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Logo from '../common/Logo'

// Eliminado themeColors para usar variables CSS de DaisyUI

const Footer = () => {
  const { theme } = useTheme()
  // Usamos variables de DaisyUI, no necesitamos colors object
  const currentYear = new Date().getFullYear()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, role } = useAuth()
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
    <footer className="relative mt-16 pt-20 overflow-hidden border-t border-primary/20 bg-base-200 transition-colors duration-300">
      {/* Fondo decorativo premium */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[420px] h-[260px] blur-2xl bg-primary/5" />
        <div className="absolute top-0 left-0 w-[280px] h-[180px] blur-2xl bg-secondary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[420px] rounded-full blur-3xl bg-primary/5" />
        {/* Partículas suaves */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_14px_currentColor] text-primary"
            style={{
              top: `${20 + (i % 4) * 18}%`,
              left: `${15 + i * 10}%`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Botón scroll to top - FIJO en la esquina inferior derecha */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-5 sm:right-8 bottom-6 sm:bottom-8 p-3.5 sm:p-4 rounded-full text-primary-content shadow-xl border border-white/20 z-50 bg-gradient-to-br from-primary to-secondary shadow-primary/30"
        aria-label="Volver arriba"
      >
        <ArrowUp size={18} />
      </motion.button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section - Agendar Cita - SOLO para usuarios external autenticados y SOLO en Home */}
        {/* CTA Section removed to avoid duplication with Home Hero */}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-12">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <Logo size={56} />
                <motion.span
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <div>
                <span className="text-2xl font-display font-bold tracking-wide bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  FOREING
                </span>
                <p className="text-[11px] tracking-[0.2em] uppercase font-body mt-1 text-base-content/60">
                  Creative Tech Studio
                </p>
              </div>
            </Link>

            <p className="text-sm sm:text-base mb-6 font-body leading-relaxed max-w-sm text-base-content/70">
              Transformamos ideas en experiencias digitales únicas.
              Diseño elegante, código impecable y una experiencia pensada para tu marca.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:hola@foreing.tech"
                className="flex items-center gap-3 text-sm sm:text-base transition-colors font-body group text-base-content/70 hover:text-primary"
              >
                <div className="p-2 rounded-2xl shrink-0 transition-all group-hover:scale-105 bg-primary/10 text-primary">
                  <Mail size={16} />
                </div>
                hola@foreing.tech
              </a>
              <a
                href="tel:+59312345678"
                className="flex items-center gap-3 text-sm sm:text-base transition-colors font-body group text-base-content/70 hover:text-primary"
              >
                <div className="p-2 rounded-2xl shrink-0 transition-all group-hover:scale-105 bg-primary/10 text-primary">
                  <Phone size={16} />
                </div>
                +593 55 1234 5678
              </a>
              <div className="flex items-center gap-3 text-sm sm:text-base font-body text-base-content/70">
                <div className="p-2 rounded-2xl shrink-0 bg-primary/10 text-primary">
                  <MapPin size={16} />
                </div>
                CUENCA-ECUADOR
              </div>
            </div>
          </div>

          {/* Empresa Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4 flex items-center gap-2 text-base-content">
              <Flower2 className="text-primary" size={18} />
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm sm:text-base flex items-center gap-2 group font-body text-base-content/70 hover:text-primary transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full transition-colors bg-primary/40 group-hover:bg-primary" />
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
            <h4 className="font-display font-semibold text-lg mb-4 flex items-center gap-2 text-base-content">
              <Sparkles className="text-secondary" size={18} />
              Servicios
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm sm:text-base flex items-center gap-2 group font-body text-base-content/70 hover:text-secondary transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full transition-colors bg-secondary/40 group-hover:bg-secondary" />
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
            <h4 className="font-display font-semibold text-lg mb-4 flex items-center gap-2 text-base-content">
              <Heart className="text-accent fill-accent" size={18} />
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm sm:text-base flex items-center gap-2 group font-body text-base-content/70 hover:text-accent transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full transition-colors bg-accent/40 group-hover:bg-accent" />
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
        <div className="border-t border-primary/20 py-6 sm:py-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Copyright con icono secreto */}
            <p className="text-[11px] sm:text-sm font-body flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center text-base-content/60">
              © {currentYear} FOREING. Hecho con
              <motion.button
                onClick={handleSecretClick}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer select-none inline-flex items-center justify-center"
                title={clickCount > 0 ? `${5 - clickCount} clics más...` : undefined}
              >
                <Heart
                  className={`transition-all duration-300 text-primary ${clickCount > 0 ? 'scale-110 animate-bounce text-secondary fill-secondary' : 'animate-pulse fill-primary'
                    }`}
                  size={14}
                />
                {clickCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-[8px] text-primary-content flex items-center justify-center font-bold bg-secondary">
                    {clickCount}
                  </span>
                )}
              </motion.button>
              por Claudia &amp; Valeria
            </p>

            {/* Social Links */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] font-semibold font-body text-base-content/50">
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
                    className="p-2.5 rounded-2xl transition-all text-base-content/70 bg-base-100 shadow-sm hover:text-primary hover:shadow-md"
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
