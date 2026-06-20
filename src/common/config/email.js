
const sendEmail = async (to, subject, html) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: process.env.SMTP_FROM_NAME,
        email: process.env.SMTP_FROM_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API Error: ${error}`);
  }
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
