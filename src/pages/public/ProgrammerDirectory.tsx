/**
 * ProgrammerDirectory FOREING - Directorio de programadoras con estilo femenino
 * Diseño elegante con tarjetas modernas y efectos suaves
 */

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Code2,
  Crown,
  Flower2,
  Github,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Palette,
  Phone,
  Quote,
  Sparkles
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getScheduleByProgrammer, listProgrammers } from '../../services/firestore'
import { getPhotoURL } from '../../utils/photoStorage'

// Imágenes del equipo
import fotoClaudia from '../../img/FOTOclau.jpg'
import fotoValeria from '../../img/fotovale.jpg'

// Tipo para miembros del equipo
interface TeamMember {
  id: string
  name: string
  lastName: string
  role: string
  roleIcon: any
  image: string
  email: string
  location: string
  bio: string
  quote: string
  skills: { name: string; level: number }[]
  gradient: string
  bgGradient: string
  accentColor: string
  social: {
    instagram?: string
    linkedin?: string
    github?: string
    whatsapp?: string
  }
  stats: {
    projects: number
    experience: string
    clients: number
  }
}

const ProgrammerDirectory = () => {
  const { user } = useAuth()
  const [hoveredMember, setHoveredMember] = useState<string | null>(null)
  const [firestoreProgrammers, setFirestoreProgrammers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; member: TeamMember | null; schedule: any[] }>({
    open: false,
    member: null,
    schedule: []
  })

  // Equipo principal (fundadoras)
  const founders: TeamMember[] = [
    {
      id: 'claudia',
      name: 'Claudia',
      lastName: 'Rodríguez',
      role: 'Full Stack Developer',
      roleIcon: Code2,
      image: fotoClaudia,
      email: 'claudia@foreing.tech',
      location: 'Cuenca, Ecuador',
      bio: 'Desarrolladora apasionada con más de 5 años de experiencia creando soluciones digitales innovadoras. Especialista en React, Node.js y arquitecturas escalables.',
      quote: 'El código es poesía que da vida a las ideas ✨',
      skills: [
        { name: 'React', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'Node.js', level: 88 },
        { name: 'Firebase', level: 92 },
        { name: 'TailwindCSS', level: 95 },
        { name: 'Python', level: 80 }
      ],
      gradient: 'from-[#D4AF37] to-[#B8860B]',
      bgGradient: 'from-[#FFF8E7] to-[#FFF0D4]',
      accentColor: 'amber',
      social: {
        instagram: 'https://instagram.com/claudia_foreing',
        linkedin: 'https://linkedin.com/in/claudia-rodriguez',
        github: 'https://github.com/clcmono',
        whatsapp: 'https://wa.me/593999999999'
      },
      stats: {
        projects: 45,
        experience: '5 años',
        clients: 30
      }
    },
    {
      id: 'valeria',
      name: 'Valeria',
      lastName: 'Mantilla',
      role: 'UI/UX Designer',
      roleIcon: Palette,
      image: fotoValeria,
      email: 'valeria@foreing.tech',
      location: 'Cuenca, Ecuador',
      bio: 'Diseñadora creativa especializada en crear experiencias digitales memorables. Combino estética, funcionalidad y emoción en cada proyecto.',
      quote: 'Diseñar es dar forma a los sueños 💜',
      skills: [
        { name: 'Figma', level: 98 },
        { name: 'Adobe XD', level: 92 },
        { name: 'Illustrator', level: 95 },
        { name: 'Photoshop', level: 90 },
        { name: 'After Effects', level: 85 },
        { name: 'Branding', level: 93 }
      ],
      gradient: 'from-[#D4A574] to-[#D4AF37]',
      bgGradient: 'from-[#FFFAF0] to-[#FFF5E6]',
      accentColor: 'amber',
      social: {
        instagram: 'https://instagram.com/valeria_foreing',
        linkedin: 'https://linkedin.com/in/valeria-mantilla',
        github: 'https://github.com/Alanissette16',
        whatsapp: 'https://wa.me/593999999998'
      },
      stats: {
        projects: 60,
        experience: '6 años',
        clients: 40
      }
    }
  ]

  // Cargar programadores de Firestore
  useEffect(() => {
    const loadProgrammers = async () => {
      try {
        const programmers = await listProgrammers()
        
        // Convertir a formato TeamMember
        const converted: TeamMember[] = programmers.map((prog: any, index: number) => {
          // Alternar gradientes para variedad
          const gradients = [
            { gradient: 'from-[#9B59B6] to-[#8E44AD]', bgGradient: 'from-[#F5EEF8] to-[#EBDEF0]' },
            { gradient: 'from-[#E91E63] to-[#C2185B]', bgGradient: 'from-[#FCE4EC] to-[#F8BBD9]' },
            { gradient: 'from-[#00BCD4] to-[#0097A7]', bgGradient: 'from-[#E0F7FA] to-[#B2EBF2]' },
            { gradient: 'from-[#4CAF50] to-[#388E3C]', bgGradient: 'from-[#E8F5E9] to-[#C8E6C9]' },
          ]
          const colorSet = gradients[index % gradients.length]
          
          // Convertir skills al formato correcto
          const skills = Array.isArray(prog.skills) 
            ? prog.skills.map((s: any) => typeof s === 'string' ? { name: s, level: 80 } : s)
            : [{ name: 'JavaScript', level: 80 }]

          return {
            id: prog.id,
            name: prog.displayName || 'Sin nombre',
            lastName: prog.lastName || '',
            role: prog.specialty || 'Desarrollador',
            roleIcon: Code2,
            image: getPhotoURL(prog.photoURL),
            email: prog.email || '',
            location: prog.location || 'Ecuador',
            bio: prog.bio || '',
            quote: prog.quote || 'Transformando ideas en código ✨',
            skills: skills.slice(0, 6), // Máximo 6 skills
            ...colorSet,
            accentColor: 'purple',
            social: {
              instagram: prog.socials?.instagram || '',
              linkedin: prog.socials?.linkedin || '',
              github: prog.socials?.github || '',
              whatsapp: prog.socials?.whatsapp || ''
            },
            stats: {
              projects: prog.stats?.projects || 0,
              experience: prog.stats?.experience || '1 año',
              clients: prog.stats?.clients || 0
            }
          }
        })
        
        setFirestoreProgrammers(converted)
      } catch (error) {
        // Mostrar error en la UI (puedes personalizar esto)
        alert('Error cargando programadores. Por favor, recarga la página.')
      } finally {
        setLoading(false)
      }
    }

    loadProgrammers()
  }, [])

  // Combinar fundadoras + programadores de Firestore
  const team = [...founders, ...firestoreProgrammers]

  const openScheduleModal = async (member: TeamMember) => {
    try {
      const schedule = await getScheduleByProgrammer(member.id)
      setScheduleModal({
        open: true,
        member,
        schedule: schedule?.slots || []
      })
    } catch (error) {
      setScheduleModal({
        open: true,
        member,
        schedule: []
      })
    }
  }

  const closeScheduleModal = () => {
    setScheduleModal({ open: false, member: null, schedule: [] })
  }

  // Función para obtener la fecha específica de un día de la semana
  const getDateForDay = (dayName: string): string => {
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
    const today = new Date()
    const todayIndex = today.getDay()
    const targetIndex = daysOfWeek.findIndex(day => day.toLowerCase() === dayName.toLowerCase())
    
    if (targetIndex === -1) return dayName
    
    let daysToAdd = targetIndex - todayIndex
    if (daysToAdd <= 0) {
      daysToAdd += 7 // Próxima semana
    }
    
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysToAdd)
    
    return targetDate.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-[#FFFAF6] pt-24 pb-20">
      {/* Fondo Rosa Dorado */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5ED]/50 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FFE8D6]/25 to-transparent" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FFDDD2]/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-6" style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)', borderColor: 'rgba(212, 175, 55, 0.3)' }}
          >
            <Crown className="text-[#D4AF37]" size={18} />
            <span className="font-medium bg-clip-text text-transparent font-body" style={{ backgroundImage: 'linear-gradient(to right, #D4AF37, #B8860B)' }}>
              Nuestro Equipo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-display font-bold mb-6"
          >
            <span className="text-base-content">Las </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #D4AF37, #B8860B, #D4A574)' }}>
              Creadoras
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-base-content/60 max-w-2xl mx-auto font-body"
          >
            Conoce a las mentes brillantes detrás de FOREING. Dos mujeres apasionadas por la tecnología y el diseño 💖
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.3 }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
              className="group"
            >
              <div className={`relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-${member.accentColor}-500/10 border border-${member.accentColor}-100/50 hover:shadow-2xl hover:shadow-${member.accentColor}-500/20 transition-all duration-500`}>
                {/* Decoración superior */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${member.gradient}`} />
                
                {/* Contenido principal */}
                <div className="p-8">
                  {/* Header con foto y info básica */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                    {/* Foto */}
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`} />
                      <div className={`relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500`}>
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Badge de rol */}
                      <div className={`absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-gradient-to-r ${member.gradient} shadow-lg`}>
                        <member.roleIcon className="text-white" size={18} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-3xl font-display font-bold text-base-content mb-1">
                        {member.name} <span className="text-base-content/40">{member.lastName}</span>
                      </h2>
                      <p className={`text-lg font-medium bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent font-body flex items-center gap-2 justify-center sm:justify-start`}>
                        <Flower2 size={16} className={`text-${member.accentColor}-400`} />
                        {member.role}
                      </p>
                      
                      {/* Ubicación y email */}
                      <div className="mt-3 space-y-1">
                        <p className="text-sm text-base-content/50 font-body flex items-center gap-2 justify-center sm:justify-start">
                          <MapPin size={14} className={`text-${member.accentColor}-400`} />
                          {member.location}
                        </p>
                        <a href={`mailto:${member.email}`} className={`text-sm text-base-content/50 hover:text-${member.accentColor}-500 font-body flex items-center gap-2 justify-center sm:justify-start transition-colors`}>
                          <Mail size={14} className={`text-${member.accentColor}-400`} />
                          {member.email}
                        </a>
                      </div>

                      {/* Social Links */}
                      <div className="flex items-center gap-2 mt-4 justify-center sm:justify-start">
                        {member.social.instagram && (
                          <a href={member.social.instagram} className={`p-2.5 rounded-xl bg-gradient-to-r ${member.bgGradient} hover:${member.gradient} text-${member.accentColor}-500 hover:text-white transition-all group/social`}>
                            <Instagram size={18} />
                          </a>
                        )}
                        {member.social.linkedin && (
                          <a href={member.social.linkedin} className={`p-2.5 rounded-xl bg-gradient-to-r ${member.bgGradient} hover:${member.gradient} text-${member.accentColor}-500 hover:text-white transition-all group/social`}>
                            <Linkedin size={18} />
                          </a>
                        )}
                        {member.social.github && (
                          <a href={member.social.github} className={`p-2.5 rounded-xl bg-gradient-to-r ${member.bgGradient} hover:${member.gradient} text-${member.accentColor}-500 hover:text-white transition-all group/social`}>
                            <Github size={18} />
                          </a>
                        )}
                        {member.social.whatsapp && (
                          <a href={member.social.whatsapp} target="_blank" rel="noopener noreferrer" className={`p-2.5 rounded-xl bg-gradient-to-r ${member.bgGradient} hover:${member.gradient} text-${member.accentColor}-500 hover:text-white transition-all group/social`}>
                            <Phone size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className={`relative p-5 rounded-2xl bg-gradient-to-r ${member.bgGradient} mb-6`}>
                    <Quote className={`absolute top-3 left-3 text-${member.accentColor}-200`} size={24} />
                    <p className="text-center font-script text-xl text-base-content/80 italic pl-6">
                      {member.quote}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-base-content/60 font-body leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`text-center p-4 rounded-2xl bg-gradient-to-r ${member.bgGradient}`}>
                      <p className={`text-2xl font-display font-bold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                        {member.stats.projects}+
                      </p>
                      <p className="text-xs text-base-content/50 font-body">Proyectos</p>
                    </div>
                    <div className={`text-center p-4 rounded-2xl bg-gradient-to-r ${member.bgGradient}`}>
                      <p className={`text-2xl font-display font-bold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                        {member.stats.experience}
                      </p>
                      <p className="text-xs text-base-content/50 font-body">Experiencia</p>
                    </div>
                    <div className={`text-center p-4 rounded-2xl bg-gradient-to-r ${member.bgGradient}`}>
                      <p className={`text-2xl font-display font-bold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                        {member.stats.clients}+
                      </p>
                      <p className="text-xs text-base-content/50 font-body">Clientes</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-base-content/70 font-body flex items-center gap-2">
                      <Sparkles size={14} className={`text-${member.accentColor}-400`} />
                      Habilidades
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {member.skills.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-body">
                            <span className="text-base-content/70">{skill.name}</span>
                            <span className={`text-${member.accentColor}-500`}>{skill.level}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-base-200 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className={`h-full rounded-full bg-gradient-to-r ${member.gradient}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA - Solo visible para el programador dueño de la tarjeta */}
                  {user?.uid === member.id && (
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/portafolio/${member.id}`}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${member.gradient} text-white font-semibold hover:opacity-90 transition-all shadow-lg font-body`}
                    >
                      <Sparkles size={18} />
                      Ver Mi Portafolio
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  )}

                  {/* Botón para ver horario */}
                  <div className="mt-4">
                    <button
                      onClick={() => openScheduleModal(member)}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${member.bgGradient} border border-${member.accentColor}-200 text-${member.accentColor}-700 hover:${member.gradient} hover:text-white transition-all shadow-lg font-body font-semibold`}
                    >
                      <Heart size={18} />
                      Ver Horario Disponible
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col items-center p-10 rounded-[2rem] border shadow-xl\" style={{ background: 'linear-gradient(to bottom right, #FFF8E7, white, #FFF0D4)', borderColor: 'rgba(212, 175, 55, 0.2)', boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.1)' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={40} />
            </motion.div>
            
            <h3 className="text-2xl font-display font-bold mt-4 mb-2">
              ¿Te gustaría trabajar con nosotras?
            </h3>
            
            <p className="text-base-content/60 font-body mb-6 max-w-md">
              Estamos listas para hacer realidad tu próximo proyecto digital ✨
            </p>
            
            <Link
              to="/agendar-asesoria"
              className="group flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold transition-all font-body" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B, #D4A574)', boxShadow: '0 20px 25px -5px rgba(212, 175, 55, 0.3)' }}
            >
              <Sparkles size={20} />
              Comencemos tu Proyecto
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Modal de Horario */}
      {scheduleModal.open && scheduleModal.member && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl"
          >
            <div className={`p-6 bg-gradient-to-r ${scheduleModal.member.gradient}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-white">
                  Horario de {scheduleModal.member.name}
                </h3>
                <button
                  onClick={closeScheduleModal}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {scheduleModal.schedule.length > 0 ? (
                <div className="space-y-3">
                  {scheduleModal.schedule.map((slot: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        slot.available 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-base-content">{getDateForDay(slot.day)}</p>
                          <p className="text-sm text-base-content/70">
                            {slot.from} - {slot.to}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          slot.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {slot.available ? 'Disponible' : 'No disponible'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-base-content/60">
                    No hay horarios configurados aún.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ProgrammerDirectory
