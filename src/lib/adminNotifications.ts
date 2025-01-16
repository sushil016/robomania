import { Resend } from 'resend'
import { adminEmailTemplate } from './emailTemplates'


const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAdminNotification({
  subject,
  message,
  adminEmails,
}: {
  subject: string
  message: string
  adminEmails: string[]
}) {
  try {
    await resend.emails.send({
      from: 'RoboMania Admin <admin@robomania2025.com>',
      to: adminEmails,
      subject,
      html: adminEmailTemplate({ 
        adminName: 'Admin',
        subject, 
        message 
      }),
    })
  } catch (error) {
    console.error('Failed to send admin notification:', error)
    throw error
  }
} 