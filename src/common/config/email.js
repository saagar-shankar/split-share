import nodemailer from "nodemailer";

// testing for SMTP failure
console.log("SMTP HOST:", process.env.SMTP_HOST);
console.log("SMTP PORT:", process.env.SMTP_PORT);
console.log("SMTP USER:", process.env.SMTP_USER);

// SMTP transporter — works with Mailtrap, Gmail, SendGrid, or any SMTP provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  // port: Number(process.env.SMTP_PORT) || 587,
  // port: Number(process.env.SMTP_PORT) || 465,
  port: Number(process.env.SMTP_PORT) || 2525,
  secure: false, // Gmail + Port 587
  // secure: true, // Gmail + Port 587 20-june
  family: 4, //updated on 19-june-2026
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail(
    email,
    "Verify Your Split Share Account",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h1 style="color: #556893;">Split Share</h1>

      <h2>Welcome aboard! 🎉</h2>

      <p>
        Thanks for signing up for Split Share. To activate your account and start
        managing group expenses, please verify your email address.
      </p>

      <div style="margin: 30px 0;">
        <a
          href="${url}"
          style="
            background-color: #445780;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            display: inline-block;
          "
        >
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn't work, copy and paste this URL into your browser:
      </p>

      <p>${url}</p>

      <hr />

      <p style="color: #666;">
        This verification link will expire in 24 hours.
      </p>

      <p style="color: #666;">
        If you didn't create this account, you can safely ignore this email.
      </p>
    </div>
    `,
  );
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await sendEmail(
    email,
    "Reset Your Split Share Password",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h1 style="color: #556893;">Split Share</h1>

      <h2>Password Reset Request</h2>

      <p>
        We received a request to reset the password for your Split Share account.
      </p>

      <p>
        Click the button below to create a new password:
      </p>

      <div style="margin: 30px 0;">
        <a
          href="${url}"
          style="
            background-color: #445780;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            display: inline-block;
          "
        >
          Reset Password
        </a>
      </div>

      <p>
        If the button doesn't work, copy and paste this URL into your browser:
      </p>

      <p>${url}</p>

      <hr />

      <p style="color: #666;">
        This password reset link will expire in 15 minutes.
      </p>

      <p style="color: #666;">
        If you didn't request a password reset, you can safely ignore this email.
        Your password will remain unchanged.
      </p>
    </div>
    `,
  );
};

export { sendVerificationEmail, sendResetPasswordEmail };

// Previous Send Reset Password Email Service commented on 19-june-2026

// const sendResetPasswordEmail = async (email, token) => {
//   const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
//   await sendEmail(
//     email,
//     "Reset your password",
//     `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
//   );
// };
