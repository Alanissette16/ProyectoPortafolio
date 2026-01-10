// ============================================================================
// PUNTO DE EXPORTACIÓN CENTRALIZADO DE MODELOS
// ============================================================================
// Este archivo facilita la importación de tipos desde un solo lugar.
// Uso: import { User, Project, AdvisoryRequest } from '@/models';

// Modelos de Usuario
export type {
    User,
    UserRole,
    UserStatus,
    ProgrammerProfile,
    ExternalUserProfile,
    AdminProfile,
    UserProfile,
    CreateUserData,
    UpdateUserData,
} from './User';

// Modelos de Proyecto
export type {
    Project,
    ProjectStatus,
    ProjectCategory,
    CreateProjectData,
    UpdateProjectData,
    ProjectFilters,
} from './Project';

// Modelos de Asesoría
export type {
    AdvisoryRequest,
    AdvisoryStatus,
    AdvisoryPriority,
    AdvisoryType,
    CreateAdvisoryData,
    UpdateAdvisoryData,
    AdvisoryFilters,
    AdvisoryStats,
} from './Advisory';

// Modelos de Horarios
export type {
    DayOfWeek,
    TimeSlot,
    DaySchedule,
    WeeklySchedule,
    Appointment,
    CreateScheduleData,
    UpdateScheduleData,
} from './Schedule';
