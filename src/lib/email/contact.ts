import { Resend } from 'resend'

const ADMIN_EMAIL = process.env.EMAIL_ADMIN ?? 'rahulthegreat2001@gmail.com'
const FROM        = process.env.EMAIL_FROM  ?? 'C1ph3r Fsociety <noreply@c1ph3rfsocitey.com>'

export async function sendContactNotification(data: {
  name: string
  email: string
  inquiry_type: string
  subject: string
  message: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email notification.')
    return
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    // Notification to you
    await resend.emails.send({
      from:     FROM,
      to:       ADMIN_EMAIL,
      reply_to: data.email,
      subject:  `[Contact: ${data.inquiry_type}] ${data.subject}`,
      html: `
        <div style="font-family:system-ui,sans-serif;background:#050b12;color:#e2e8f0;padding:32px;border-radius:12px;max-width:600px;">
          <h2 style="color:#1aa9bd;margin-top:0;">New Contact Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color:#1aa9bd;">${data.email}</a></p>
          <p><strong>Type:</strong> ${data.inquiry_type}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border:none;border-top:1px solid rgba(26,169,189,0.2);margin:20px 0;"/>
          <p style="white-space:pre-wrap;color:#94a3b8;line-height:1.7;">${data.message}</p>
        </div>
      `,
    })

    // Auto-reply to sender
    await resend.emails.send({
      from:    FROM,
      to:      data.email,
      subject: 'Message received — C1ph3r Fsociety',
      html: `
        <div style="font-family:system-ui,sans-serif;background:#050b12;color:#e2e8f0;padding:32px;border-radius:12px;max-width:600px;">
          <h2 style="color:#1aa9bd;margin-top:0;">Thanks for reaching out!</h2>
          <p>Hi ${data.name},</p>
          <p>I've received your message about "<strong>${data.subject}</strong>" and will get back to you within 24–48 hours.</p>
          <br/>
          <p style="color:#64748b;font-size:14px;">— Rahul Thareja, C1ph3r Fsociety</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Contact email error:', err)
  }
}
