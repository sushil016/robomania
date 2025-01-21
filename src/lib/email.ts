import { Resend } from 'resend'
import {
  registrationEmailTemplate,
  statusUpdateEmailTemplate,
  eventUpdateEmailTemplate,
} from './emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({
  to,
  subject,
  html
}: {
  to: string
  subject: string
  html: string
}) => {
  try {
    await resend.emails.send({
      from: 'Robomania <onboarding@resend.dev>',
      to,
      subject,
      html
    })
  } catch (error) {
    console.error('Email sending failed:', error)
  }
}

export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Robomania 2025',
    html: `
      <h1>Welcome to Robomania 2025, ${name}!</h1>
      <p>Thank you for signing up. You can now register your team for the ultimate robot battle competition.</p>
      <p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/team-register">here</a> to register your team.</p>
    `
  }),

  teamRegistration: (teamName: string) => ({
    subject: 'Team Registration Confirmation - Robomania 2025',
    html: `
      <h1>Team Registration Successful!</h1>
      <p>Your team "${teamName}" has been registered for Robomania 2025.</p>
      <p>Please complete the payment to confirm your participation.</p>
    `
  }),

  paymentSuccess: (teamName: string, amount: number) => ({
    subject: 'Payment Successful - Robomania 2025',
    html: `
      <h1>Payment Successful</h1>
      <p>We have received your payment of ₹${amount} for team "${teamName}".</p>
      <p>Your registration is now complete. Get ready for the battle!</p>
    `
  }),

  paymentFailed: (teamName: string) => ({
    subject: 'Payment Failed - Robomania 2025',
    html: `
      <h1>Payment Failed</h1>
      <p>The payment for team "${teamName}" was unsuccessful.</p>
      <p>Please try again by visiting your <a href="${process.env.NEXT_PUBLIC_APP_URL}/registration/details">registration details</a>.</p>
    `
  })
}

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
      from: 'Robomania <onboarding@resend.dev>',
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
      from: 'Robomania <onboarding@resend.dev>',
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
      from: 'Robomania <onboarding@resend.dev>',
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