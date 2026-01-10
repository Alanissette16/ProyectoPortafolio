// ============================================================================
// CONFIGURACIÓN Y CONSTANTES GLOBALES
// ============================================================================
// Este archivo centraliza todas las constantes de la aplicación.
// Mantener estos valores en un solo lugar facilita el mantenimiento y evita duplicación.

// ============================================================================
// COLECCIONES DE FIRESTORE
// ============================================================================
// Nombres de las colecciones en la base de datos Firestore

export const COLLECTIONS = {
    USERS: 'users',
    PROFILES: 'profiles',
    PROJECTS: 'projects',
    ADVISORY_REQUESTS: 'advisoryRequests',
    SCHEDULES: 'schedules',
    APPOINTMENTS: 'appointments',
} as const;

// ============================================================================
// ROLES DE USUARIO
// ============================================================================
// Roles disponibles en el sistema

export const USER_ROLES = {
    ADMIN: 'admin',
    PROGRAMMER: 'programmer',
    EXTERNAL: 'external',
} as const;

// ============================================================================
// ESTADOS DE SOLICITUDES DE ASESORÍA
// ============================================================================

export const ADVISORY_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;

// ============================================================================
// ESTADOS DE PROYECTOS
// ============================================================================

export const PROJECT_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
} as const;

// ============================================================================
// CATEGORÍAS DE PROYECTOS
// ============================================================================

export const PROJECT_CATEGORIES = {
    WEB: 'web',
    MOBILE: 'mobile',
    DESKTOP: 'desktop',
    API: 'api',
    OTHER: 'other',
} as const;

// ============================================================================
// PRIORIDADES DE ASESORÍA
// ============================================================================

export const ADVISORY_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
} as const;

// ============================================================================
// RUTAS DE LA APLICACIÓN
// ============================================================================
// Rutas principales de navegación

export const ROUTES = {
    // Públicas
    HOME: '/',
    LOGIN: '/login',
    PROJECTS: '/projects',
    PROGRAMMER_DIRECTORY: '/programmers',
    ADVISORY_REQUEST: '/advisory',
    MY_REQUESTS: '/my-requests',

    // Admin
    ADMIN_DASHBOARD: '/admin',
    ADMIN_PROGRAMMERS: '/admin/programmers',
    ADMIN_PROJECTS: '/admin/projects',
    ADMIN_SCHEDULE: '/admin/schedule',

    // Programmer
    PROGRAMMER_DASHBOARD: '/programmer',
    PROGRAMMER_PROFILE: '/programmer/profile',
    PROGRAMMER_PORTFOLIO: '/programmer/portfolio',
    PROGRAMMER_PROJECTS: '/programmer/projects',
    PROGRAMMER_ADVISORY: '/programmer/advisory',

    // Portafolio público
    PORTFOLIO_PUBLIC: '/portfolio/:programmerId',
} as const;

// ============================================================================
// CONFIGURACIÓN DE VALIDACIÓN
// ============================================================================

export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 6,
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 2000,
    MAX_FILE_SIZE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

// ============================================================================
// CONFIGURACIÓN DE PAGINACIÓN
// ============================================================================

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// CONFIGURACIÓN DE TIEMPO
// ============================================================================

export const TIME_CONFIG = {
    DEFAULT_APPOINTMENT_DURATION: 60, // minutos
    MIN_APPOINTMENT_DURATION: 15,
    MAX_APPOINTMENT_DURATION: 240,
    BUSINESS_HOURS_START: '09:00',
    BUSINESS_HOURS_END: '18:00',
} as const;

// ============================================================================
// MENSAJES DE LA APLICACIÓN
// ============================================================================

export const MESSAGES = {
    // Éxito
    SUCCESS: {
        SAVED: 'Guardado exitosamente',
        UPDATED: 'Actualizado exitosamente',
        DELETED: 'Eliminado exitosamente',
        SENT: 'Enviado exitosamente',
    },

    // Errores
    ERROR: {
        GENERIC: 'Ocurrió un error. Por favor intenta de nuevo.',
        NETWORK: 'Error de conexión. Verifica tu internet.',
        UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
        NOT_FOUND: 'No se encontró el recurso solicitado.',
        VALIDATION: 'Por favor verifica los datos ingresados.',
    },

    // Confirmaciones
    CONFIRM: {
        DELETE: '¿Estás seguro de que deseas eliminar este elemento?',
        CANCEL: '¿Estás seguro de que deseas cancelar?',
        LOGOUT: '¿Deseas cerrar sesión?',
    },
} as const;

// ============================================================================
// CONFIGURACIÓN DE STORAGE
// ============================================================================

export const STORAGE_PATHS = {
    PROFILES: 'profiles',
    PROJECTS: 'projects',
    AVATARS: 'avatars',
} as const;

// ============================================================================
// KEYS DE LOCAL STORAGE
// ============================================================================

export const LOCAL_STORAGE_KEYS = {
    THEME: 'theme',
    LAST_ROUTE: 'lastRoute',
    USER_PREFERENCES: 'userPreferences',
} as const;
