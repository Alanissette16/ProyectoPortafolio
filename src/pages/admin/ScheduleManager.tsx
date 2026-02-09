import { FormEvent, useEffect, useState } from 'react'
import {
  getScheduleByProgrammer,
  listProgrammers,
  upsertSchedule,
  type ScheduleSlot,
} from '../../services/data.service'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Save, Plus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

const defaultSlot: ScheduleSlot = {
  day: 'Lunes',
  from: '09:00',
  to: '11:00',
  available: true,
}

const createEmptySlot = (): ScheduleSlot => ({ ...defaultSlot })

const ScheduleManager = () => {
  const [programmers, setProgrammers] = useState<any[]>([])
  const [selected, setSelected] = useState('')
  const [slots, setSlots] = useState<ScheduleSlot[]>([createEmptySlot()])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const loadProgrammers = async () => {
      try {
        if (isAdmin) {
          const backendProgrammers = await listProgrammers()
          setProgrammers(backendProgrammers)
        } else if (user?.id) {
          setSelected(user.id.toString())
        }
      } catch (err) {
        console.error('Error loading programmers:', err)
      }
    }
    loadProgrammers()
  }, [isAdmin, user])

  useEffect(() => {
    const load = async () => {
      if (!selected) return
      try {
        const schedule = await getScheduleByProgrammer(selected)
        if (schedule?.slots?.length) {
          setSlots(schedule.slots)
        } else {
          setSlots([createEmptySlot()])
        }
      } catch (err) {
        console.error('Error loading schedule:', err)
      }
    }
    load()
  }, [selected])

  const updateSlot = (index: number, field: keyof ScheduleSlot, value: string | boolean) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    )
  }

  const addSlot = () => setSlots((prev) => [...prev, createEmptySlot()])
  const removeSlot = (index: number) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index))
    }
  }

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selected) {
      setError('Por favor, selecciona un programador.')
      return
    }
    setLoading(true)
    setMessage('')
    setError('')
    try {
      await upsertSchedule(selected, slots)
      setMessage('Horarios guardados exitosamente.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('No se pudo guardar. Revisa la conexión o tus permisos.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <Navigate to="/login" />

  return (
    <div className="p-6 md:p-8 font-body">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-[#D4AF37]/10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              to="/admin"
              className="p-2 rounded-xl text-[#8B7355] hover:bg-[#FFF8E7] hover:text-[#D4AF37] transition-all"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[#5D4E37] tracking-tight">
                Horarios de Asesoría
              </h1>
              <p className="text-[#8B7355] text-sm mt-1">
                Define tu disponibilidad para el equipo
              </p>
            </div>
          </div>
          <Calendar className="text-[#D4AF37]/20 hidden md:block" size={48} />
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm"
              >
                <CheckCircle size={20} /> {message}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 shadow-sm"
              >
                <AlertCircle size={20} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-[#D4AF37]/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#FFF8E7] to-white p-6 border-b border-[#D4AF37]/10">
              {isAdmin ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#8B7355] uppercase tracking-wider ml-1">Seleccionar Programador</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-bold text-[#5D4E37]"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    <option value="">-- Elige un programador --</option>
                    {programmers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.displayName || p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-[#5D4E37]">
                  <Clock className="text-[#D4AF37]" />
                  <span className="font-bold">Gestionando mis horarios disponibles</span>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                {slots.map((slot, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={idx}
                    className="group relative bg-gray-50/50 hover:bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-md transition-all"
                  >
                    <div className="grid gap-6 md:grid-cols-4 items-end">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8B7355] uppercase ml-1">Día</label>
                        <select
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] outline-none text-sm transition-all"
                          value={slot.day}
                          onChange={(e) => updateSlot(idx, 'day', e.target.value)}
                        >
                          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d) => (
                            <option key={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8B7355] uppercase ml-1">Desde</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] outline-none text-sm transition-all"
                          value={slot.from}
                          onChange={(e) => updateSlot(idx, 'from', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8B7355] uppercase ml-1">Hasta</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] outline-none text-sm transition-all"
                          value={slot.to}
                          onChange={(e) => updateSlot(idx, 'to', e.target.value)}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-[#8B7355] uppercase ml-1">Activo</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slot.available}
                              onChange={(e) => updateSlot(idx, 'available', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeSlot(idx)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar bloque"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center gap-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                  onClick={addSlot}
                >
                  <Plus size={18} /> Añadir otro bloque
                </button>

                <button
                  className="w-full sm:w-auto px-10 py-3 bg-[#D4AF37] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#B5952F] shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                  type="submit"
                  disabled={loading || !selected}
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Guardando...</>
                  ) : (
                    <><Save size={20} /> Guardar Horarios</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleManager

