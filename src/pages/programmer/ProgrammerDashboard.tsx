/**
 * Dashboard del Programador.
 * Prácticas: UX (feedback de progreso), accesos a portafolio/proyectos/asesorías.
 */
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, FolderOpen, MessageSquare, Sparkles, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { listAdvisoriesByProgrammer } from '../../services/firestore'

const ProgrammerDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const dashboardCards = [
    {
      title: 'Mi Perfil',
      description: 'Edita tu foto, nombre, bio y especialidad profesional.',
      icon: User,
      link: '/panel/perfil',
      buttonText: 'Editar Perfil',
      gradient: 'from-[#D4AF37] to-[#B8860B]',
      bgGradient: 'from-[#D4AF37]/10 to-[#B8860B]/5'
    },
    {
      title: 'Mi Portafolio',
      description: 'Personaliza tu headline, habilidades y sección sobre mí.',
      icon: Briefcase,
      link: '/panel/portafolio',
      buttonText: 'Editar Portafolio',
      gradient: 'from-[#B8860B] to-[#8B7355]',
      bgGradient: 'from-[#B8860B]/10 to-[#8B7355]/5'
    },
    {
      title: 'Mis Proyectos',
      description: 'Gestiona tus proyectos académicos y profesionales.',
      icon: FolderOpen,
      link: '/panel/proyectos',
      buttonText: 'Gestionar',
      gradient: 'from-[#D4A574] to-[#8B7355]',
      bgGradient: 'from-[#D4A574]/10 to-[#8B7355]/5'
    },
    {
      title: 'Asesorías',
      description: 'Revisa y responde solicitudes de usuarios interesados.',
      icon: MessageSquare,
      link: '/panel/asesorias',
      buttonText: 'Ver Solicitudes',
      gradient: 'from-[#D4AF37] to-[#D4A574]',
      bgGradient: 'from-[#D4AF37]/10 to-[#D4A574]/5'
    }
  ]

  // Sincronizar asesorías pendientes
  const { user } = useAuth()
  const [pendingCount, setPendingCount] = useState<number>(0)
  useEffect(() => {
    const fetchAdvisories = async () => {
      if (!user) return
      try {
        const advisories = await listAdvisoriesByProgrammer(user.uid, user.email ?? undefined)
        const pendientes = advisories.filter((a: any) => a.status === 'pendiente')
        setPendingCount(pendientes.length)
      } catch (err) {
        setPendingCount(0)
      }
    }
    fetchAdvisories()
  }, [user])

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#FFF9F4] via-[#FFF4E7] to-[#FFE7C7] px-6 pt-20">
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl p-8 border border-[#D4AF37]/20"
        style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 134, 11, 0.05), rgba(255, 250, 240, 0.8))' }}
      >
        <div className="absolute top-4 right-4 animate-pulse">
          <Sparkles className="text-[#D4AF37]" size={28} />
        </div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-2xl" />
        
        <div className="relative ">
          <h1 className="text-3xl font-display font-bold text-[#5D4E37] mb-2">
            ¡Bienvenida de vuelta! ✨
          </h1>
          <p className="text-[#8B7355] font-body max-w-2xl">
            Completa tu portafolio y publica proyectos para que sean visibles en la página pública. 
            Tu perfil profesional es tu carta de presentación.
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all">
          <p className="text-2xl font-display font-bold text-[#5D4E37]">142</p>
          <p className="text-sm text-[#8B7355] font-body">Visitas al Perfil</p>
          <span className="text-xs text-[#D4AF37] font-semibold">+12%</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all">
          <p className="text-2xl font-display font-bold text-[#5D4E37]">8</p>
          <p className="text-sm text-[#8B7355] font-body">Proyectos</p>
          <span className="text-xs text-[#D4AF37] font-semibold">+2</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all">
          <p className="text-2xl font-display font-bold text-[#5D4E37]">{pendingCount}</p>
          <p className="text-sm text-[#8B7355] font-body">Asesorías Pendientes</p>
          <span className="text-xs text-[#D4AF37] font-semibold">Nuevas</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all">
          <p className="text-2xl font-display font-bold text-[#5D4E37]">4.9</p>
          <p className="text-sm text-[#8B7355] font-body">Valoración</p>
          <span className="text-xs text-[#D4AF37] font-semibold">⭐</span>
        </div>
      </motion.div>

      {/* Action Cards Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl bg-white border border-[#D4AF37]/15 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative p-6">
              {/* Icon */}
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${card.gradient}`}
              >
                <card.icon className="text-white" size={26} />
              </div>

              {/* Content */}
              <h2 className="text-lg font-display font-bold text-[#5D4E37] mb-2">
                {card.title}
              </h2>
              <p className="text-sm text-[#8B7355] font-body mb-4 leading-relaxed">
                {card.description}
              </p>

              {/* Action Button */}
              <Link 
                to={card.link}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-sm font-body transition-all hover:scale-105 bg-gradient-to-r ${card.gradient}`}
              >
                {card.buttonText}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Decorative Corner */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full" />
          </motion.div>
        ))}
      </motion.div>

      {/* Tips Section */}
      <motion.div 
        variants={itemVariants}
        className="rounded-2xl p-6 border border-[#D4AF37]/20"
        style={{ background: 'linear-gradient(135deg, rgba(255, 250, 240, 0.9), rgba(255, 248, 231, 0.9))' }}
      >
        <h3 className="text-lg font-display font-bold text-[#5D4E37] mb-4 flex items-center gap-2">
          <Sparkles className="text-[#D4AF37]" size={20} />
          Consejos para destacar
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            'Añade una foto profesional y una bio que refleje tu personalidad',
            'Mantén actualizados tus proyectos con capturas y descripciones detalladas',
            'Responde a las solicitudes de asesoría en menos de 24 horas'
          ].map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                {index + 1}
              </div>
              <p className="text-sm text-[#5D4E37]/80 font-body">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  </div>
  )
}

export default ProgrammerDashboard
