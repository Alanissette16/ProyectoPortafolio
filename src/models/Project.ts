// ============================================================================
// MODELOS DE PROYECTO
// ============================================================================
// Este archivo centraliza todos los tipos e interfaces relacionados con proyectos.
// Independiente de la implementación de Firebase para facilitar migración a otros backends.

/**
 * Estados posibles de un proyecto
 */
export type ProjectStatus = 'draft' | 'published' | 'archived';

/**
 * Categorías de proyectos
 */
export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'api' | 'other';

/**
 * Interface principal para un Proyecto
 */
export interface Project {
    id: string;
    title: string;
    description?: string;
    ownerId?: string; // ID del programador propietario

    // Detalles técnicos (Alineado con firestore.service.ts)
    category: 'academico' | 'laboral' | 'web' | 'mobile' | 'desktop' | 'api' | 'other';
    role?: 'frontend' | 'backend' | 'fullstack' | 'db';
    techStack?: string[]; // Usado en firestore
    technologies?: string[]; // Alias o legacy

    // URLs (Alineado con firestore.service.ts)
    repoUrl?: string;
    demoUrl?: string;
    repositoryUrl?: string; // Alias
    liveUrl?: string; // Alias

    // Multimedia
    imageUrl?: string;
    images?: string[];
    videoUrl?: string;

    // Relación con usuario (Legacy)
    programmerId?: string;
    programmerName?: string;

    // Estado y visibilidad
    status?: ProjectStatus;
    isPublic?: boolean;
    isFeatured?: boolean;

    // Metadata
    createdAt?: any;
    updatedAt?: any;
    publishedAt?: any;
}

/**
 * Datos para crear un nuevo proyecto
 */
export interface CreateProjectData {
    title: string;
    description: string;
    technologies?: string[];
    category?: ProjectCategory;
    repositoryUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    images?: string[];
    videoUrl?: string;
    isPublic?: boolean;
    status?: ProjectStatus;
}

/**
 * Datos para actualizar un proyecto existente
 */
export interface UpdateProjectData {
    title?: string;
    description?: string;
    technologies?: string[];
    category?: ProjectCategory;
    repositoryUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    images?: string[];
    videoUrl?: string;
    isPublic?: boolean;
    status?: ProjectStatus;
    isFeatured?: boolean;
}

/**
 * Filtros para búsqueda de proyectos
 */
export interface ProjectFilters {
    programmerId?: string;
    category?: ProjectCategory;
    status?: ProjectStatus;
    isPublic?: boolean;
    isFeatured?: boolean;
    technologies?: string[];
}
