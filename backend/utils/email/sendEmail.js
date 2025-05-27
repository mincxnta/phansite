import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, REPORT_NOTIFICATION_TEMPLATE } from './emailTemplates.js'
import { getPreferredLanguage } from './getPreferredLanguage.js'
import { emailTranslations } from './emailTranslations.js'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

/**
 * Envía un correo electrónico de verificación de cuenta al usuario.
 *
 * @param {string} to - Dirección de correo electrónico del destinatario.
 * @param {string} code - Código de verificación que se incluirá en el correo.
 * @param {string | undefined} acceptLanguageHeader - Header 'Accept-Language' para determinar idioma.
 *
 * @throws {Error} Lanza error si falla el envío del correo.
 */
export const sendVerificationEmail = async (to, code, acceptLanguageHeader) => {
  try {
    const language = getPreferredLanguage(acceptLanguageHeader)
    const mailOptions = {
      from: `"Phantom Aficionado Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailTranslations[language]?.verifyEmailTitle || emailTranslations.en.verifyEmailTitle,
      html: VERIFICATION_EMAIL_TEMPLATE(code, language),
      text: `${emailTranslations[language]?.thankYouMessage || emailTranslations.en.thankYouMessage} ${code}`
    }

    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

/**
 * Envía un correo electrónico para restablecer la contraseña.
 *
 * @param {string} to - Dirección de correo electrónico del destinatario.
 * @param {string} resetToken - Token de restablecimiento de contraseña.
 * @param {string | undefined} acceptLanguageHeader - Header 'Accept-Language' para determinar idioma.
 *
 * @throws {Error} Lanza error si falla el envío del correo.
 */
export const sendResetPasswordEmail = async (to, resetToken, acceptLanguageHeader) => {
  try {
    const language = getPreferredLanguage(acceptLanguageHeader)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
    const mailOptions = {
      from: `"Phantom Aficionado Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailTranslations[language]?.passwordResetTitle || emailTranslations.en.passwordResetTitle,
      html: PASSWORD_RESET_REQUEST_TEMPLATE(resetUrl, language),
      text: `${emailTranslations[language]?.passwordResetMessage || emailTranslations.en.passwordResetMessage} ${resetUrl}`
    }

    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

/** Envía un correo electrónico de notificación al administrador cuando se crea un nuevo reporte.
 *
 * @param {Object} reportDetails - Detalles del reporte.
 * @param {string | undefined} acceptLanguageHeader - Header 'Accept-Language' para determinar idioma.
 *
 * @throws {Error} Lanza error si falla el envío del correo.
 */
export const sendReportNotificationEmail = async (reportDetails, acceptLanguageHeader) => {
  try {
    const language = getPreferredLanguage(acceptLanguageHeader)
    const mailOptions = {
      from: `"Phantom Aficionado Team" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: emailTranslations[language]?.reportNotificationTitle || emailTranslations.en.reportNotificationTitle,
      html: REPORT_NOTIFICATION_TEMPLATE(reportDetails, language),
      text: `
        ${language === 'es' ? 'Nuevo informe recibido:' : 'New report received:'}
        - User: ${reportDetails.username} (ID: ${reportDetails.userId})
        - Content Type: ${reportDetails.reportedType}
        - Content ID: ${reportDetails.postId}
        - Reason: ${reportDetails.reason || 'Not specified'}
        - Date: ${new Date(reportDetails.createdAt).toLocaleString()}
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Report notification email sent successfully')
  } catch (error) {
    console.log('Error sending report notification email:', error)
    throw new Error(`Failed to send report notification email: ${error.message}`)
  }
}
