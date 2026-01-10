/**
 * Utilidad para actualizar el rol de un usuario en Firestore.
 * Se puede ejecutar desde la consola del navegador para cambiar roles en desarrollo.
 */
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase.config'

/**
 * Actualiza el rol de un usuario en Firestore.
 * @param userId - ID del usuario en Firebase Auth
 * @param newRole - Nuevo rol a asignar
 */
export const updateUserRole = async (
    userId: string,
    newRole: 'admin' | 'programmer' | 'external'
) => {
    try {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, { role: newRole })
        console.log(`✅ Role actualizado a: ${newRole}`)
        console.log('🔄 Recarga la página para ver los cambios')
        return true
    } catch (error) {
        console.error('❌ Error actualizando role:', error)
        return false
    }
}

// Exponemos la función globalmente para uso desde DevTools
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.updateUserRole = updateUserRole
}
