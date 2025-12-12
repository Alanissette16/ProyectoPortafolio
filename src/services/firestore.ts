/**
 * Servicio de Firestore para CRUD de usuarios, portafolios, proyectos y asesorías.
 * 
 * Este módulo centraliza todas las operaciones de base de datos con Firestore,
 * implementando separación de responsabilidades y buenas prácticas.
 * 
 * @module services/firestore
 * @description Maneja las colecciones: users, portfolios, projects, schedules, advisories
 */
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
import { Role } from './auth'
import {
  sendProgrammerAdvisoryEmail,
  sendRequesterStatusEmail,
} from './email'
import { db } from './firebase'

export const collections = {
  users: 'users',
  portfolios: 'portfolios',
  projects: 'projects',
  schedules: 'schedules',
  advisories: 'advisories',
} as const

export interface ProgrammerProfile {
  displayName: string
  lastName?: string
  email: string
  specialty?: string
  bio?: string
  quote?: string
  location?: string
  role: Role
  photoURL?: string
  skills?: string[]
  socials?: {
    github?: string
    instagram?: string
    whatsapp?: string
  }
  stats?: {
    projects: number
    experience: string
    clients: number
  }
}

export interface Portfolio {
  headline: string
  about?: string
  skills?: string[]
  tags?: string[]
  theme?: string
}

export interface Project {
  title: string
  description?: string
  category: 'academico' | 'laboral'
  role: 'frontend' | 'backend' | 'fullstack' | 'db'
  techStack?: string[]
  repoUrl?: string
  demoUrl?: string
}

export interface AdvisoryRequestInput {
  programmerId: string
  programmerEmail?: string
  programmerName?: string
  requesterName: string
  requesterEmail: string
  slot: { date: string; time: string }
  note?: string
  userId?: string | null
}

export interface ScheduleSlot {
  day: string
  from: string
  to: string
  available: boolean
}

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

/**
 * Guarda o actualiza el perfil de un programador en Firestore.
 * 
 * @param {string} uid - ID único del usuario/programador
 * @param {ProgrammerProfile} data - Datos del perfil (displayName, email, specialty, bio, etc)
 * @throws {Error} Si falla la operación con Firestore
 * @example
 * await upsertProgrammer('prog_123', { displayName: 'Juan', role: 'programmer' });
 */
export const upsertProgrammer = async (uid: string, data: ProgrammerProfile) => {
  try {
    await setDoc(doc(db, collections.users, uid), {
      ...data,
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

export const addProject = async (ownerId: string, data: Project) => {
  const docRef = await addDoc(collection(db, collections.projects), {
    ...data,
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
  console.log('📝 Guardando asesoría...', data)
  
  const contact = await resolveProgrammerContact(data.programmerId, {
    programmerEmail: data.programmerEmail,
    programmerName: data.programmerName,
  })

  const payload = {
    ...data,
    programmerEmail: contact.programmerEmail,
    programmerName: contact.programmerName,
    status: 'pendiente',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  console.log('📦 Payload a guardar:', payload)
  
  const docRef = await addDoc(collection(db, collections.advisories), payload)
  
  console.log('✅ Asesoría guardada con ID:', docRef.id)

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
  // Lista de IDs de fundadoras hardcodeadas
  const foundersIds = ['claudia', 'valentina', 'valeria']
  
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
  // Por ejemplo: si el usuario tiene email claudia@foreing.tech, también buscar por programmerId = 'claudia'
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

// Horarios
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
  return snap.exists() ? (snap.data() as DocumentData) : null
}
