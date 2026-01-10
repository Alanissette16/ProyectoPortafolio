// ============================================================================
// MODELOS DE HORARIOS Y DISPONIBILIDAD
// ============================================================================
// Este archivo centraliza los tipos relacionados con horarios y disponibilidad de programadores.

/**
 * Días de la semana
 */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Bloque de tiempo disponible
 */
export interface TimeSlot {
    startTime: string; // Formato HH:mm (ej: "09:00")
    endTime: string;   // Formato HH:mm (ej: "17:00")
}

/**
 * Disponibilidad para un día específico
 */
export interface DaySchedule {
    day: DayOfWeek;
    isAvailable: boolean;
    timeSlots?: TimeSlot[];
}

/**
 * Horario semanal de disponibilidad de un programador
 */
export interface WeeklySchedule {
    programmerId: string;
    programmerName?: string;
    schedule: DaySchedule[];
    timezone?: string;
    updatedAt?: Date;
}

/**
 * Cita o reserva programada
 */
export interface Appointment {
    id: string;
    programmerId: string;
    clientId: string;
    clientName: string;
    date: Date;
    startTime: string;
    endTime: string;
    duration: number; // minutos
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: Date;
}

/**
 * Datos para crear disponibilidad
 */
export interface CreateScheduleData {
    schedule: DaySchedule[];
    timezone?: string;
}

export interface UpdateScheduleData {
    schedule?: DaySchedule[];
    timezone?: string;
}

/**
 * Interface simple de slot para compatibilidad con implementación actual de Firestore
 */
export interface ScheduleSlot {
    day: string;
    from: string;
    to: string;
    available: boolean;
}
