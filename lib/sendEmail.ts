import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465, false for other ports (like 587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"NexMart" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Verify your NexMart account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#2563eb;">Welcome to NexMart, ${name}!</h2>
        <p>Please confirm your email address to activate your account.</p>
        <a href="${verifyUrl}"
           style="display:inline-block;margin-top:12px;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;">
          Verify Email
        </a>
        <p style="margin-top:16px;color:#6b7280;font-size:13px;">
          This link expires in 24 hours. If you didn't create this account, you can ignore this email.
        </p>
      </div>
    `,
  });
}
