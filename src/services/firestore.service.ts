import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { AdvisoryRequestInput } from '../models/Advisory'
import { Portfolio } from '../models/Portfolio'
import { Project } from '../models/Project'
import { ScheduleSlot } from '../models/Schedule'
import { ProgrammerProfile, UserRole } from '../models/User'
import {
  sendProgrammerAdvisoryEmail,
  sendRequesterStatusEmail,
} from './email.service'
import { db } from './firebase.config'

export const collections = {
  users: 'users',
  portfolios: 'portfolios',
  projects: 'projects',
  schedules: 'schedules',
  advisories: 'advisories',
} as const

// Interfaces eliminadas y reemplazadas por imports de ../models

// ==========================================
// GESTIÓN DE USUARIOS (Admin)
// ==========================================

/**
 * Obtiene todos los usuarios del sistema (admin, programmer, external).
 */
export const listAllUsers = async () => {
  const snap = await getDocs(collection(db, collections.users))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))
}

/**
 * Actualiza el rol de un usuario.
 * @param uid ID del usuario
 * @param newRole Nuevo rol a asignar
 */
export const updateUserRole = async (uid: string, newRole: UserRole) => {
  await updateDoc(doc(db, collections.users, uid), {
    role: newRole,
    updatedAt: serverTimestamp(),
  })
}

export const deleteUser = async (uid: string) => {
  await deleteDoc(doc(db, collections.users, uid))
}

// ==========================================
// GESTIÓN DE PROGRAMADORES
// ==========================================

const resolveProgrammerContact = async (
  programmerId: string,
  fallback?: { programmerEmail?: string; programmerName?: string },
) => {
  if (!programmerId) return fallback || {}

  try {
    const ref = doc(db, collections.users, programmerId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return fallback || {}

    const data = snap.data() as DocumentData
    return {
      programmerEmail: (data.email as string) || fallback?.programmerEmail,
      programmerName: (data.displayName as string) || fallback?.programmerName,
    }
  } catch (error) {
    console.error('No se pudo obtener el contacto del programador:', error)
    return fallback || {}
  }
}

// Re-exports para mantener compatibilidad con componentes existentes
export type { AdvisoryRequestInput } from '../models/Advisory'
export type { Portfolio } from '../models/Portfolio'
export type { Project } from '../models/Project'
export type { ScheduleSlot } from '../models/Schedule'
export type { ProgrammerProfile } from '../models/User'

/**
 * Guarda o actualiza el perfil de un programador en Firestore.
 * 
 * @param {string} uid - ID único del usuario/programador
 * @param {ProgrammerProfile} data - Datos del perfil (displayName, email, specialty, bio, etc)
 * @throws {Error} Si falla la operación con Firestore
 * @example
 * await upsertProgrammer('prog_123', { displayName: 'Juan', role: 'programmer' });
 */
export const upsertProgrammer = async (uid: string, data: Omit<ProgrammerProfile, 'uid'>) => {
  try {
    const payload = { ...data, uid } as ProgrammerProfile // Aseguramos que se guarde con uid si es necesario o firestore lo ignora al ser docId
    await setDoc(doc(db, collections.users, uid), {
      ...payload,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error en upsertProgrammer:', error)
    throw error
  }
}

/**
 * Obtiene todos los usuarios con rol 'programmer' desde Firestore.
 * 
 * @returns {Promise<Array>} Lista de programadores con sus datos
 * @example
 * const programmers = await listProgrammers();
 */
export const listProgrammers = async () => {
  const q = query(
    collection(db, collections.users),
    where('role', '==', 'programmer'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))
}

export const deleteProgrammer = async (uid: string) => {
  await deleteDoc(doc(db, collections.users, uid))
}

// Portafolios
export const getPortfolio = async (ownerId: string) => {
  const ref = doc(db, collections.portfolios, ownerId)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as Portfolio & DocumentData) : null
}

export const upsertPortfolio = async (ownerId: string, payload: Portfolio) => {
  await setDoc(doc(db, collections.portfolios, ownerId), {
    ...payload,
    ownerId,
    updatedAt: serverTimestamp(),
  })
}

// Proyectos
export const listProjectsByOwner = async (ownerId: string) => {
  const q = query(
    collection(db, collections.projects),
    where('ownerId', '==', ownerId),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))
}

export const addProject = async (ownerId: string, data: Omit<Project, 'id'>) => {
  // Aseguramos que data no incluya id si viene del form, firestore lo genera
  const { ...projectData } = data as any
  const docRef = await addDoc(collection(db, collections.projects), {
    ...projectData,
    ownerId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef
}


export const updateProject = async (projectId: string, data: Partial<Project>) =>
  updateDoc(doc(db, collections.projects, projectId), {
    ...data,
    updatedAt: serverTimestamp(),
  })

/**
 * Lista todos los proyectos de la base de datos.
 * Usado para mostrar proyectos públicamente.
 */
export const listAllProjects = async () => {
  const snap = await getDocs(collection(db, collections.projects))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))
}

// Asesorias
export const addAdvisoryRequest = async (data: AdvisoryRequestInput) => {
  const contact = await resolveProgrammerContact(data.programmerId, {
    programmerEmail: data.programmerEmail,
    programmerName: data.programmerName,
  })

  // Usamos as any para compatibilidad flexible con el modelo estricto
  const payload: any = {
    ...data,
    programmerEmail: contact.programmerEmail,
    programmerName: contact.programmerName,
    status: 'pendiente',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, collections.advisories), payload)

  try {
    await sendProgrammerAdvisoryEmail({
      programmerEmail: payload.programmerEmail,
      programmerName: payload.programmerName,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      date: data.slot.date,
      time: data.slot.time,
      note: data.note,
    })
  } catch (emailError) {
    console.warn('⚠️ Error enviando email (no crítico):', emailError)
  }

  return docRef
}

