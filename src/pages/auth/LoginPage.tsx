/**
 * LoginPage FOREING - Página de inicio de sesión con estilo femenino
 * Versión refinada: diseño más elegante, suave y “premium”
 * Ahora adaptable a temas (Rosegold, Lavender, Rosepink)
 */

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Flower2,
  Heart,
  Lock,
  Mail,
  Sparkles,
  Star,
  User,
  AlertTriangle
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FormUtils } from '../../utils/FormUtils'
import SEOHead from '../../components/common/SEOHead'

// Imagen de fondo
import logoPremium from '../../assets/images/logos/logo-premium.png'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const navigate = useNavigate()
  const { login, register } = useAuth()



  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Reglas de validación
    const loginRules = {
      email: [FormUtils.required, FormUtils.email],
      password: [FormUtils.required, (v: string) => FormUtils.minLength(v, 6)]
    }

    const registerRules = {
      ...loginRules,
      displayName: [FormUtils.required]
    }

    const formData = { email, password, displayName }
    const rules = isRegisterMode ? registerRules : loginRules

    // Validar
    const validationErrors = FormUtils.validateForm(formData, rules)

    if (FormUtils.hasErrors(validationErrors)) {
      // Priorizar mostrar el primer error encontrado
      const firstErrorKey = Object.keys(validationErrors)[0]
      setError(validationErrors[firstErrorKey])
      return
    }

    setLoading(true)

    try {
      if (isRegisterMode) {
        await register(email, password, displayName)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err: any) {
      console.error('Login/Register error:', err)
      // Priorizamos el mensaje que viene del backend
      const errorMessage = err.message || 'Error al procesar la solicitud. Inténtalo de nuevo.'

      // Mapeo simple de mensajes comunes si queremos personalizarlos
      if (errorMessage.includes('Credenciales inválidas')) {
        setError('Email o contraseña incorrectos. Verifica tus datos.')
      } else if (errorMessage.toLowerCase().includes('usuario no encontrado') || errorMessage.includes('404')) {
        setError('No existe una cuenta con este email. ¿Quieres registrarte?')
      } else if (errorMessage.includes('email ya existe') || errorMessage.includes('409')) {
        setError('Este correo ya está registrado. Intenta iniciar sesión.')
      } else if (errorMessage.includes('401')) {
        setError('No autorizado. Tu sesión puede haber expirado.')
      } else {
        setError(errorMessage)
      }
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-base-100 pt-10 text-base-content">
      <SEOHead title="Iniciar Sesión" description="Accede a tu cuenta e inicia tu viaje creativo con FOREING." />
      {/* Panel izquierdo - Decorativo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        {/* Decoraciones de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-12 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-24 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-white/20 rounded-full" />
          <img
            src={logoPremium}
            alt="FOREING emblem"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 object-contain opacity-20 mix-blend-overlay"
          />
        </div>

        {/* Partículas flotantes */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-40"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.35, 0.9, 0.35],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-primary-content">
          {/* Logo clickeable para login secreto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              {/* <Logo size={120} enableSecretLogin={true} /> */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4"
              >
                <Sparkles size={32} className="text-yellow-200 drop-shadow-[0_0_12px_rgba(250,250,210,0.9)]" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-5xl font-display font-bold mb-3 text-center tracking-[0.18em]"
          >
            F O R E I N G
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-primary-content/90 font-body text-center max-w-md mb-10"
          >
            Creative Tech Studio ✨
            <span className="block text-sm text-primary-content/80 mt-3">
              Diseño, desarrollo y experiencias digitales con esencia única.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center shadow-md bg-white/20 backdrop-blur-sm"
              >
                <Flower2 size={20} className="text-white" />
              </div>
              <div
                className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center shadow-md bg-white/20 backdrop-blur-sm"
              >
                <Star size={20} className="text-white" />
              </div>
              <div
                className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center shadow-md bg-white/20 backdrop-blur-sm"
              >
                <Heart size={20} className="text-white" />
              </div>
            </div>
            <p className="text-primary-content/90 font-body text-sm">
              Únete a una experiencia digital
              <span className="block text-primary-content/75 text-xs">cuidada, femenina y sofisticada.</span>
            </p>
          </motion.div>

          {/* Texto flotante inferior */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-primary-content/70 text-xs font-body flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary-content/40" />
              Diseño y desarrollo con amor
              <span className="w-8 h-[1px] bg-primary-content/40" />
            </p>
          </motion.div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-base-100">
        <div className="w-full max-w-md relative">
          {/* Brillito decorativo detrás del card */}
          <div className="absolute -top-10 -right-6 w-40 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 -left-10 w-40 h-40 bg-secondary/20 blur-3xl rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative rounded-[2rem] bg-base-100/80 backdrop-blur-xl border border-primary/20 shadow-xl p-6 sm:p-8"
          >
            {/* Logo móvil */}
            <div className="lg:hidden flex flex-col items-center mb-6">
              {/* <Logo size={80} enableSecretLogin={true} /> */}
              <h1 className="text-3xl font-display font-bold mt-4 text-primary tracking-[0.14em] uppercase">
                Foreing
              </h1>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 border border-primary/20 bg-primary/5"
              >
                <Heart className="text-primary fill-primary" size={14} />
                <span className="text-xs sm:text-sm font-medium text-primary font-body">
                  {isRegisterMode ? 'Crea tu cuenta' : 'Bienvenida de nuevo'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-base-content mb-2">
                {isRegisterMode ? 'Registrarse' : 'Iniciar sesión'}
              </h2>

              <p className="text-xs sm:text-sm text-base-content/70 font-body">
                {isRegisterMode
                  ? 'Únete a FOREING y comienza tu viaje creativo ✨'
                  : 'Accede a tu espacio creativo y continúa donde lo dejaste ✨'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-2xl bg-error/10 border border-error/20 text-error text-xs sm:text-sm font-body flex items-center gap-2"
              >
                <AlertTriangle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}



            {/* Email Form */}
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              onSubmit={handleEmailLogin}
              className="space-y-5"
            >
              {/* Name Input - Solo en modo registro */}
              {isRegisterMode && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2 font-medium text-base-content/80">
                      <User size={14} className="text-primary" />
                      Nombre completo
                    </span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu nombre"
                    className="input input-bordered w-full focus:input-primary bg-base-100"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2 font-medium text-base-content/80">
                    <Mail size={14} className="text-primary" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input input-bordered w-full focus:input-primary bg-base-100"
                />
              </div>

              {/* Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2 font-medium text-base-content/80">
                    <Lock size={14} className="text-secondary" />
                    Contraseña
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input input-bordered w-full focus:input-primary bg-base-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password - Solo en modo login */}
              {!isRegisterMode && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs sm:text-sm text-primary hover:text-primary-focus font-medium font-body transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-2xl text-primary-content font-bold shadow-lg shadow-primary/30"
              >
                {loading ? 'Procesando...' : (isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión')}
                {!loading && <ArrowRight size={20} />}
              </button>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="mt-7 sm:mt-8"
            >
              <p className="text-center text-[11px] sm:text-sm text-base-content/70 font-body">
                {isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode)
                    setError('')
                    setDisplayName('')
                  }}
                  className="text-primary hover:text-primary-focus font-semibold underline-offset-4 hover:underline transition-colors"
                >
                  {isRegisterMode ? 'Inicia sesión' : 'Regístrate gratis'}
                </button>
              </p>

              <div className="flex items-center justify-center gap-3 mt-5">
                <Heart size={15} className="text-primary fill-primary" />
                <span className="text-[10px] sm:text-xs text-base-content/50 font-body tracking-[0.18em] uppercase">
                  Hecho con amor por FOREING
                </span>
                <Heart size={15} className="text-primary fill-primary" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
