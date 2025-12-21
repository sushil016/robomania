import { Resend } from 'resend'
import {
  registrationEmailTemplate,
  statusUpdateEmailTemplate,
  eventUpdateEmailTemplate,
} from './emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Robomania <onboarding@resend.dev>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://robomania.vercel.app'

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
      from: FROM_EMAIL,
      to,
      subject,
      html
    })
    console.log(`✅ Email sent to ${to}: ${subject}`)
  } catch (error) {
    console.error('Email sending failed:', error)
  }
}

// ===========================================
// WELCOME / SIGNUP EMAIL
// ===========================================
export async function sendWelcomeEmail({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff; }
    .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #f97316, #f59e0b); }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
    .content { padding: 40px 30px; }
    .welcome-box { background: linear-gradient(135deg, #fff7ed, #fffbeb); border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 30px; border: 1px solid #fed7aa; }
    .welcome-box h2 { color: #ea580c; margin: 0 0 10px; }
    .features { display: flex; flex-direction: column; gap: 15px; margin: 30px 0; }
    .feature { display: flex; align-items: center; gap: 15px; padding: 15px; background: #f9fafb; border-radius: 12px; }
    .feature-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #f97316, #f59e0b); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; }
    .cta-button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 20px 0; }
    .footer { text-align: center; padding: 30px; background: #f9fafb; border-top: 1px solid #e5e7eb; }
    .footer p { color: #6b7280; margin: 5px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 Welcome to RoboMania 2025!</h1>
      <p>The Ultimate Robotics Competition</p>
    </div>
    
    <div class="content">
      <div class="welcome-box">
        <h2>Hello ${name || 'Champion'}! 👋</h2>
        <p>Your account has been created successfully. Get ready to build, battle, and conquer!</p>
      </div>
      
      <div class="features">
        <div class="feature">
          <div class="feature-icon">⚔️</div>
          <div>
            <strong>RoboWars</strong>
            <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">Epic robot combat battles</p>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">🏎️</div>
          <div>
            <strong>RoboRace</strong>
            <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">High-speed autonomous racing</p>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">⚽</div>
          <div>
            <strong>RoboSoccer</strong>
            <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">2v2 robot soccer championship</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${APP_URL}/team-register" class="cta-button">Register Your Team Now →</a>
        <p style="color: #6b7280; font-size: 14px;">Limited slots available!</p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>RoboMania 2025</strong></p>
      <p>Questions? Reply to this email or visit our website</p>
      <p style="font-size: 12px; color: #9ca3af;">© 2025 RoboMania. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '🤖 Welcome to RoboMania 2025! Your Journey Begins',
      html
    })
    console.log(`✅ Welcome email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

// ===========================================
// TEAM REGISTRATION STARTED (Pay Later)
// ===========================================
export async function sendRegistrationStartedEmail({
  teamName,
  leaderName,
  leaderEmail,
  competitions,
  totalAmount,
}: {
  teamName: string
  leaderName: string
  leaderEmail: string
  competitions: string[]
  totalAmount: number
}) {
  const competitionNames = competitions.map(c => {
    const names: Record<string, string> = { 'ROBOWARS': 'RoboWars ⚔️', 'ROBORACE': 'RoboRace 🏎️', 'ROBOSOCCER': 'RoboSoccer ⚽' }
    return names[c] || c
  }).join(', ')
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #f97316, #f59e0b); }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 40px 30px; }
    .status-box { background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 16px; padding: 25px; text-align: center; margin-bottom: 30px; }
    .status-box h2 { color: #d97706; margin: 0 0 10px; }
    .details-card { background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .details-card h3 { margin: 0 0 15px; color: #374151; font-size: 16px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .total-row { background: linear-gradient(135deg, #f97316, #f59e0b); color: white; padding: 15px; border-radius: 10px; margin-top: 15px; display: flex; justify-content: space-between; font-weight: bold; }
    .cta-button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .footer { text-align: center; padding: 30px; background: #f9fafb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Registration Started!</h1>
    </div>
    
    <div class="content">
      <div class="status-box">
        <h2>⏳ Payment Pending</h2>
        <p>Hi ${leaderName}, your registration is saved but awaiting payment</p>
      </div>
      
      <div class="details-card">
        <h3>📝 Registration Details</h3>
        <div class="detail-row">
          <span>Team Name</span>
          <strong>${teamName}</strong>
        </div>
        <div class="detail-row">
          <span>Competitions</span>
          <strong>${competitionNames}</strong>
        </div>
        <div class="total-row">
          <span>Amount Due</span>
          <span>₹${totalAmount}</span>
        </div>
      </div>
      
      <div class="warning">
        <strong>⚠️ Important:</strong> Complete payment within 48 hours to secure your slot. Unpaid registrations may be cancelled.
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${APP_URL}/dashboard" class="cta-button">Complete Payment →</a>
      </div>
    </div>
    
    <div class="footer">
      <p style="color: #6b7280; font-size: 14px;">RoboMania 2025 • Questions? Reply to this email</p>
    </div>
  </div>
</body>
</html>
  `
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: leaderEmail,
      subject: `📋 Registration Started - ${teamName} | Payment Pending`,
      html
    })
    console.log(`✅ Registration started email sent to ${leaderEmail}`)
  } catch (error) {
    console.error('Failed to send registration started email:', error)
  }
}

// ===========================================
// COMPETITION REGISTRATION EMAIL
// ===========================================
export async function sendCompetitionRegisteredEmail({
  teamName,
  leaderName,
  leaderEmail,
  competition,
  amount,
  paymentStatus,
}: {
  teamName: string
  leaderName: string
  leaderEmail: string
  competition: string
  amount: number
  paymentStatus: 'COMPLETED' | 'PENDING'
}) {
  const competitionInfo: Record<string, { name: string; emoji: string; desc: string }> = {
    'ROBOWARS': { name: 'RoboWars', emoji: '⚔️', desc: 'Epic robot combat battles' },
    'ROBORACE': { name: 'RoboRace', emoji: '🏎️', desc: 'High-speed autonomous racing' },
    'ROBOSOCCER': { name: 'RoboSoccer', emoji: '⚽', desc: '2v2 robot soccer championship' }
  }
  
  const info = competitionInfo[competition] || { name: competition, emoji: '🤖', desc: 'Competition' }
  const isPaid = paymentStatus === 'COMPLETED'
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, ${isPaid ? '#22c55e, #16a34a' : '#f97316, #f59e0b'}); }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 40px 30px; }
    .competition-card { background: linear-gradient(135deg, #fff7ed, #fffbeb); border: 2px solid #fed7aa; border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 30px; }
    .competition-emoji { font-size: 48px; margin-bottom: 15px; }
    .competition-name { font-size: 24px; font-weight: bold; color: #ea580c; margin: 0; }
    .competition-desc { color: #6b7280; margin: 10px 0 0; }
    .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; margin: 20px 0; ${isPaid ? 'background: #dcfce7; color: #16a34a;' : 'background: #fef3c7; color: #d97706;'} }
    .details-card { background: #f9fafb; border-radius: 12px; padding: 20px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .cta-button { display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; }
    .footer { text-align: center; padding: 30px; background: #f9fafb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isPaid ? '✅ Registration Confirmed!' : '📝 Registered for Competition'}</h1>
    </div>
    
    <div class="content">
      <div class="competition-card">
        <div class="competition-emoji">${info.emoji}</div>
        <p class="competition-name">${info.name}</p>
        <p class="competition-desc">${info.desc}</p>
        <div class="status-badge">${isPaid ? '✓ PAID' : '⏳ PAYMENT PENDING'}</div>
      </div>
      
      <div class="details-card">
        <div class="detail-row">
          <span>Team</span>
          <strong>${teamName}</strong>
        </div>
        <div class="detail-row">
          <span>Leader</span>
          <strong>${leaderName}</strong>
        </div>
        <div class="detail-row">
          <span>Registration Fee</span>
          <strong>₹${amount}</strong>
        </div>
        <div class="detail-row">
          <span>Payment Status</span>
          <strong style="color: ${isPaid ? '#16a34a' : '#d97706'};">${isPaid ? 'Completed' : 'Pending'}</strong>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${APP_URL}/dashboard" class="cta-button">${isPaid ? 'View Dashboard' : 'Complete Payment →'}</a>
      </div>
    </div>
    
    <div class="footer">
      <p style="color: #6b7280; font-size: 14px;">RoboMania 2025 • Team ${teamName}</p>
    </div>
  </div>
</body>
</html>
  `
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: leaderEmail,
      subject: `${info.emoji} ${teamName} registered for ${info.name}! ${isPaid ? '✅' : '⏳ Payment Pending'}`,
      html
    })
    console.log(`✅ Competition registration email sent to ${leaderEmail} for ${competition}`)
  } catch (error) {
    console.error('Failed to send competition registered email:', error)
  }
}

// ===========================================
// PAYMENT CONFIRMED EMAIL
// ===========================================
export async function sendPaymentConfirmedEmail({
  teamName,
  leaderName,
  leaderEmail,
  competitions,
  totalAmount,
  transactionId,
}: {
  teamName: string
  leaderName: string
  leaderEmail: string
  competitions: string[]
  totalAmount: number
  transactionId: string
}) {
  const competitionList = competitions.map(c => {
    const info: Record<string, string> = { 'ROBOWARS': '⚔️ RoboWars', 'ROBORACE': '🏎️ RoboRace', 'ROBOSOCCER': '⚽ RoboSoccer' }
    return info[c] || c
  })
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { text-align: center; padding: 50px 20px; background: linear-gradient(135deg, #22c55e, #16a34a); }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px; }
    .content { padding: 40px 30px; }
    .success-box { background: #dcfce7; border: 2px solid #86efac; border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 30px; }
    .success-icon { font-size: 60px; margin-bottom: 15px; }
    .amount { font-size: 36px; font-weight: bold; color: #16a34a; margin: 10px 0; }
    .receipt-card { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .receipt-header { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 15px; }
    .receipt-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .receipt-row:last-child { border-bottom: none; font-weight: bold; }
    .competitions-list { background: #fff7ed; border-radius: 10px; padding: 15px; margin: 15px 0; }
    .competition-item { padding: 8px 0; color: #ea580c; font-weight: 500; }
    .cta-button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; }
    .footer { text-align: center; padding: 30px; background: #f9fafb; }
    .transaction-id { font-family: monospace; background: #e5e7eb; padding: 8px 15px; border-radius: 6px; font-size: 13px; color: #374151; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Payment Successful!</h1>
      <p>Your registration is now confirmed</p>
    </div>
    
    <div class="content">
      <div class="success-box">
        <div class="success-icon">✅</div>
        <p style="margin: 0; color: #16a34a; font-weight: 600;">Payment Received</p>
        <div class="amount">₹${totalAmount}</div>
      </div>
      
      <div class="receipt-card">
        <div class="receipt-header">📄 Payment Receipt</div>
        <div class="receipt-row">
          <span>Team Name</span>
          <strong>${teamName}</strong>
        </div>
        <div class="receipt-row">
          <span>Team Leader</span>
          <strong>${leaderName}</strong>
        </div>
        <div class="receipt-row">
          <span>Transaction ID</span>
          <span class="transaction-id">${transactionId}</span>
        </div>
        <div class="receipt-row">
          <span>Date</span>
          <strong>${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
        </div>
        <div class="competitions-list">
          <strong>Competitions Registered:</strong>
          ${competitionList.map(c => `<div class="competition-item">${c}</div>`).join('')}
        </div>
        <div class="receipt-row" style="background: #dcfce7; margin: 0 -25px -25px; padding: 15px 25px; border-radius: 0 0 12px 12px;">
          <span>Total Paid</span>
          <strong style="color: #16a34a; font-size: 18px;">₹${totalAmount}</strong>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${APP_URL}/dashboard" class="cta-button">View Your Dashboard →</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">Get ready to compete! 🤖</p>
      </div>
    </div>
    
    <div class="footer">
      <p style="color: #374151; font-weight: 600;">Thank you for registering!</p>
      <p style="color: #6b7280; font-size: 14px;">RoboMania 2025 • See you at the arena!</p>
    </div>
  </div>
</body>
</html>
  `
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: leaderEmail,
      subject: `🎉 Payment Confirmed! ${teamName} is registered for RoboMania 2025`,
      html
    })
    console.log(`✅ Payment confirmed email sent to ${leaderEmail}`)
  } catch (error) {
    console.error('Failed to send payment confirmed email:', error)
  }
}

// ===========================================
// PAYMENT PENDING REMINDER EMAIL
// ===========================================
export async function sendPaymentReminderEmail({
  teamName,
  leaderName,
  leaderEmail,
  competitions,
  totalAmount,
  daysPending,
}: {
  teamName: string
  leaderName: string
  leaderEmail: string
  competitions: string[]
  totalAmount: number
  daysPending: number
}) {
  const competitionNames = competitions.map(c => {
    const names: Record<string, string> = { 'ROBOWARS': 'RoboWars', 'ROBORACE': 'RoboRace', 'ROBOSOCCER': 'RoboSoccer' }
    return names[c] || c
  }).join(', ')
  
  const urgency = daysPending >= 5 ? 'URGENT' : 'Reminder'
  const bgColor = daysPending >= 5 ? '#dc2626, #b91c1c' : '#f97316, #f59e0b'
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, ${bgColor}); }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 40px 30px; }
    .reminder-box { background: ${daysPending >= 5 ? '#fef2f2' : '#fffbeb'}; border: 2px solid ${daysPending >= 5 ? '#fecaca' : '#fde68a'}; border-radius: 16px; padding: 25px; text-align: center; margin-bottom: 30px; }
    .amount-due { font-size: 36px; font-weight: bold; color: ${daysPending >= 5 ? '#dc2626' : '#d97706'}; margin: 15px 0; }
    .details-card { background: #f9fafb; border-radius: 12px; padding: 20px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .cta-button { display: inline-block; padding: 18px 50px; background: linear-gradient(135deg, ${bgColor}); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; margin: 25px 0; }
    .footer { text-align: center; padding: 30px; background: #f9fafb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ ${urgency}: Payment Pending</h1>
    </div>
    
    <div class="content">
      <div class="reminder-box">
        <p style="margin: 0; font-size: 16px;">Hi ${leaderName},</p>
        <p style="margin: 10px 0;">Your registration for <strong>${teamName}</strong> is incomplete.</p>
        <div class="amount-due">₹${totalAmount}</div>
        <p style="color: #6b7280; margin: 0;">Outstanding Balance</p>
      </div>
      
      <div class="details-card">
        <div class="detail-row">
          <span>Team</span>
          <strong>${teamName}</strong>
        </div>
        <div class="detail-row">
          <span>Competitions</span>
          <strong>${competitionNames}</strong>
        </div>
        <div class="detail-row">
          <span>Pending Since</span>
          <strong>${daysPending} day${daysPending > 1 ? 's' : ''}</strong>
        </div>
      </div>
      
      <div class="warning">
        <strong>⏰ Don't miss out!</strong> Complete your payment to secure your spot. Slots are limited and filling up fast!
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${APP_URL}/dashboard" class="cta-button">Pay Now →</a>
      </div>
    </div>
    
    <div class="footer">
      <p style="color: #6b7280; font-size: 14px;">Need help? Reply to this email</p>
      <p style="color: #9ca3af; font-size: 12px;">RoboMania 2025</p>
    </div>
  </div>
</body>
</html>
  `
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: leaderEmail,
      subject: `${daysPending >= 5 ? '🚨 URGENT' : '⏰ Reminder'}: Complete payment for ${teamName} - ₹${totalAmount} pending`,
      html
    })
    console.log(`✅ Payment reminder email sent to ${leaderEmail}`)
  } catch (error) {
    console.error('Failed to send payment reminder email:', error)
  }
}

// Legacy exports for backward compatibility
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Robomania 2025',
    html: `
      <h1>Welcome to Robomania 2025, ${name}!</h1>
      <p>Thank you for signing up. You can now register your team for the ultimate robot battle competition.</p>
      <p>Click <a href="${APP_URL}/team-register">here</a> to register your team.</p>
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
      <p>Please try again by visiting your <a href="${APP_URL}/registration/details">registration details</a>.</p>
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
      from: FROM_EMAIL,
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
      from: FROM_EMAIL,
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
      from: FROM_EMAIL,
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