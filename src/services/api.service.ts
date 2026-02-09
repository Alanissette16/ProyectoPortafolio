

//URL base de la API - Lee desde variable de entorno (.env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

//cliente HTTP para realizar peticiones al backend
export const api = {
    //realizar petición GET
    get: async <T>(endpoint: string, headers: HeadersInit = {}): Promise<T> => request<T>(endpoint, { method: 'GET', headers }),
    //realizar petición POST
    post: async <T>(endpoint: string, body: any, headers: HeadersInit = {}): Promise<T> => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), headers }),
    //realizar petición PUT
    put: async <T>(endpoint: string, body: any, headers: HeadersInit = {}): Promise<T> => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), headers }),
    //realizar petición DELETE
    delete: async <T>(endpoint: string, headers: HeadersInit = {}): Promise<T> => request<T>(endpoint, { method: 'DELETE', headers }),
};

//función auxiliar para realizar peticiones HTTP
async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
    //obtener token de autenticación desde localStorage
    const token = localStorage.getItem('token');
    const headers = new Headers(options.headers || {});

    //agregar token al header si existe
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    //establecer tipo de contenido como JSON
    headers.set('Content-Type', 'application/json');

    const config = {
        ...options,
        headers,
    };

    //realizar la petición HTTP
    const response = await fetch(`${API_URL}${endpoint}`, config);

    //manejar errores de respuesta
    if (!response.ok) {
        if (response.status === 401) {
            //manejar no autorizado (podría redirigir a login)
            //localStorage.removeItem('token');
            //window.location.href = '/login';
            //esto debería manejarse mejor con context
        }
        const errorData = await response.json().catch(() => ({}));
        console.error(`API Error ${response.status}:`, errorData);
        const message = errorData.message || `Error ${response.status}: ${response.statusText}`;
        const error = new Error(message);
        (error as any).data = errorData;
        throw error;
    }

    //manejar respuesta vacía para 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    //retornar respuesta como JSON
    return response.json();
}
