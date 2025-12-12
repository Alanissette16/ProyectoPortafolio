/**
 * LoginPage FOREING - Página de inicio de sesión con estilo femenino
 * Versión refinada: diseño más elegante, suave y “premium”
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
  User
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../../services/auth'

// Imagen de fondo
import logoPremium from '../../img/logopremiun.png'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err: any) {
      setError('Error al iniciar sesión con Google. Por favor intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Por favor completa todos los campos 💖')
      return
    }
    
    if (isRegisterMode && !displayName) {
      setError('Por favor ingresa tu nombre 💖')
      return
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres 💖')
      return
    }
    
    setLoading(true)
    
    try {
      if (isRegisterMode) {
        await registerWithEmail(email, password, displayName)
      } else {
        await loginWithEmail(email, password)
      }
      navigate('/')
    } catch (err: any) {
      // Mensajes de error amigables
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este email. ¿Quieres registrarte? 💖')
      } else if (err.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta. Inténtalo de nuevo 💖')
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado. Intenta iniciar sesión 💖')
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del email no es válido 💖')
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil. Usa al menos 6 caracteres 💖')
      } else if (err.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas. Verifica tu email y contraseña 💖')
      } else {
        setError('Error al procesar la solicitud. Inténtalo de nuevo 💖')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#FFF9F4] via-[#FFF4E7] to-[#FFE7C7] pt-10">
      {/* Panel izquierdo - Decorativo */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #D4AF37, #B8860B, #D4A574)' }}
      >
        {/* Decoraciones de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-12 w-64 h-64 bg-white/12 rounded-full blur-3xl" />
          <div className="absolute bottom-24 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-white/10 rounded-full" />
          <img
            src={logoPremium}
            alt="FOREING emblem"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 object-contain opacity-15"
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
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo clickeable para login secreto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              <Logo size={120} enableSecretLogin={true} />
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
            className="text-lg text-white/85 font-body text-center max-w-md mb-10"
          >
            Creative Tech Studio ✨  
            <span className="block text-sm text-white/70 mt-3">
              Diseño, desarrollo y experiencias digitales con esencia dorada.
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
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(to right, #D4AF37, #D4A574)' }}
              >
                <Flower2 size={20} />
              </div>
              <div
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(to right, #B8860B, #D4AF37)' }}
              >
                <Star size={20} />
              </div>
              <div
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(to right, #D4A574, #D4AF37)' }}
              >
                <Heart size={20} />
              </div>
            </div>
            <p className="text-white/85 font-body text-sm">
              Únete a una experiencia digital  
              <span className="block text-white/70 text-xs">cuidada, femenina y sofisticada.</span>
            </p>
          </motion.div>
          
          {/* Texto flotante inferior */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-white/65 text-xs font-body flex items-center gap-2">
              <span className="w-8 h-[1px] bg-white/35" />
              Diseño y desarrollo con amor
              <span className="w-8 h-[1px] bg-white/35" />
            </p>
          </motion.div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md relative">
          {/* Brillito decorativo detrás del card */}
          <div className="absolute -top-10 -right-6 w-40 h-40 bg-[#D4AF37]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 -left-10 w-40 h-40 bg-[#FFE7C7]/60 blur-3xl rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative rounded-[2rem] bg-white/90 backdrop-blur-xl border border-[#D4AF37]/18 shadow-[0_20px_55px_rgba(212,175,55,0.18)] p-6 sm:p-8"
          >
            {/* Logo móvil */}
            <div className="lg:hidden flex flex-col items-center mb-6">
              <Logo size={80} enableSecretLogin={true} />
              <h1
                className="text-3xl font-display font-bold mt-4 bg-clip-text text-transparent tracking-[0.14em] uppercase"
                style={{ backgroundImage: 'linear-gradient(to right, #D4AF37, #B8860B)' }}
              >
                Foreing
              </h1>
            </div>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 border border-[#D4AF37]/30"
                style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF2D9)' }}
              >
                <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={14} />
                <span className="text-xs sm:text-sm font-medium text-[#B8860B] font-body">
                  {isRegisterMode ? 'Crea tu cuenta' : 'Bienvenida de nuevo'}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#3D3321] mb-2">
                {isRegisterMode ? 'Registrarse' : 'Iniciar sesión'}
              </h2>
              
              <p className="text-xs sm:text-sm text-[#7C6A4A] font-body">
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
                className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm font-body flex items-center gap-2"
              >
                <span>⚠️</span>
                {error}
              </motion.div>
            )}
            
            {/* Google Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-[#D4AF37]/22 hover:border-[#D4AF37]/45 transition-all duration-300 shadow-[0_10px_22px_rgba(212,175,55,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-sm sm:text-base text-[#3D3321] font-body">
                {loading ? 'Conectando...' : 'Continuar con Google'}
              </span>
            </motion.button>
            
            {/* Divider */}
            <div className="relative my-7 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D4AF37]/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white/95 text-[11px] sm:text-xs text-[#8D7A53] font-body flex items-center gap-2 rounded-full border border-[#D4AF37]/15">
                  <Sparkles size={12} className="text-[#D4AF37]" />
                  o continúa con tu email
                  <Sparkles size={12} className="text-[#B8860B]" />
                </span>
              </div>
            </div>
            
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
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium text-[#5D4C30] font-body flex items-center gap-2">
                    <User size={14} className="text-[#D4AF37]" />
                    Nombre completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-white border-2 border-[#D4AF37]/20 focus:border-[#D4AF37]/55 focus:ring-4 focus:ring-[#D4AF37]/12 outline-none transition-all font-body text-sm sm:text-base"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-[#5D4C30] font-body flex items-center gap-2">
                  <Mail size={14} className="text-[#D4AF37]" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-white border-2 border-[#D4AF37]/20 focus:border-[#D4AF37]/55 focus:ring-4 focus:ring-[#D4AF37]/12 outline-none transition-all font-body text-sm sm:text-base"
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-[#5D4C30] font-body flex items-center gap-2">
                  <Lock size={14} className="text-[#B8860B]" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-white border-2 border-[#D4AF37]/20 focus:border-[#D4AF37]/55 focus:ring-4 focus:ring-[#D4AF37]/12 outline-none transition-all font-body pr-11 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B2A079] hover:text-[#D4AF37] transition-colors"
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
                    className="text-xs sm:text-sm text-[#D4AF37] hover:text-[#B8860B] font-medium font-body"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-3 p-3.5 sm:p-4 rounded-2xl text-white font-bold transition-all duration-300 shadow-[0_20px_30px_rgba(212,175,55,0.35)] font-body disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B, #D4A574)' }}
              >
                {loading ? 'Procesando...' : (isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión')}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </motion.form>
            
            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="mt-7 sm:mt-8"
            >
              <p className="text-center text-[11px] sm:text-sm text-[#8F7A51] font-body">
                {isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                <button 
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode)
                    setError('')
                    setDisplayName('')
                  }}
                  className="text-[#D4AF37] hover:text-[#B8860B] font-semibold underline-offset-4 hover:underline"
                >
                  {isRegisterMode ? 'Inicia sesión' : 'Regístrate gratis'}
                </button>
              </p>
              
              <div className="flex items-center justify-center gap-3 mt-5">
                <Heart size={15} className="text-[#D4AF37] fill-[#D4AF37]" />
                <span className="text-[10px] sm:text-xs text-[#B49A69] font-body tracking-[0.18em] uppercase">
                  Hecho con amor por FOREING
                </span>
                <Heart size={15} className="text-[#D4AF37] fill-[#D4AF37]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
