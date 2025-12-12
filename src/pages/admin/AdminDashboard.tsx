/**
 * Dashboard del Administrador (resumen).
 * Prácticas: UX con tarjetas, acceso rápido a CRUD de programadores/horarios.
 */
import { collection, getDocs, query, where } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, Settings, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../services/firebase'

const AdminDashboard = () => {
  const [programmersCount, setProgrammersCount] = useState<number>(0)
  const [pendingAdvisories, setPendingAdvisories] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Contar programadores
        const programmersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'programmer')
        )
        const programmersSnap = await getDocs(programmersQuery)
        setProgrammersCount(programmersSnap.size)

        // Contar asesorías pendientes
        const advisoriesQuery = query(
          collection(db, 'advisories'),
          where('status', '==', 'pendiente')
        )
        const advisoriesSnap = await getDocs(advisoriesQuery)
        setPendingAdvisories(advisoriesSnap.size)
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

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

  return (
    <motion.div 
      className="space-y-8 p-6 pt-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#5D4E37] mb-2">
          Panel de Administración
        </h1>
        <p className="text-[#8B7355] font-body">
          Bienvenida de vuelta. Aquí tienes un resumen de tu sistema.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Programadores */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-white border border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                <Users className="text-white" size={24} />
              </div>
              <TrendingUp className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-4xl font-display font-bold text-[#5D4E37] mb-1">
              {loading ? '...' : programmersCount}
            </h3>
            <p className="text-[#8B7355] font-body text-sm">Programadores Activos</p>
          </div>
        </div>

        {/* Asesorías Pendientes */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-white border border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#B8860B]/10 to-transparent rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #B8860B, #8B7355)' }}>
                <Clock className="text-white" size={24} />
              </div>
              {pendingAdvisories > 0 && (
                <span className="px-2 py-1 text-xs font-semibold text-white rounded-full" style={{ background: '#D4AF37' }}>
                  Nuevas
                </span>
              )}
            </div>
            <h3 className="text-4xl font-display font-bold text-[#5D4E37] mb-1">
              {loading ? '...' : pendingAdvisories}
            </h3>
            <p className="text-[#8B7355] font-body text-sm">Asesorías Pendientes</p>
          </div>
        </div>

        {/* Proyectos - Placeholder */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-white border border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4A574]/10 to-transparent rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #D4A574, #8B7355)' }}>
                <CheckCircle className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-4xl font-display font-bold text-[#5D4E37] mb-1">12</h3>
            <p className="text-[#8B7355] font-body text-sm">Proyectos Completados</p>
          </div>
        </div>

        {/* Satisfacción - Placeholder */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-white border border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #D4AF37, #D4A574)' }}>
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-4xl font-display font-bold text-[#5D4E37] mb-1">98%</h3>
            <p className="text-[#8B7355] font-body text-sm">Satisfacción Clientes</p>
          </div>
        </div>
      </motion.div>

      {/* Action Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Gestionar Programadores */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#D4AF37]/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(184, 134, 11, 0.1))' }}>
                <Users className="text-[#D4AF37]" size={28} />
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full text-[#D4AF37] bg-[#D4AF37]/10">
                CRUD
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#5D4E37] mb-2">
              Gestionar Programadores
            </h2>
            <p className="text-[#8B7355] font-body text-sm mb-6 leading-relaxed">
              Crear y editar perfiles, asignar roles y configurar datos de contacto del equipo.
            </p>
            <Link 
              to="/admin/programadores"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold font-body transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}
            >
              Abrir Gestión
              <Settings size={18} />
            </Link>
          </div>
        </div>

        {/* Horarios de Asesoría */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#D4AF37]/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B8860B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.15), rgba(139, 115, 85, 0.1))' }}>
                <Calendar className="text-[#B8860B]" size={28} />
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full text-[#B8860B] bg-[#B8860B]/10">
                Config
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#5D4E37] mb-2">
              Horarios de Asesoría
            </h2>
            <p className="text-[#8B7355] font-body text-sm mb-6 leading-relaxed">
              Registra la disponibilidad de cada programador para que los usuarios puedan agendar.
            </p>
            <Link 
              to="/admin/horarios"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold font-body transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #B8860B, #8B7355)' }}
            >
              Configurar
              <Calendar size={18} />
            </Link>
          </div>
        </div>

        {/* Proyectos Admin */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-[#D4AF37]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#D4AF37]/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.15), rgba(139, 115, 85, 0.1))' }}>
                <CheckCircle className="text-[#D4A574]" size={28} />
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full text-[#D4A574] bg-[#D4A574]/10">
                Nuevo
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#5D4E37] mb-2">
              Proyectos
            </h2>
            <p className="text-[#8B7355] font-body text-sm mb-6 leading-relaxed">
              Administra y supervisa todos los proyectos del portafolio de la empresa.
            </p>
            <Link 
              to="/admin/proyectos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold font-body transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #D4A574, #8B7355)' }}
            >
              Ver Proyectos
              <TrendingUp size={18} />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AdminDashboard
