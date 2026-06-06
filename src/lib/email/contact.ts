import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function sendContactNotification(data: {
  name: string
  email: string
  inquiry_type: string
  subject: string
  message: string
}) {
  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      process.env.EMAIL_ADMIN,
      subject: `[Contact: ${data.inquiry_type}] ${data.subject}`,
      html: `
        <div style="font-family:system-ui,sans-serif;background:#050b12;color:#e2e8f0;padding:32px;border-radius:12px;max-width:600px;">
          <h2 style="color:#1aa9bd;">New Contact Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Type:</strong> ${data.inquiry_type}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border-color:rgba(26,169,189,0.15);"/>
          <p style="white-space:pre-wrap;color:#94a3b8;">${data.message}</p>
        </div>
      `,
      replyTo: data.email,
    })

    // Auto-reply to sender
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      data.email,
      subject: 'Message received — C1ph3r Fsociety',
      html: `
        <div style="font-family:system-ui,sans-serif;background:#050b12;color:#e2e8f0;padding:32px;border-radius:12px;max-width:600px;">
          <h2 style="color:#1aa9bd;">Thanks for reaching out!</h2>
          <p>Hi ${data.name},</p>
          <p>I've received your message about "<strong>${data.subject}</strong>" and will get back to you within 24–48 hours.</p>
          <p style="color:#64748b;font-size:14px;">— Rahul Thareja, C1ph3r Fsociety</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Contact email error:', err)
  }
}
