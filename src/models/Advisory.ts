// ============================================================================
// MODELOS DE ASESORÍA
// ============================================================================
// Este archivo centraliza todos los tipos e interfaces relacionados con solicitudes de asesoría.

/**
 * Estados posibles de una solicitud de asesoría
 */
export type AdvisoryStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

/**
 * Prioridad de la solicitud
 */
export type AdvisoryPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Tipos de asesoría
 */
export type AdvisoryType = 'consultation' | 'development' | 'review' | 'mentoring' | 'other';

/**
 * Interface principal para una Solicitud de Asesoría
 */
export interface AdvisoryRequest {
    id: string;

    // Información del solicitante
    requesterId: string;
    requesterName: string;
    requesterEmail: string;
    requesterPhone?: string;

    // Información del programador (si está asignado)
    programmerId?: string;
    programmerName?: string;
    programmerEmail?: string; // Agrego este campo usado en backend

    // Detalles de la solicitud
    title?: string; // Opcional en backend implementation actual
    description?: string; // Opcional
    type?: AdvisoryType;
    priority?: AdvisoryPriority;

    // Slot de tiempo (Usado en backend implementation)
    slot?: {
        date: string;
        time: string;
    };

    // Estado y seguimiento
    status: AdvisoryStatus;
    notes?: string;
    note?: string; // Alias usado en input
    responseMessage?: string; // Usado en updateAdvisoryStatus
    adminNotes?: string;

    // Programación (si aplica)
    scheduledDate?: any;
    scheduledTime?: string;
    duration?: number; // en minutos
    meetingUrl?: string;

    // Metadata
    createdAt: any;
    updatedAt?: any;
    completedAt?: any;
}

/**
 * Datos de entrada para solicitud de asesoría (Formulario)
 */
export interface AdvisoryRequestInput {
    programmerId: string;
    programmerEmail?: string;
    programmerName?: string;
    requesterName: string;
    requesterEmail: string;
    slot: { date: string; time: string };
    note?: string;
    userId?: string | null;
}

/**
 * Datos para crear una nueva solicitud de asesoría
 */
export interface CreateAdvisoryData {
    title: string;
    description: string;
    type?: AdvisoryType;
    priority?: AdvisoryPriority;
    requesterPhone?: string;
    programmerId?: string;
    scheduledDate?: Date;
    scheduledTime?: string;
}

/**
 * Datos para actualizar una solicitud existente
 */
export interface UpdateAdvisoryData {
    title?: string;
    description?: string;
    type?: AdvisoryType;
    priority?: AdvisoryPriority;
    status?: AdvisoryStatus;
    notes?: string;
    adminNotes?: string;
    programmerId?: string;
    scheduledDate?: Date;
    scheduledTime?: string;
    duration?: number;
    meetingUrl?: string;
}

/**
 * Filtros para búsqueda de solicitudes
 */
export interface AdvisoryFilters {
    requesterId?: string;
    programmerId?: string;
    status?: AdvisoryStatus;
    type?: AdvisoryType;
    priority?: AdvisoryPriority;
    dateFrom?: Date;
    dateTo?: Date;
}

/**
 * Estadísticas de asesorías
 */
export interface AdvisoryStats {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    completed: number;
    cancelled: number;
}
