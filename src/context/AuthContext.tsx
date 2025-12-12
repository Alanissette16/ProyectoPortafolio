/**
 * Contexto de autenticación y roles.
 * Prácticas: Fundamentos (estado/context), consumo de Firebase Auth y routing protegido.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from 'react'
import {
  loginWithGoogle,
  logout,
  subscribeToAuthChanges,
  fetchUserProfile,
  saveUserToFirestore,
  Role,
  UserProfile,
} from '../services/auth'

interface AuthContextValue {
  user: (UserProfile & { uid: string }) | null
  role: Role | null
  loading: boolean
  login: () => Promise<unknown>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(UserProfile & { uid: string }) | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  // Escuchamos cambios de sesión
  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setRole(null)
        setLoading(false)
        return
      }

      // Intentar obtener perfil de Firestore
      let profile = await fetchUserProfile(firebaseUser.uid)
      
      // Si no existe el perfil, crearlo
      if (!profile) {
        try {
          await saveUserToFirestore(firebaseUser)
          profile = await fetchUserProfile(firebaseUser.uid)
        } catch {
          // Silenciar error
        }
      }
      
      if (profile) {
        setUser({ uid: firebaseUser.uid, ...profile })
        setRole(profile.role ?? 'external')
      } else {
        // Usar datos de Firebase Auth si no hay perfil en Firestore
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: 'external',
        })
        setRole('external')
      }
      
      setLoading(false)
    })

    return unsub
  }, [])

  // Login con Google
  const login = async () => {
    setLoading(true)
    try {
      const res = await loginWithGoogle()
      setLoading(false)
      return res
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      role,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, role, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
