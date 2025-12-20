import nodemailer from "nodemailer";

async function sendEmail({ to, subject, text, html }) {

  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

  const from = process.env.SMTP_EMAIL;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
}

export { sendEmail };
