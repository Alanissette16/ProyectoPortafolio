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
  subscribeToUserProfile,
  Role,
  UserProfile,
} from '../services/auth.service'

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

  // Escuchamos cambios de sesión y perfil en tiempo real
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined

    const unsubscribeAuth = subscribeToAuthChanges(async (firebaseUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile()
        unsubscribeProfile = undefined
      }

      if (!firebaseUser) {
        setUser(null)
        setRole(null)
        setLoading(false)
        return
      }

      // Asegurar registro inicial
      try {
        await saveUserToFirestore(firebaseUser)
      } catch (error) {
        console.error('Error registrando usuario:', error)
      }

      // Suscribirse a cambios del documento en Firestore
      unsubscribeProfile = subscribeToUserProfile(firebaseUser.uid, (profile) => {
        if (profile) {
          const roleStr = typeof profile.role === 'string' ? profile.role.trim() : 'external'
          const safeRole = (['admin', 'programmer', 'external'].includes(roleStr) ? roleStr : 'external') as Role

          setUser({ uid: firebaseUser.uid, ...profile })
          setRole(safeRole)
        } else {
          // Fallback visual
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined,
            role: 'external',
          })
          setRole('external')
        }
        setLoading(false)
      })
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeProfile) unsubscribeProfile()
    }
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
