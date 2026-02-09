
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import {
  loginWithEmail,
  registerWithEmail,
  logout as authLogout,
  getUserSession,
  Role,
  UserProfile,
} from '../services/auth.service';

//interfaz que define la estructura del contexto de autenticación
interface AuthContextValue {
  user: (UserProfile & { uid?: string }) | null; //usuario actual autenticado
  role: Role | null; //rol del usuario (admin, programmer, external)
  loading: boolean; //indica si se está cargando la información de autenticación
  login: (email: string, pass: string) => Promise<unknown>; //función para iniciar sesión
  register: (email: string, pass: string, name: string) => Promise<unknown>; //función para registrarse
  logout: () => Promise<void>; //función para cerrar sesión
  isAuthenticated: boolean; //indica si hay un usuario autenticado
}

//crear el contexto de autenticación
const AuthContext = createContext<AuthContextValue | null>(null);

//proveedor del contexto de autenticación para toda la aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //estado para almacenar los datos del usuario autenticado
  const [user, setUser] = useState<(UserProfile & { uid?: string }) | null>(null);
  //estado para almacenar el rol del usuario
  const [role, setRole] = useState<Role | null>(null);
  //estado para indicar si se está cargando la información
  const [loading, setLoading] = useState(true);

  //efecto que se ejecuta al montar el componente para inicializar la autenticación
  useEffect(() => {
    const initAuth = async () => {
      //intentar cargar sesión desde localStorage para UI inmediata
      const savedUser = getUserSession();
      if (savedUser) {
        setUser({ ...savedUser, uid: savedUser.id?.toString() });
        setRole(savedUser.role);
      }

      //sincronizar con backend para obtener información actualizada
      try {
        const { getCurrentProfile } = await import('../services/auth.service');
        const freshUser = await getCurrentProfile();
        if (freshUser) {
          setUser({ ...freshUser, uid: freshUser.id?.toString() });
          setRole(freshUser.role);
        }
      } catch (error) {
        console.error('Failed to sync profile:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  //función para iniciar sesión con email y contraseña
  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userProfile = await loginWithEmail(email, pass);
      setUser({ ...userProfile, uid: userProfile.id?.toString() });
      setRole(userProfile.role);
      setLoading(false);
      return userProfile;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  //función para registrar un nuevo usuario
  const register = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const userProfile = await registerWithEmail(email, pass, name);
      setUser({ ...userProfile, uid: userProfile.id?.toString() });
      setRole(userProfile.role);
      setLoading(false);
      return userProfile;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  //función para cerrar sesión y limpiar estado
  const logout = async () => {
    await authLogout();
    setUser(null);
    setRole(null);
  };

  //memorizar el valor del contexto para evitar re-renders innecesarios
  const value: AuthContextValue = useMemo(
    () => ({
      user,
      role,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user //el usuario está autenticado si user no es null
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//hook personalizado para usar el contexto de autenticación en cualquier componente
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
