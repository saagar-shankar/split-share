import nodemailer from "nodemailer";

// SMTP transporter — works with Mailtrap, Gmail, SendGrid, or any SMTP provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // Gmail + Port 587
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
    "Reset your password",
    `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  );
};

// const sendOrderConfirmationEmail = async (email, order) => {
//   const items = order.items
//     .map((i) => `<li>${i.title} x${i.quantity} — ₹${i.price}</li>`)
//     .join("");

//   await sendEmail(
//     email,
//     `Order Confirmed — ${order.orderNumber}`,
//     `<h2>Order Confirmed!</h2>
//      <p>Order: ${order.orderNumber}</p>
//      <ul>${items}</ul>
//      <p><strong>Total: ₹${order.totalAmount}</strong></p>`,
//   );
// };

export { sendVerificationEmail, sendResetPasswordEmail };
