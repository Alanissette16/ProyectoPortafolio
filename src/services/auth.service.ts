
import { api } from './api.service';

//tipos de roles de usuario en el sistema
export type Role = 'admin' | 'programmer' | 'external';

//interfaz que define el perfil de un usuario
export interface UserProfile {
  id?: number; //identificador único
  displayName: string | null; //nombre para mostrar
  email: string | null; //correo electrónico
  photoURL?: string | null; //URL de la foto de perfil
  role: Role; //rol del usuario en el sistema
  token?: string; //token de autenticación
  //campos adicionales del perfil
  specialty?: string; //especialidad del programador
  bio?: string; //biografía
  socials?: Record<string, string>; //redes sociales
}

//respuesta del backend al autenticarse
interface AuthResponse {
  token: string; //token JWT
  type: string; //tipo de token (normalmente "Bearer")
  id: number; //ID del usuario
  email: string; //email del usuario
  displayName: string; //nombre del usuario
  role: Role; //rol asignado
}

//claves para localStorage
const AUTH_KEY = 'auth_user';
const TOKEN_KEY = 'token';

//guardar sesión del usuario en localStorage
export const saveUserSession = (authResponse: AuthResponse) => {
  //guardar token de autenticación
  localStorage.setItem(TOKEN_KEY, authResponse.token);

  //crear objeto de perfil de usuario
  const user: UserProfile = {
    id: authResponse.id,
    email: authResponse.email,
    displayName: authResponse.displayName,
    role: (authResponse.role || 'external').toLowerCase() as Role,
    photoURL: null //el backend aún no retorna photoURL
  };

  //guardar perfil en localStorage
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
};

//limpiar sesión del usuario (cerrar sesión)
export const clearUserSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
};

//obtener sesión actual desde localStorage
export const getUserSession = (): UserProfile | null => {
  const userStr = localStorage.getItem(AUTH_KEY);
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr) as UserProfile;
    //normalizar rol a minúsculas
    if (user && user.role) {
      user.role = (user.role || '').toLowerCase() as Role;
    }
    return user;
  } catch {
    return null;
  }
};

//iniciar sesión con email y contraseña
export const loginWithEmail = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return saveUserSession(response);
};

//registrar nuevo usuario
export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  const response = await api.post<AuthResponse>('/auth/register', { email, password, displayName });
  return saveUserSession(response);
};

//cerrar sesión del usuario
export const logout = async () => {
  clearUserSession();
  //opcional: notificar al backend
};

//obtener perfil actualizado del usuario desde el backend
export const getCurrentProfile = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const response = await api.get<AuthResponse>('/auth/me');
    //crear objeto de usuario con la respuesta
    const user: UserProfile = {
      id: response.id,
      email: response.email,
      displayName: response.displayName,
      role: (response.role || 'external').toLowerCase() as Role,
      photoURL: null
    };
    //actualizar localStorage con datos frescos
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  } catch (error: any) {
    console.error('Error fetching current profile:', error);
    //solo cerrar sesión si es error de autenticación (401)
    if (error.message?.includes('401')) {
      clearUserSession();
    }
    return null;
  }
};

