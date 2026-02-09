
import { api } from './api.service';

//servicio para interactuar con la API del backend
//maneja peticiones para usuarios, proyectos, asesorías y horarios

//========== USUARIOS / PROGRAMADORES ==========

//obtener lista completa de programadores del sistema
export const listProgrammers = async () => {
    try {
        //usar endpoint público para listar programadores
        const users = await api.get<any[]>('/usuarios/programadores');
        return users;
    } catch (error) {
        console.error('Error listing programmers:', error);
        return [];
    }
};

//obtener perfil de un usuario por su ID
export const getUserProfile = async (uid: string) => {
    return api.get<any>(`/usuarios/${uid}`);
};

//actualizar información del perfil de un usuario
export const updateUserProfile = async (uid: string, data: any) => {
    const response = await api.put<any>(`/usuarios/${uid}`, data);
    return response;
};

//crear o actualizar programador (función para admin)
export const upsertProgrammer = async (uid: string | number | undefined | null, data: any) => {
    //verificar si el uid es un ID temporal del frontend
    const isTempId = typeof uid === 'string' && uid.startsWith('prog_');
    const hasValidId = uid !== null && uid !== undefined && uid !== '' && !isTempId;

    if (hasValidId) {
        //actualizar usuario existente
        return updateUserProfile(uid!.toString(), data);
    } else {
        //crear nuevo usuario con contraseña por defecto
        return api.post<any>('/usuarios', { ...data, password: 'defaultPassword123' });
    }
};

//eliminar un programador del sistema
export const deleteProgrammer = async (uid: string) => {
    return api.delete<void>(`/usuarios/${uid}`);
};


//========== PROYECTOS ==========

//mapear respuesta del backend al formato del frontend
const mapProjectResponse = (p: any) => ({
    ...p,
    title: p.nombre || p.title || '',
    description: p.descripcion || p.description || '',
    category: p.categoria || p.category,
    //convertir tecnologías de string a array si es necesario
    technologies: typeof p.tecnologias === 'string'
        ? p.tecnologias.split(',').map((t: string) => t.trim()).filter(Boolean)
        : (p.technologies || p.techStack || []),
    githubUrl: p.urlRepositorio || p.repoUrl || p.githubUrl || '',
    demoUrl: p.urlDemo || p.demoUrl || '',
    imageUrl: p.imagenUrl || p.imageUrl || '',
});

//obtener todos los proyectos de un programador específico
export const listProjectsByOwner = async (uid: string) => {
    const data = await api.get<any[]>(`/proyectos/programador/${uid}`);
    return data.map(mapProjectResponse);
};

//obtener todos los proyectos públicos del sistema
export const listAllProjects = async () => {
    const data = await api.get<any[]>('/proyectos/publicos');
    return data.map(mapProjectResponse);
};

//mapear datos del frontend al formato del backend
const mapProjectData = (uid: string, data: any) => ({
    programadorId: parseInt(uid),
    nombre: data.title || data.nombre || '',
    descripcion: data.description || data.descripcion || '',
    //convertir array de tecnologías a string separado por comas
    tecnologias: Array.isArray(data.technologies)
        ? data.technologies.join(', ')
        : (Array.isArray(data.techStack) ? data.techStack.join(', ') : (data.tecnologias || '')),
    urlRepositorio: data.githubUrl || data.repoUrl || data.urlRepositorio || '',
    urlDemo: data.demoUrl || data.urlDemo || '',
    imagenUrl: data.imageUrl || data.imagenUrl || '',
    categoria: data.category || data.categoria,
    activo: data.activo !== undefined ? data.activo : true,
    destacado: data.destacado !== undefined ? data.destacado : false
});

//crear un nuevo proyecto
export const addProject = async (uid: string, data: any) => {
    const payload = mapProjectData(uid, data);
    const response = await api.post<any>('/proyectos', payload);
    return mapProjectResponse(response);
};

//actualizar un proyecto existente
export const updateProject = async (id: string, data: any) => {
    const payload = {
        nombre: data.title || data.nombre,
        descripcion: data.description || data.descripcion,
        tecnologias: Array.isArray(data.technologies)
            ? data.technologies.join(', ')
            : (Array.isArray(data.techStack) ? data.techStack.join(', ') : (data.tecnologias || '')),
        urlRepositorio: data.githubUrl || data.repoUrl || data.urlRepositorio,
        urlDemo: data.demoUrl || data.urlDemo,
        imagenUrl: data.imageUrl || data.imagenUrl,
        categoria: data.category || data.categoria,
        activo: data.activo !== undefined ? data.activo : true,
        destacado: data.destacado !== undefined ? data.destacado : false
    };
    const response = await api.put<any>(`/proyectos/${id}`, payload);
    return mapProjectResponse(response);
};

//eliminar un proyecto del sistema
export const deleteProject = async (id: string) => {
    return api.delete<void>(`/proyectos/${id}`);
};


//========== ASESORÍAS ==========

//obtener todas las asesorías del sistema (admin)
export const listAllAdvisories = async () => {
    return api.get<any[]>('/asesorias');
};

