// ============================================================================
// MODELO DE PORTAFOLIO
// ============================================================================

export interface Portfolio {
    ownerId?: string; // ID del usuario propietario (opcional si es documento hijo)
    headline: string;
    about?: string;
    skills?: string[];
    tags?: string[];
    theme?: string;

    // Metadata
    updatedAt?: any; // Firestore Timestamp
}
