import type { ScheduleSlot } from '../services/firestore'

/**
 * Verifica si un programador está disponible ahora mismo
 * @param slots - Lista de horarios del programador
 * @returns true si está disponible ahora, false si no
 */
export const isProgrammerAvailable = (slots: ScheduleSlot[]): boolean => {
  const now = new Date()
  const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' })
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

  // Buscar slots para hoy que estén disponibles
  const todaySlots = slots.filter(slot =>
    slot.day.toLowerCase() === currentDay.toLowerCase() && slot.available
  )

  // Verificar si la hora actual está dentro de algún slot disponible
  return todaySlots.some(slot => {
    return currentTime >= slot.from && currentTime <= slot.to
  })
}

/**
 * Encuentra el próximo slot disponible de un programador
 * @param slots - Lista de horarios del programador
 * @returns El próximo slot disponible o null si no hay
 */
export const getNextAvailableSlot = (slots: ScheduleSlot[]): ScheduleSlot | null => {
  const now = new Date()
  const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' })
  const currentTime = now.toTimeString().slice(0, 5)

  // Días de la semana en orden
  const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

  // Encontrar el índice del día actual
  const currentDayIndex = daysOfWeek.findIndex(day =>
    day.toLowerCase() === currentDay.toLowerCase()
  )

  // Verificar slots restantes para hoy
  const todaySlots = slots.filter(slot =>
    slot.day.toLowerCase() === currentDay.toLowerCase() && slot.available
  ).filter(slot => slot.from > currentTime)

  if (todaySlots.length > 0) {
    return todaySlots.sort((a, b) => a.from.localeCompare(b.from))[0]
  }

  // Check future days
  for (let i = 1; i <= 7; i++) {
    const checkDayIndex = (currentDayIndex + i) % 7
    const checkDay = daysOfWeek[checkDayIndex]

    const daySlots = slots.filter(slot =>
      slot.day.toLowerCase() === checkDay.toLowerCase() && slot.available
    )

    if (daySlots.length > 0) {
      return daySlots.sort((a, b) => a.from.localeCompare(b.from))[0]
    }
  }

  return null
}

/**
 * Verifica si un programador está disponible en una fecha y hora específica
 * @param slots - Lista de horarios del programador
 * @param date - Fecha en formato YYYY-MM-DD
 * @param time - Hora en formato HH:MM
 * @returns true si está disponible, false si no
 */
export const isProgrammerAvailableAtSlot = (slots: ScheduleSlot[], date: string, time: string): boolean => {
  // Si no hay horarios configurados, asumimos que está disponible
  if (!slots || slots.length === 0) {
    return true
  }

  // Convertir la fecha a un objeto Date
  const selectedDate = new Date(date + 'T00:00:00')
  if (isNaN(selectedDate.getTime())) {
    return false // Fecha inválida
  }

  // Obtener el día de la semana (lunes, martes, etc.)
  const dayOfWeek = selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })
  const normalizedDay = normalizeDayName(dayOfWeek)

  // Buscar todos los slots para este día de la semana
  const daySlots = slots.filter(slot => {
    const slotDayNormalized = normalizeDayName(slot.day)
    return slotDayNormalized === normalizedDay
  })

  // Si no hay slots configurados para este día, está disponible
  if (daySlots.length === 0) {
    return true
  }

  // Filtrar solo los slots que están marcados como disponibles
  const availableSlots = daySlots.filter(slot => slot.available)

  // Si no hay slots disponibles para este día, no está disponible
  if (availableSlots.length === 0) {
    return false
  }

  // Verificar si la hora seleccionada está dentro de algún slot disponible
  const isTimeAvailable = availableSlots.some(slot => {
    return time >= slot.from && time <= slot.to
  })

  return isTimeAvailable
}

/**
 * Normaliza los nombres de los días para comparar correctamente
 * @param dayName - Nombre del día a normalizar
 * @returns Nombre del día normalizado
 */
const normalizeDayName = (dayName: string): string => {
  // Mapeo de nombres de días comunes
  const dayMappings: { [key: string]: string } = {
    'lunes': 'Lunes',
    'martes': 'Martes',
    'miércoles': 'Miércoles',
    'miercoles': 'Miércoles',
    'jueves': 'Jueves',
    'viernes': 'Viernes',
    'sábado': 'Sábado',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  }

  const lowerCase = dayName.toLowerCase().trim()
  return dayMappings[lowerCase] || dayName
}