//obtener asesorías recibidas por el programador autenticado
export const listAdvisoriesByProgrammer = async () => {
    const response = await api.get<any[]>('/asesorias/programador');
    //mapear respuesta del backend al formato del frontend
    return response.map(r => ({
        id: r.id.toString(),
        requesterName: r.usuarioExternoNombre,
        requesterEmail: r.usuarioExternoEmail,
        programmerName: r.programadorNombre,
        programadorId: r.programadorId.toString(),
        slot: {
            date: r.fecha,
            time: r.horaInicio
        },
        note: r.motivo,
        status: r.estado === 'CONFIRMADA' ? 'aprobada' : r.estado.toLowerCase(),
        createdAt: r.fechaSolicitud
    }));
};

//obtener asesorías solicitadas por el usuario autenticado
export const listMyAdvisories = async () => {
    const response = await api.get<any[]>('/asesorias/mias');
    return response.map(r => ({
        id: r.id.toString(),
        programmerId: r.programadorId.toString(),
        requesterName: r.usuarioExternoNombre,
        requesterEmail: r.usuarioExternoEmail,
        slot: {
            date: r.fecha,
            time: r.horaInicio
        },
        note: r.motivo, //motivo de la solicitud
        responseMessage: r.notasAdicionales, //respuesta del programador
        status: r.estado === 'CONFIRMADA' ? 'aprobada' : r.estado.toLowerCase(),
        createdAt: r.fechaSolicitud
    }));
};

//actualizar estado de una asesoría (aprobar/rechazar)
export const updateAdvisoryStatus = async (id: string, status: string, message?: string) => {
    //mapear estado del frontend al enum del backend
    let backendStatus = status.toUpperCase();
    if (status === 'aprobada') backendStatus = 'CONFIRMADA';
    if (status === 'rechazada') backendStatus = 'RECHAZADA';

    return api.put<any>(`/asesorias/${id}/gestionar`, { estado: backendStatus, notasAdicionales: message });
};

//solicitar una nueva asesoría
export const requestAdvisory = async (data: any) => {
    //calcular hora de fin (duración de 30 minutos por defecto)
    const [hours, minutes] = data.slot.time.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours);
    endDate.setMinutes(minutes + 30);
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    const endTime = `${endHours}:${endMinutes}`;

    const payload = {
        programadorId: parseInt(data.programmerId),
        fecha: data.slot.date,
        horaInicio: data.slot.time,
        horaFin: endTime,
        motivo: data.note,
        modalidad: 'VIRTUAL' //modalidad por defecto
    };

    return api.post<any>('/asesorias', payload);
};

//========== HORARIOS ==========

//interfaz para definir un slot de horario
export interface ScheduleSlot {
    day: string //día de la semana
    from: string //hora de inicio
    to: string //hora de fin
    available: boolean //indica si está disponible
}

//obtener horario de disponibilidad de un programador
export const getScheduleByProgrammer = async (uid: string) => {
    try {
        const response = await api.get<any[]>(`/horarios/programador/${uid}`);

        //mapeo de días del backend (en mayúsculas) al frontend
        const dayMapInverse: Record<string, string> = {
            'LUNES': 'Lunes',
            'MARTES': 'Martes',
            'MIERCOLES': 'Miércoles',
            'JUEVES': 'Jueves',
            'VIERNES': 'Viernes',
            'SABADO': 'Sábado',
            'DOMINGO': 'Domingo'
        };

        const slots: ScheduleSlot[] = response.map(h => ({
            day: dayMapInverse[h.diaSemana] || h.diaSemana,
            from: h.horaInicio.substring(0, 5), //extraer solo hora y minutos
            to: h.horaFin.substring(0, 5),
            available: h.activo
        }));

        return { slots };
    } catch (e) {
        console.error('Error fetching schedule:', e);
        return { slots: [] };
    }
};

//guardar o actualizar horarios de un programador
export const upsertSchedule = async (programadorId: string, slots: ScheduleSlot[]) => {
    //mapeo de días del frontend al formato del backend
    const dayMap: Record<string, string> = {
        'Lunes': 'LUNES',
        'Martes': 'MARTES',
        'Miércoles': 'MIERCOLES',
        'Jueves': 'JUEVES',
        'Viernes': 'VIERNES',
        'Sábado': 'SABADO',
        'Domingo': 'DOMINGO'
    };

    //transformar slots al formato esperado por el backend
    const dtos = slots.map(slot => ({
        programadorId: parseInt(programadorId),
        diaSemana: dayMap[slot.day] || 'LUNES',
        horaInicio: slot.from,
        horaFin: slot.to,
        activo: slot.available,
        modalidad: 'VIRTUAL' //modalidad por defecto
    }));

    return api.put<any>(`/horarios/programador/${programadorId}`, dtos);
};

//funciones alias para compatibilidad con código existente
export const getPortfolio = getUserProfile;
export const upsertPortfolio = updateUserProfile; //el portafolio es parte del perfil de usuario
export const addAdvisoryRequest = requestAdvisory;
export const listAllUsers = async () => api.get<any[]>('/usuarios');
export const updateUserRole = async (uid: string, role: string) => updateUserProfile(uid, { role });
