import nodemailer from 'nodemailer'
import { formatPrice, formatDate } from '@/lib/utils/format'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function sendOrderConfirmationEmail(order: any) {
  try {
    const itemsHtml = order.order_items
      ?.map((item: any) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1e3345;color:#94a3b8;">${item.products?.name ?? 'Product'}</td>
          <td style="padding:8px 0;border-bottom:1px solid #1e3345;color:#94a3b8;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #1e3345;color:#e2e8f0;text-align:right;">${formatPrice(item.total_price)}</td>
        </tr>
      `)
      .join('') ?? ''

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Order Confirmed</title></head>
      <body style="background:#050b12;color:#e2e8f0;font-family:system-ui,sans-serif;margin:0;padding:0;">
        <div style="max-width:600px;margin:40px auto;background:#0a1520;border:1px solid rgba(26,169,189,0.2);border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,rgba(26,169,189,0.15),transparent);padding:32px;border-bottom:1px solid rgba(26,169,189,0.15);">
            <h1 style="margin:0;font-size:24px;color:#fff;">🎯 Order Confirmed</h1>
            <p style="margin:8px 0 0;color:#1aa9bd;font-size:14px;">C1ph3r Fsociety — Cybersecurity Hardware</p>
          </div>
          <!-- Body -->
          <div style="padding:32px;">
            <p style="color:#94a3b8;margin-bottom:24px;">
              Hi ${order.customer_name},<br><br>
              Your order has been confirmed and payment received. I'll process and ship it as soon as possible.
            </p>
            <p style="color:#1aa9bd;font-size:13px;font-weight:600;margin-bottom:4px;">ORDER NUMBER</p>
            <p style="color:#fff;font-family:monospace;font-size:18px;font-weight:700;margin:0 0 24px;">${order.order_number}</p>

            <!-- Items -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="border-bottom:1px solid rgba(26,169,189,0.2);">
                  <th style="text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;padding-bottom:8px;">Product</th>
                  <th style="text-align:center;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;padding-bottom:8px;">Qty</th>
                  <th style="text-align:right;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;padding-bottom:8px;">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div style="border-top:1px solid rgba(26,169,189,0.15);padding-top:16px;text-align:right;">
              <p style="color:#94a3b8;font-size:14px;margin:0;">Total: <strong style="color:#fff;font-size:18px;">${formatPrice(order.total)}</strong></p>
            </div>

            <!-- Shipping -->
            <div style="margin-top:24px;background:#0f1f2e;border-radius:12px;padding:16px;">
              <p style="color:#1aa9bd;font-size:12px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Shipping To</p>
              <p style="color:#94a3b8;font-size:13px;margin:0;line-height:1.6;">
                ${order.shipping_address.full_name}<br>
                ${order.shipping_address.line1}${order.shipping_address.line2 ? ', ' + order.shipping_address.line2 : ''}<br>
                ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}<br>
                ${order.shipping_address.country}
              </p>
            </div>

            <p style="color:#64748b;font-size:12px;margin-top:24px;line-height:1.6;">
              ⚠️ These products are for authorized ethical hacking, security research, and educational use only.
              You are solely responsible for compliance with all applicable laws.
            </p>
          </div>
          <!-- Footer -->
          <div style="padding:20px 32px;border-top:1px solid rgba(26,169,189,0.1);text-align:center;">
            <p style="color:#475569;font-size:12px;margin:0;">C1ph3r Fsociety · Delhi, India · rahulthegreat2001@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Email to customer
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      order.customer_email,
      subject: `Order Confirmed: ${order.order_number} — C1ph3r Fsociety`,
      html,
    })

    // Notify admin
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to:      process.env.EMAIL_ADMIN,
      subject: `[NEW ORDER] ${order.order_number} — ${formatPrice(order.total)}`,
      html: `<p>New order from ${order.customer_name} (${order.customer_email})</p><p>Total: ${formatPrice(order.total)}</p><p>Order: ${order.order_number}</p>`,
    })
  } catch (err) {
    console.error('Email error:', err)
  }
}
