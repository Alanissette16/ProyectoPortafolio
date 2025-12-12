/**
 * Gestión de horarios de asesoría por programador.
 * Prácticas: Formularios, validación, feedback, consumo Firestore.
 */
import type { DocumentData } from 'firebase/firestore'
import { FormEvent, useEffect, useState } from 'react'
import {
  getScheduleByProgrammer,
  listProgrammers,
  upsertSchedule,
  type ScheduleSlot,
} from '../../services/firestore'

// Programadores estáticos que deben aparecer en el selector
const staticProgrammers = [
  {
    id: 'daniel-static',
    displayName: 'Daniel',
    email: 'dquev1@est.ups.edu.ec',
    specialty: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'HTML5', 'CSS3', 'Responsive Design']
  },
   {
    id: 'Alanissette-static',
    displayName: 'Alanissette',
    email: 'amantillac3@est.ups.edu.ec',
    specialty: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'HTML5', 'CSS3', 'Responsive Design']
  }

]

const defaultSlot: ScheduleSlot = {
  day: 'Lunes',
  from: '09:00',
  to: '11:00',
  available: true,
}

const createEmptySlot = (): ScheduleSlot => ({ ...defaultSlot })

const ScheduleManager = () => {
  const [programmers, setProgrammers] = useState<(DocumentData & { id: string })[]>([])
  const [selected, setSelected] = useState('')
  const [slots, setSlots] = useState<ScheduleSlot[]>([createEmptySlot()])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProgrammers = async () => {
      const firebaseProgrammers = await listProgrammers()
      // Combinar programadores estáticos con los de Firebase
      setProgrammers([...staticProgrammers, ...firebaseProgrammers])
    }
    loadProgrammers()
  }, [])

  // Cargar horarios existentes al cambiar de programador
  useEffect(() => {
    const load = async () => {
      if (!selected) return
      const schedule = await getScheduleByProgrammer(selected)
      if (schedule?.slots?.length) {
        setSlots(schedule.slots)
      } else {
        setSlots([createEmptySlot()])
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

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selected) {
      setError('Selecciona un programador.')
      return
    }
    setLoading(true)
    setMessage('')
    setError('')
    try {
      await upsertSchedule(selected, slots)
      setMessage('Horarios guardados.')
    } catch (err) {
      setError('No se pudo guardar. Revisa conexión o permisos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pt-20">
      <div>
        <h1 className="text-2xl font-bold">Horarios de asesoría</h1>
        <p className="text-base-content/70">
          Define disponibilidades para que usuarios puedan agendar.
        </p>
      </div>

      <form onSubmit={handleSave} className="card bg-base-100 shadow-md">
        <div className="card-body space-y-4">
          {message && <div className="alert alert-success text-sm">{message}</div>}
          {error && <div className="alert alert-error text-sm">{error}</div>}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Programador</span>
            </label>
            <select
              className="select select-bordered"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Selecciona</option>
              {programmers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {slots.map((slot, idx) => (
              <div key={idx} className="rounded-lg border border-base-200 p-3">
                <div className="grid gap-2 md:grid-cols-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Día</span>
                    </label>
                    <select
                      className="select select-bordered select-sm"
                      value={slot.day}
                      onChange={(e) => updateSlot(idx, 'day', e.target.value)}
                    >
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(
                        (d) => (
                          <option key={d}>{d}</option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Desde</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered input-sm"
                      value={slot.from}
                      onChange={(e) => updateSlot(idx, 'from', e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Hasta</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered input-sm"
                      value={slot.to}
                      onChange={(e) => updateSlot(idx, 'to', e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Disponible</span>
                    </label>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={slot.available}
                      onChange={(e) =>
                        updateSlot(idx, 'available', e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button type="button" className="btn btn-outline btn-sm" onClick={addSlot}>
              Añadir bloque
            </button>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar horarios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ScheduleManager
