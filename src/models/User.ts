// ============================================================================
// MODELOS DE USUARIO
// ============================================================================
// Este archivo centraliza todos los tipos e interfaces relacionados con usuarios.
// Siguiendo Clean Architecture, estos modelos son independientes de la implementación
// de Firebase y pueden ser reutilizados con cualquier backend (ej: Spring Boot).

/**
 * Roles disponibles en el sistema
 * - admin: Administrador con acceso completo
 * - programmer: Programador que puede gestionar su portafolio
 * - external: Usuario externo que puede solicitar asesorías
 */
// Admite tanto minúsculas (legacy/frontend) como mayúsculas (backend)
export type UserRole = 'admin' | 'programmer' | 'external' | 'ADMIN' | 'PROGRAMMER' | 'EXTERNAL';

/**
 * Estados posibles de un usuario
 */
export type UserStatus = 'active' | 'inactive' | 'pending';

/**
 * Interface principal para un Usuario
 * Representa la información básica de autenticación
 */
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: UserRole;
    createdAt?: Date;
    lastLogin?: Date;
}

/**
 * Información de perfil extendida para programadores
 * Incluye datos profesionales y del portafolio
 */
export interface ProgrammerProfile {
    uid: string;
    displayName: string;
    lastName?: string;
    email: string;
    photoURL?: string;
    role: 'programmer' | 'PROGRAMMER';

    // Información profesional
    specialty?: string;
    bio?: string;
    quote?: string;
    location?: string;
    title?: string;
    skills?: string[];

    // Redes Sociales (Estructura usada en Firestore)
    socials?: {
        github?: string;
        instagram?: string;
        whatsapp?: string;
        linkedin?: string;
    };

    // Campos legacy o alternativos para compatibilidad
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;

    // Estadísticas
    stats?: {
        projects: number;
        experience: string;
        clients: number;
    };

    // Configuración
    isPublic?: boolean;
    availableForAdvisory?: boolean;

    // Metadata
    createdAt?: any;
    updatedAt?: any;
}

/**
 * Perfil de usuario externo
 * Para usuarios que solicitan asesorías
 */
export interface ExternalUserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    role: 'external' | 'EXTERNAL';
    phone?: string;
    organization?: string;
    createdAt?: Date;
}

/**
 * Perfil de administrador
 */
export interface AdminProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    role: 'admin' | 'ADMIN';
    permissions?: string[];
    createdAt?: Date;
}

/**
 * Union type para cualquier tipo de perfil de usuario
 */
export type UserProfile = ProgrammerProfile | ExternalUserProfile | AdminProfile;

/**
 * Datos para crear un nuevo usuario
 */
export interface CreateUserData {
    email: string;
    password: string;
    displayName: string;
    role?: UserRole;
}

/**
 * Datos para actualizar un usuario existente
 */
export interface UpdateUserData {
    displayName?: string;
    photoURL?: string;
    bio?: string;
    title?: string;
    skills?: string[];
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    phone?: string;
    organization?: string;
    isPublic?: boolean;
    availableForAdvisory?: boolean;
}
