import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js'
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
