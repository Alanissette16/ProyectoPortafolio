import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as nodemailer from "nodemailer";

// Configuración de Nodemailer usando variables de entorno
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar emails
export const sendEmail = onCall(async (request) => {
  const { to, subject, text, html } = request.data;

  if (!to || !subject) {
    throw new HttpsError('invalid-argument', 'Faltan parámetros: to y subject son requeridos');
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    logger.info('Email enviado exitosamente', { to, subject });
    return { success: true };
  } catch (error) {
    logger.error('Error al enviar email', error);
    throw new HttpsError('internal', 'Error al enviar el email');
  }
});
