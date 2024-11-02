import { MailDataRequired } from "@sendgrid/mail";

export function formatAuthCodeEmail(
  email: string,
  authCode: string
): MailDataRequired {
  return {
    to: email,
    from: "noreply@thechronicyogini.com",
    subject: "Your FunctionallyFit Authentication Code",
    text: `Your FunctionallyFit authentication code is: ${authCode}. If you didn't request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FunctionallyFit Authentication Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: hsl(207, 85%, 8%); background-color: hsl(220, 14%, 96%); margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: hsl(0, 0%, 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 20px; text-align: center; background-color: hsl(225, 73%, 57%);">
              <h1 style="color: hsl(0, 0%, 100%); margin: 0; font-size: 28px; font-weight: bold;">FunctionallyFit</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 20px;">
              <h2 style="color: hsl(300, 100%, 27%); margin-bottom: 20px; font-size: 24px;">Your Authentication Code</h2>
              <p style="margin-bottom: 20px; font-size: 16px;">Here's your authentication code to access FunctionallyFit:</p>
              <div style="background-color: hsl(225, 35%, 91%); border-radius: 8px; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin-bottom: 20px; color: hsl(225, 73%, 57%);">
                ${authCode}
              </div>
              <p style="margin-bottom: 20px; font-size: 16px;">This code will expire in 10 minutes for security reasons. Please enter it on the login page to complete your authentication.</p>
              <p style="margin-bottom: 20px; font-weight: bold; font-size: 16px; color: hsl(3, 76%, 51%);">If you didn't request this code, please ignore this email.</p>
              <div style="text-align: center; margin-top: 40px;">
                <a href="https://functionallyfitapp.com" style="display: inline-block; padding: 12px 24px; background-color: hsl(36, 98%, 50%); color: hsl(207, 85%, 8%); text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Visit FunctionallyFit</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: hsl(225, 35%, 91%); padding: 20px; text-align: center;">
              <p style="font-size: 14px; color: hsl(215, 14%, 34%); margin-bottom: 10px;">
                This is an automated message from FunctionallyFit. Please do not reply to this email.
              </p>
              <p style="font-size: 14px; color: hsl(215, 14%, 34%); margin-bottom: 10px;">
                &copy; 2024 FunctionallyFit. All rights reserved.
              </p>
              <p style="font-size: 14px; color: hsl(215, 14%, 34%);">
                <a href="https://functionallyfitapp.com/privacy" style="color: hsl(225, 73%, 57%); text-decoration: none;">Privacy Policy</a> | 
                <a href="https://functionallyfitapp.com/terms" style="color: hsl(225, 73%, 57%); text-decoration: none;">Terms of Service</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}
