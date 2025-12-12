/**
 * Servicio de correos (EmailJS).
 * Permite enviar notificaciones por correo a programadores y solicitantes de asesoría.
 * Centraliza la lógica de envío y configuración, evitando duplicidad en los componentes.
 */
import emailjs from '@emailjs/browser'

// Configuración de EmailJS
const serviceId = "service_jcoyc8l"
const templateRequester = "template_shudliq"
const templateProgrammer = "template_zijzaul"
const publicKey = "2hWPAgjtrE7y_w85W"

// Verifica configuración
const isConfigured = (templateId?: string) =>
  Boolean(serviceId && publicKey && templateId)

/**
 * Envía un correo usando EmailJS.
 * @param templateId ID del template de EmailJS
 * @param params Parámetros a enviar al template
 */
const sendEmail = async (
  templateId: string | undefined,
  params: Record<string, unknown>,
) => {
  if (!isConfigured(templateId)) {
    return
  }
  try {
    await emailjs.send(serviceId as string, templateId as string, params, {
      publicKey,
    })
  } catch (error) {
    console.error('Error al enviar correo:', error)
  }
}

// Tipado para el correo al programador
export interface ProgrammerAdvisoryEmailInput {
  programmerEmail?: string
  programmerName?: string
  requesterName: string
  requesterEmail: string
  date: string
  time: string
  note?: string
}

/**
 * Envía notificación de nueva asesoría al programador.
 * @param payload Datos de la asesoría y destinatario
 */
export const sendProgrammerAdvisoryEmail = async (
  payload: ProgrammerAdvisoryEmailInput,
) => {
  if (!payload.programmerEmail) {
    return
  }
  await sendEmail(templateProgrammer, {
    to_email: payload.programmerEmail,
    programmer_name: payload.programmerName || 'Programador',
    requester_name: payload.requesterName,
    requester_email: payload.requesterEmail,
    date: payload.date,
    time: payload.time,
    note: payload.note || 'Sin comentarios adicionales.',
  })
}

// Tipado para el correo al solicitante
export interface RequesterStatusEmailInput {
  requesterEmail?: string
  requesterName?: string
  programmerName?: string
  status: 'pendiente' | 'aprobada' | 'rechazada'
  date?: string
  time?: string
  responseMessage?: string
}

/**
 * Envía notificación de estado de asesoría al solicitante.
 * @param payload Datos de la asesoría y destinatario
 */
export const sendRequesterStatusEmail = async (
  payload: RequesterStatusEmailInput,
) => {
  if (!payload.requesterEmail) {
    return
  }
  await sendEmail(templateRequester, {
    to_email: payload.requesterEmail,
    requester_name: payload.requesterName || 'Cliente',
    programmer_name: payload.programmerName || 'Programador',
    status: payload.status,
    date: payload.date || 'Fecha por confirmar',
    time: payload.time || 'Hora por confirmar',
    response_message:
      payload.responseMessage ||
      (payload.status === 'aprobada'
        ? 'Tu solicitud fue aprobada.'
        : 'Tu solicitud fue rechazada.'),
  })
}
