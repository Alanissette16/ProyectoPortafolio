/**
 * Servicio de autenticación y roles (TypeScript).
 * Práctica: Consumo de APIs Firebase + manejo de roles en Firestore.
 */
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Unsubscribe,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'

export type Role = 'admin' | 'programmer' | 'external'

export interface UserProfile {
  displayName: string | null
  email: string | null
  photoURL?: string | null
  role: Role
  specialty?: string
  bio?: string
  socials?: Record<string, string>
}

const USERS_COLLECTION = 'users'

// Función para crear/actualizar usuario en Firestore
export const saveUserToFirestore = async (user: FirebaseUser): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, user.uid)
  
  const userDoc = await getDoc(userRef)
  
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName || 'Usuario',
      email: user.email,
      photoURL: user.photoURL || null,
      role: 'external' as Role,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    })
  } else {
    await setDoc(userRef, {
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    }, { merge: true })
  }
}

// Login con Google y creación del usuario en Firestore
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    await saveUserToFirestore(user)
    
    return user
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      return null
    }
    throw error
  }
}

// Login con Email y Contraseña
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const user = result.user
    
    // Actualizar lastLogin en Firestore
    const userRef = doc(db, USERS_COLLECTION, user.uid)
    await setDoc(userRef, {
      lastLogin: serverTimestamp(),
    }, { merge: true })
    
    return user
  } catch (error: any) {
    throw error
  }
}

// Registro con Email y Contraseña
export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user
    
    // Actualizar el perfil con el nombre
    await updateProfile(user, {
      displayName: displayName,
    })
    
    // Crear documento en Firestore
    const userRef = doc(db, USERS_COLLECTION, user.uid)
    await setDoc(userRef, {
      displayName: displayName,
      email: user.email,
      photoURL: null,
      role: 'external' as Role,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    })
    
    return user
  } catch (error: any) {
    throw error
  }
}

export const logout = () => firebaseSignOut(auth)

// Escucha de sesión para el AuthContext
export const subscribeToAuthChanges = (
  callback: (user: FirebaseUser | null) => void,
): Unsubscribe => onAuthStateChanged(auth, callback)

// Consulta del rol y perfil en Firestore
export const fetchUserProfile = async (
  uid: string,
): Promise<(UserProfile & DocumentData) | null> => {
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, uid))
    return snap.exists() ? (snap.data() as UserProfile & DocumentData) : null
  } catch {
    return null
  }
}
