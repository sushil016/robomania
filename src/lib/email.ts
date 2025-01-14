import { Resend } from 'resend'
import {
  registrationEmailTemplate,
  statusUpdateEmailTemplate,
  eventUpdateEmailTemplate,
} from './emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRegistrationEmail({
  teamName,
  leaderName,
  leaderEmail,
}: {
  teamName: string
  leaderName: string
  leaderEmail: string
}) {
  try {
    await resend.emails.send({
      from: 'RoboMania 2025 <no-reply@robomania2025.com>',
      to: leaderEmail,
      subject: 'Welcome to RoboMania 2025! Registration Confirmed',
      html: registrationEmailTemplate({ teamName, leaderName }),
    })
  } catch (error) {
    console.error('Failed to send registration email:', error)
    throw error
  }
}

export async function sendStatusUpdateEmail({
  teamName,
  leaderName,
  leaderEmail,
  status,
  message,
}: {
  teamName: string
  leaderName: string
  leaderEmail: string
  status: string
  message: string
}) {
  try {
    await resend.emails.send({
      from: 'RoboMania 2025 <no-reply@robomania2025.com>',
      to: leaderEmail,
      subject: `RoboMania 2025 - Registration ${status}`,
      html: statusUpdateEmailTemplate({ teamName, leaderName, status, message }),
    })
  } catch (error) {
    console.error('Failed to send status update email:', error)
    throw error
  }
}

export async function sendEventUpdateEmail({
  teamName,
  leaderName,
  leaderEmail,
  eventTitle,
  eventDetails,
  eventDate,
  actionRequired,
}: {
  teamName: string
  leaderName: string
  leaderEmail: string
  eventTitle: string
  eventDetails: string
  eventDate: string
  actionRequired?: string
}) {
  try {
    await resend.emails.send({
      from: 'RoboMania 2025 <no-reply@robomania2025.com>',
      to: leaderEmail,
      subject: `RoboMania 2025 - ${eventTitle}`,
      html: eventUpdateEmailTemplate({
        teamName,
        leaderName,
        eventTitle,
        eventDetails,
        eventDate,
        actionRequired,
      }),
    })
  } catch (error) {
    console.error('Failed to send event update email:', error)
    throw error
  }
} 