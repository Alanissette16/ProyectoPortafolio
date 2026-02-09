/**
 * AdvisoryRequest FOREING - Página de solicitud de asesoría con estilo femenino
 * Formulario elegante con animaciones suaves y diseño sofisticado
 */

import { motion } from 'framer-motion'
import {
  ArrowRight,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Code2,
  Coffee,
  Flower2,
  Heart,
  Loader2,
  Mail,
  MessageSquare,
  Palette,
  Phone,
  Send,
  Sparkles,
  Star,
  User
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { addAdvisoryRequest, getScheduleByProgrammer, listProgrammers } from '../../services/data.service'
import { getPhotoURL } from '../../utils/photoStorage'
import { isProgrammerAvailableAtSlot, isProgrammerAvailableOnDate } from '../../utils/scheduleUtils'
import { FormUtils } from '../../utils/FormUtils'



// Tipo para asesores
interface Advisor {
  id: string
  name: string
  role: string
  image: string
  specialty: string
  gradient: string
  bgGradient: string
}

const serviceTypes = [
  { id: 'web', label: 'Desarrollo Web', icon: Code2, color: 'pink' },
  { id: 'design', label: 'Diseño UI/UX', icon: Palette, color: 'purple' },
  { id: 'consulting', label: 'Consultoría', icon: Coffee, color: 'rose' },
  { id: 'other', label: 'Otro', icon: Star, color: 'violet' }
]

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00'
]

// Función para mostrar horas en formato legible
const formatTimeForDisplay = (time24: string): string => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