// Lista todas las asesorías (para admins o programadores)
export const listAllAdvisories = async () => {
  const snap = await getDocs(collection(db, collections.advisories))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))
}

export const listAdvisoriesByProgrammer = async (programmerId: string, programmerEmail?: string) => {
  // Buscar por programmerId (uid del usuario)
  const qById = query(
    collection(db, collections.advisories),
    where('programmerId', '==', programmerId),
  )
  const snapById = await getDocs(qById)
  const byId = snapById.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))

  // Si hay email, también buscar por email del programador
  let byEmail: { id: string }[] = []
  if (programmerEmail) {
    const qByEmail = query(
      collection(db, collections.advisories),
      where('programmerEmail', '==', programmerEmail),
    )
    const snapByEmail = await getDocs(qByEmail)
    byEmail = snapByEmail.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))
  }

  // También buscar si el email coincide con una fundadora
  let byFounder: { id: string }[] = []
  if (programmerEmail) {
    // Mapeo de emails a IDs de fundadoras
    const emailToFounder: Record<string, string> = {
      'claudia@foreing.tech': 'claudia',
      'valentina@foreing.tech': 'valentina',
      'valeria@foreing.tech': 'valeria',
    }

    const founderId = emailToFounder[programmerEmail.toLowerCase()]
    if (founderId) {
      const qByFounder = query(
        collection(db, collections.advisories),
        where('programmerId', '==', founderId),
      )
      const snapByFounder = await getDocs(qByFounder)
      byFounder = snapByFounder.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))
    }
  }

  // Combinar resultados sin duplicados
  const combined = [...byId]
  const addIfNew = (items: any[]) => {
    items.forEach(item => {
      if (!combined.find(i => i.id === item.id)) {
        combined.push(item)
      }
    })
  }
  addIfNew(byEmail)
  addIfNew(byFounder)

  return combined
}

export const updateAdvisoryStatus = async (
  advisoryId: string,
  status: 'pendiente' | 'aprobada' | 'rechazada',
  responseMessage?: string,
) => {
  const ref = doc(db, collections.advisories, advisoryId)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    throw new Error('La asesoria no existe')
  }

  const advisoryData = snap.data() as DocumentData

  await updateDoc(ref, {
    status,
    responseMessage,
    updatedAt: serverTimestamp(),
  })

  const contact = await resolveProgrammerContact(advisoryData.programmerId, {
    programmerEmail: advisoryData.programmerEmail,
    programmerName: advisoryData.programmerName,
  })

  await sendRequesterStatusEmail({
    requesterEmail: advisoryData.requesterEmail as string | undefined,
    requesterName: advisoryData.requesterName as string | undefined,
    programmerName: contact.programmerName,
    status,
    date: advisoryData.slot?.date as string | undefined,
    time: advisoryData.slot?.time as string | undefined,
    responseMessage,
  })
}

// ==========================================
// DEFAULT SCHEDULES (Fallback for static programmers)
// ==========================================

const createDefaultSlots = (): ScheduleSlot[] => [
  { day: 'Lunes', from: '09:00', to: '17:00', available: true },
  { day: 'Martes', from: '09:00', to: '17:00', available: true },
]

const DEFAULT_SCHEDULES: Record<string, ScheduleSlot[]> = {
  'claudia': createDefaultSlots(),
  'valeria': createDefaultSlots(),
}

export const upsertSchedule = async (programmerId: string, slots: ScheduleSlot[]) => {
  await setDoc(doc(db, collections.schedules, programmerId), {
    programmerId,
    slots,
    updatedAt: serverTimestamp(),
  })
}

export const getScheduleByProgrammer = async (programmerId: string) => {
  const ref = doc(db, collections.schedules, programmerId)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    return snap.data() as DocumentData
  }

  // Fallback para programadores estáticos
  if (DEFAULT_SCHEDULES[programmerId]) {
    return {
      programmerId,
      slots: DEFAULT_SCHEDULES[programmerId],
      isDefault: true
    }
  }

  return null
}
