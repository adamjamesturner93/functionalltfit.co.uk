import { MailDataRequired } from '@sendgrid/mail';

export function formatAuthCodeEmail(email: string, authCode: string): MailDataRequired {
  return {
    to: email,
    from: 'noreply@thechronicyogini.com',
    subject: 'Your Functionally Fit Authentication Code',
    text: `Your Functionally Fit authentication code is: ${authCode}. This code will expire in 10 minutes. If you didn't request this code, please ignore this email and contact support if you have concerns about your account security.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Functionally Fit Authentication Code</title>
      </head>
      <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: hsl(207, 85%, 8%); background-color: hsl(220, 14%, 96%); margin: 0; padding: 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: hsl(0, 0%, 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 20px; text-align: center; background-color: hsl(225, 73%, 57%); background-image: linear-gradient(135deg, hsl(225, 73%, 57%), hsl(225, 73%, 47%));">
              <img src="https://functionallyfit.com/logo-white.png" alt="Functionally Fit" style="width: 180px; height: auto; margin-bottom: 8px;">
              <h1 style="color: hsl(0, 0%, 100%); margin: 0; font-size: 28px; font-weight: bold;">Authentication Code</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <p style="margin-bottom: 24px; font-size: 16px; color: hsl(207, 85%, 8%);">
                To complete your sign-in to Functionally Fit, please enter the following verification code:
              </p>
              <div style="background-color: hsl(225, 35%, 91%); border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: hsl(225, 73%, 57%); font-family: monospace;">
                  ${authCode}
                </div>
                <p style="margin: 16px 0 0 0; font-size: 14px; color: hsl(215, 14%, 34%);">
                  This code will expire in <strong>10 minutes</strong>
                </p>
              </div>
              <div style="padding: 16px; background-color: hsl(48, 96%, 89%); border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: hsl(45, 100%, 22%); font-weight: 500;">
                  🔒 Security Tip: Never share this code with anyone. Functionally Fit will never ask for this code outside of the app.
                </p>
              </div>
              <div style="text-align: center; margin-top: 32px;">
                <a href="https://functionallyfit.com" style="display: inline-block; padding: 14px 28px; background-color: hsl(225, 73%, 57%); color: hsl(0, 0%, 100%); text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Open Functionally Fit
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: hsl(225, 35%, 91%); padding: 24px; text-align: center;">
              <p style="margin: 0 0 16px 0; font-size: 14px; color: hsl(215, 14%, 34%);">
                If you didn't request this code, please ignore this email and
                <a href="mailto:tech@thechronicyogini.com" style="color: hsl(225, 73%, 57%); text-decoration: none; font-weight: 500;">contact support</a>
                if you have concerns about your account security.
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: hsl(215, 14%, 34%);">
                This is an automated message. Please do not reply.
              </p>
              <div style="border-top: 1px solid hsl(225, 35%, 85%); padding-top: 16px; margin-top: 16px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: hsl(215, 14%, 34%);">
                  &copy; 2024 Functionally Fit. All rights reserved.
                </p>
                <p style="margin: 0; font-size: 12px;">
                  <a href="https://functionallyfit.com/privacy" style="color: hsl(225, 73%, 57%); text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                  <a href="https://functionallyfit.com/terms" style="color: hsl(225, 73%, 57%); text-decoration: none; margin: 0 8px;">Terms of Service</a>
                </p>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}