const AdvisoryRequest = () => {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingAdvisors, setLoadingAdvisors] = useState(true)
  const [success, setSuccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedAdvisor, setSelectedAdvisor] = useState('')
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const [isSlotAvailable, setIsSlotAvailable] = useState(true)
  const [isDayAvailable, setIsDayAvailable] = useState(true)
  const [hasNoSchedule, setHasNoSchedule] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    company: '',
    message: ''
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Fundadoras (siempre aparecen)
  // Fundadoras eliminadas (solo backend)
  const founders: Advisor[] = []

  // Cargar programadores del Backend
  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        const programmers = await listProgrammers()

        // Gradientes para variar colores
        const gradients = [
          { gradient: 'from-[#9B59B6] to-[#8E44AD]', bgGradient: 'from-[#F5EEF8] to-[#EBDEF0]' },
          { gradient: 'from-[#E91E63] to-[#C2185B]', bgGradient: 'from-[#FCE4EC] to-[#F8BBD9]' },
          { gradient: 'from-[#00BCD4] to-[#0097A7]', bgGradient: 'from-[#E0F7FA] to-[#B2EBF2]' },
          { gradient: 'from-[#4CAF50] to-[#388E3C]', bgGradient: 'from-[#E8F5E9] to-[#C8E6C9]' },
        ]

        const backendAdvisors: Advisor[] = programmers.map((prog: any, index: number) => {
          const colorSet = gradients[index % gradients.length]
          return {
            id: prog.id,
            name: prog.displayName || 'Programador',
            role: prog.specialty || 'Desarrollador',
            image: getPhotoURL(prog.photoURL),
            specialty: prog.specialty || 'Desarrollo de Software',
            ...colorSet
          }
        })

        // Combinar fundadoras + programadores del Backend
        setAdvisors([...founders, ...backendAdvisors])
      } catch {
        // En caso de error, solo mostrar fundadoras
        setAdvisors(founders)
      } finally {
        setLoadingAdvisors(false)
      }
    }

    loadAdvisors()
  }, [])

  useEffect(() => {
    const checkAvailability = async () => {
      if (!selectedAdvisor) {
        setHasNoSchedule(false)
        setAvailabilityChecked(false)
        return
      }

      try {
        const schedule = await getScheduleByProgrammer(selectedAdvisor)
        const slotsExist = schedule?.slots && schedule.slots.length > 0
        setHasNoSchedule(!slotsExist)

        // Verificar si el DÍA es válido
        if (selectedDate && slotsExist) {
          const dayOk = isProgrammerAvailableOnDate(schedule.slots, selectedDate)
          setIsDayAvailable(dayOk)
          if (!dayOk) {
            setIsSlotAvailable(false)
            setAvailabilityChecked(true)
            return
          }
        } else {
          setIsDayAvailable(true)
        }

        if (!selectedDate || !selectedTime) {
          setAvailabilityChecked(false)
          return
        }

        if (slotsExist) {
          const available = isProgrammerAvailableAtSlot(schedule.slots, selectedDate, selectedTime)
          setIsSlotAvailable(available)
        } else {
          // Si no hay horario, NO está disponible
          setIsSlotAvailable(false)
        }
        setAvailabilityChecked(true)
      } catch {
        setHasNoSchedule(true)
        setIsSlotAvailable(false)
        setAvailabilityChecked(true)
      }
    }

    checkAvailability()
  }, [selectedAdvisor, selectedDate, selectedTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    // Validaciones
    const rules = {
      name: [FormUtils.required],
      email: [FormUtils.required, FormUtils.email],
      phone: [FormUtils.required, FormUtils.phone],
      message: [FormUtils.required]
    }

    const errors = FormUtils.validateForm(formData, rules)
    if (FormUtils.hasErrors(errors)) {
      setFormErrors(errors)
      // Mostrar alerta general opcionalmente

      return
    }

    setLoading(true)

    // Validar que el horario esté disponible
    if (availabilityChecked && !isSlotAvailable) {
      alert('El horario seleccionado no está disponible. Por favor selecciona otro horario.')
      setLoading(false)
      return
    }

    try {
      // Encontrar el asesor seleccionado para obtener su info
      const selectedAdvisorData = advisors.find(a => a.id === selectedAdvisor)

      await addAdvisoryRequest({
        programmerId: selectedAdvisor,
        programmerName: selectedAdvisorData?.name || '',
        programmerEmail: '', // Se resolverá automáticamente en backend
        requesterName: formData.name,
        requesterEmail: formData.email,
        slot: {
          date: selectedDate,
          time: selectedTime
        },
        note: `Servicio: ${selectedService}\nTeléfono: ${formData.phone}\nEmpresa: ${formData.company}\nMensaje: ${formData.message}`,
        userId: user?.uid || null,
      })

      setSuccess(true)
    } catch {
      // Mostrar error en la UI
      alert('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFFAF6] pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full mx-4 p-10 bg-white rounded-3xl shadow-2xl border text-center" style={{ boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.2)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B)' }}
          >
            <CheckCircle className="text-white" size={40} />
          </motion.div>

          <h2 className="text-3xl font-display font-bold text-base-content mb-4">
            ¡Solicitud Enviada! <Heart className="inline ml-2 text-primary fill-primary" size={24} />
          </h2>

          <p className="text-base-content/60 font-body mb-8">
            Hemos recibido tu solicitud de asesoría. Te contactaremos pronto para confirmar tu cita con{' '}
            <span className="font-semibold text-[#D4AF37]">
              {advisors.find(a => a.id === selectedAdvisor)?.name}
            </span>.
          </p>

          <div className="p-4 rounded-2xl mb-6" style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)' }}>
            <div className="flex items-center justify-center gap-4 text-sm text-base-content/70 font-body">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#D4AF37]" />
                {selectedDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#B8860B]" />
                {selectedTime ? formatTimeForDisplay(selectedTime) : 'Sin hora'}
              </div>
            </div>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-opacity font-body" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B)' }}
          >
            Volver al Inicio
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    )
  }

  // Mostrar splash de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFAF6] pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full mx-4 p-10 bg-white rounded-3xl shadow-2xl border text-center"
          style={{ boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.2)' }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}
          >
            <Heart className="text-white" size={40} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-display font-bold text-base-content mb-4"
          >
            ¡Hola! <Sparkles className="inline-block ml-2 text-[#D4AF37]" size={32} />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base-content/70 font-body mb-8 leading-relaxed"
          >
            Para solicitar una asesoría necesitas{' '}
            <span className="font-semibold text-[#D4AF37]">iniciar sesión</span>.
            <br />
            Es rápido, seguro y gratuito <Sparkles className="inline text-[#D4AF37]" size={16} />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <a
              href="/login"
              className="block w-full px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-all shadow-lg font-body"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={20} />
                Iniciar Sesión
                <ArrowRight size={20} />
              </span>
            </a>

            <a
              href="/"
              className="block w-full px-8 py-3 rounded-full text-[#5D4E37] font-medium hover:bg-[#FFF8E7] transition-all font-body border border-[#D4AF37]/20"
            >
              Volver al Inicio
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 rounded-2xl"
            style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)' }}
          >
            <p className="text-sm text-[#5D4E37] font-body">
              <strong>¿Por qué necesito cuenta?</strong>
              <br />
              Para darte seguimiento personalizado y mantener un historial de tus asesorías
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pt-24 pb-20">
      {/* Fondo Rosa Dorado */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFEFE6]/30 via-transparent to-[#FFE6DC]/20" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full border border-[#E8C4B8]/10" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-6" style={{ background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)', borderColor: 'rgba(212, 175, 55, 0.3)' }}
          >
            <Calendar className="text-[#D4AF37]" size={18} />
            <span className="font-medium bg-clip-text text-transparent font-body" style={{ backgroundImage: 'linear-gradient(to right, #D4AF37, #B8860B)' }}>
              Agenda tu Cita
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-display font-bold mb-6"
          >
            <span className="text-base-content">Solicitar </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #D4AF37, #B8860B, #D4A574)' }}>
              Asesoría
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-base-content/60 max-w-2xl mx-auto font-body"
          >
            Agenda una consulta gratuita de 30 minutos con nuestro equipo
            <Sparkles className="inline ml-2 text-[#D4AF37]" size={20} />
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] shadow-2xl border overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.2)' }}
        >
          <div className="p-8 sm:p-10">
            {/* Step 1: Seleccionar Servicio */}
            <div className="mb-10">
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B)' }}>1</span>
                ¿En qué podemos ayudarte?
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${selectedService === service.id
                      ? 'border-[#D4AF37] shadow-lg'
                      : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7]/50'
                      }`}
                    style={selectedService === service.id ? { background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)', boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.1)' } : {}}
                  >
                    <service.icon className={`mb-3 ${selectedService === service.id ? 'text-[#D4AF37]' : 'text-base-content/40'}`} size={24} />
                    <p className="font-semibold text-base-content font-body">{service.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Seleccionar Asesora */}
            <div className="mb-10">
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B)' }}>2</span>
                ¿Con quién te gustaría hablar?
              </h3>

              {loadingAdvisors ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                  <span className="ml-3 text-base-content/60 font-body">Cargando asesores...</span>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {advisors.map((advisor) => (
                    <button
                      key={advisor.id}
                      type="button"
                      onClick={() => setSelectedAdvisor(advisor.id)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${selectedAdvisor === advisor.id
                        ? 'border-[#D4AF37] shadow-lg'
                        : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-[#FFF8E7]/50'
                        }`}
                      style={selectedAdvisor === advisor.id ? { background: 'linear-gradient(to right, #FFF8E7, #FFF0D4)', boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.1)' } : {}}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 ${selectedAdvisor === advisor.id ? 'border-[#D4AF37]' : 'border-white'} shadow-lg`}>
                          <img src={advisor.image} alt={advisor.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-lg text-base-content">{advisor.name}</p>
                          <p className={`text-sm font-body ${selectedAdvisor === advisor.id ? 'text-[#D4AF37]' : 'text-base-content/50'}`}>
                            {advisor.role}
                          </p>
                          <p className="text-xs text-base-content/40 font-body mt-1">{advisor.specialty}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Fecha y Hora */}
            <div className="mb-10">
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B)' }}>3</span>
                Selecciona fecha y hora
              </h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-base-content/70 font-body flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-[#D4AF37]" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      let dateVal = e.target.value
                      if (!dateVal) {
                        setSelectedDate('')
                        return
                      }

                      const [yearStr, month, day] = dateVal.split('-')
                      const year = parseInt(yearStr)
                      const currentYear = new Date().getFullYear()

                      // Auto-corrección de año: Si el año no es el actual ni el siguiente, lo forzamos al actual
                      if (year < currentYear || year > currentYear + 1) {
                        // Mantenemos mes y día, pero forzamos el año actual
                        dateVal = `${currentYear}-${month}-${day}`
                      }

                      setSelectedDate(dateVal)
                    }}
                    min={new Date().toLocaleDateString('en-CA')} // Formato local YYYY-MM-DD
                    max={`${new Date().getFullYear() + 1}-12-31`}
                    required
                    disabled={hasNoSchedule}
                    className={`w-full px-5 py-4 rounded-2xl bg-white border-2 border-[#D4AF37]/20 focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all font-body ${hasNoSchedule ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/70 font-body flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-[#B8860B]" />
                    Hora
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        disabled={hasNoSchedule || !isDayAvailable}
                        className={`py-2 rounded-xl text-xs font-medium transition-all font-body ${selectedTime === time
                          ? 'text-white'
                          : 'bg-[#FFF8E7] text-base-content/60 hover:bg-[#FFF0D4]'
                          } ${hasNoSchedule ? 'opacity-40 cursor-not-allowed' : ''}`}
                        style={selectedTime === time ? { background: 'linear-gradient(to right, #D4AF37, #B8860B)' } : {}}
                      >
                        {formatTimeForDisplay(time)}
                      </button>
                    ))}
                  </div>

                  {/* Advertencia de No Horario Configurado */}
                  {hasNoSchedule && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertTriangle className="text-amber-500" size={16} />
                        <span className="text-sm font-bold">
                          Sin Disponibilidad Configurada
                        </span>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">
                        Este asesor aún no ha configurado sus horarios de atención. Por favor selecciona otro asesor.
                      </p>
                    </div>
                  )}

                  {/* Advertencia de disponibilidad de Día */}
                  {!isDayAvailable && !hasNoSchedule && selectedDate && (
                    <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200">
                      <div className="flex items-center gap-2 text-orange-800">
                        <Calendar className="text-orange-500" size={16} />
                        <span className="text-sm font-medium">
                          No disponible este día
                        </span>
                      </div>
                      <p className="text-xs text-orange-600 mt-1">
                        {advisors.find(a => a.id === selectedAdvisor)?.name} no atiende los {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}s.
                      </p>
                    </div>
                  )}

                  {/* Advertencia de disponibilidad de Hora */}
                  {availabilityChecked && selectedAdvisor && selectedDate && selectedTime && !isSlotAvailable && isDayAvailable && (
                    <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="text-red-500" size={16} />
                        <span className="text-sm font-medium">
                          Hora no disponible
                        </span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        Por favor selecciona otro horario.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4: Datos de Contacto */}
            <div className="mb-10">
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B)' }}>4</span>
                Tus datos de contacto
              </h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-base-content/70 font-body flex items-center gap-2 mb-2">
                    <User size={14} className="text-[#D4AF37]" />
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Tu nombre"
                    className={`w-full px-5 py-4 rounded-2xl bg-white border-2 focus:ring-4 outline-none transition-all font-body ${formErrors.name
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-[#D4AF37]/20 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/10'
                      }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/70 font-body flex items-center gap-2 mb-2">
                    <Mail size={14} className="text-[#B8860B]" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="tu@email.com"
                    className={`w-full px-5 py-4 rounded-2xl bg-white border-2 focus:ring-4 outline-none transition-all font-body ${formErrors.email
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-[#D4AF37]/20 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/10'
                      }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/70 font-body flex items-center gap-2 mb-2">
                    <Phone size={14} className="text-[#D4AF37]" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+593 99 1234 567"
                    className={`w-full px-5 py-4 rounded-2xl bg-white border-2 focus:ring-4 outline-none transition-all font-body ${formErrors.phone
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-[#D4AF37]/20 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/10'
                      }`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/70 font-body flex items-center gap-2 mb-2">
                    <Flower2 size={14} className="text-[#B8860B]" />
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nombre de tu empresa"
                    className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-[#D4AF37]/20 focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all font-body"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-base-content/70 font-body flex items-center gap-2 mb-2">
                  <MessageSquare size={14} className="text-[#D4AF37]" />
                  Cuéntanos sobre tu proyecto
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                  placeholder="Describe brevemente tu proyecto o las preguntas que tienes..."
                  className={`w-full px-5 py-4 rounded-2xl bg-white border-2 focus:ring-4 outline-none transition-all font-body resize-none ${formErrors.message
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-[#D4AF37]/20 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/10'
                    }`}
                />
                {formErrors.message && (
                  <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.message}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#D4AF37]/20">
              <p className="text-sm text-base-content/50 font-body flex items-center gap-2">
                <Heart size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
                La consulta es gratuita y sin compromiso
              </p>

              <button
                type="submit"
                disabled={loading || !selectedService || !selectedAdvisor || !selectedDate || !selectedTime || (availabilityChecked && !isSlotAvailable)}
                className="group flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-body" style={{ background: 'linear-gradient(to right, #D4AF37, #B8860B, #D4A574)', boxShadow: '0 20px 25px -5px rgba(212, 175, 55, 0.25)' }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Enviar Solicitud
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default AdvisoryRequest
