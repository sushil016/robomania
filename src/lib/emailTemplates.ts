export const registrationEmailTemplate = ({
  teamName,
  leaderName,
}: {
  teamName: string
  leaderName: string
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #1a1a1a;
      color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #FF4500, #00CED1);
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .content {
      background-color: #2a2a2a;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .dates {
      background-color: #333333;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #FF4500, #00CED1);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #333333;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to RoboMania 2025!</h1>
    </div>
    
    <div class="content">
      <p>Dear ${leaderName},</p>
      <p>Thank you for registering Team "${teamName}" for RoboMania 2025! Your registration has been received and is currently under review.</p>
      
      <h2 style="color: #00CED1;">Next Steps:</h2>
      <ol>
        <li>Complete the safety documentation</li>
        <li>Submit your robot's technical specifications</li>
        <li>Await approval from our technical committee</li>
      </ol>
      
      <div class="dates">
        <h3>Important Dates:</h3>
        <p>🔧 Technical Review: February 1, 2025</p>
        <p>🛡️ Safety Inspection: March 10, 2025</p>
        <p>🤖 Event Day: March 12, 2025</p>
      </div>
      
      <a href="https://robomania2025.com/dashboard" class="button">
        View Your Dashboard
      </a>
    </div>
    
    <div class="footer">
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The RoboMania Team</p>
      <small>© 2024 RoboMania. All rights reserved.</small>
    </div>
  </div>
</body>
</html>
`

export const statusUpdateEmailTemplate = ({
  teamName,
  leaderName,
  status,
  message,
}: {
  teamName: string
  leaderName: string
  status: string
  message: string
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #1a1a1a;
      color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #FF4500, #00CED1);
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .content {
      background-color: #2a2a2a;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .status {
      background-color: #333333;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #FF4500, #00CED1);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #333333;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Status Update</h1>
    </div>
    
    <div class="content">
      <p>Dear ${leaderName},</p>
      <p>This is regarding Team "${teamName}"'s registration for RoboMania 2025.</p>
      
      <div class="status">
        <h3>Status: ${status}</h3>
        <p>${message}</p>
      </div>
      
      <a href="https://robomania2025.com/dashboard" class="button">
        View Details
      </a>
    </div>
    
    <div class="footer">
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The RoboMania Team</p>
      <small>© 2024 RoboMania. All rights reserved.</small>
    </div>
  </div>
</body>
</html>
`

export const eventUpdateEmailTemplate = ({
  teamName,
  leaderName,
  eventTitle,
  eventDetails,
  eventDate,
  actionRequired,
}: {
  teamName: string
  leaderName: string
  eventTitle: string
  eventDetails: string
  eventDate: string
  actionRequired?: string
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #1a1a1a;
      color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #FF4500, #00CED1);
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .content {
      background-color: #2a2a2a;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .event-details {
      background-color: #333333;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .action {
      background-color: #FF4500;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #FF4500, #00CED1);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #333333;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${eventTitle}</h1>
    </div>
    
    <div class="content">
      <p>Dear ${leaderName},</p>
      <p>We have an important update regarding RoboMania 2025 for Team "${teamName}".</p>
      
      <div class="event-details">
        <h3>Event Details:</h3>
        <p>${eventDetails}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
      </div>
      
      ${actionRequired ? `
        <div class="action">
          <h3>Action Required:</h3>
          <p>${actionRequired}</p>
        </div>
      ` : ''}
      
      <a href="https://robomania2025.com/events" class="button">
        View Event Details
      </a>
    </div>
    
    <div class="footer">
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The RoboMania Team</p>
      <small>© 2024 RoboMania. All rights reserved.</small>
    </div>
  </div>
</body>
</html>
`

export const adminEmailTemplate = ({
  adminName,
  subject,
  message,
}: {
  adminName: string;
  subject: string;
  message: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
      color: #333;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 10px;
      background-color: #007BFF;
      color: white;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      background-color: white;
      border-radius: 0 0 8px 8px;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${subject}</h1>
    </div>
    <div class="content">
      <p>Dear ${adminName},</p>
      <p>${message}</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact support.</p>
      <small>© 2024 Your Company. All rights reserved.</small>
    </div>
  </div>
</body>
</html>
`; 