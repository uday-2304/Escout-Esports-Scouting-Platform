import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
      name: "Escout",
      email: process.env.SMTP_EMAIL || "satyateja1707@gmail.com"
    };
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Error sending email:", err);
    // Return error structure but also log it. 
    // The original controller expects a promise resolution or rejection? 
    // The original code returned 'info', if it failed it threw an error (transporter.sendMail throws).
    // The user's snippet returns { success: false, error: err.message }.
    // If I return a regular object on error, the controller might think it succeeded.
    // The controller uses try-catch around sendEmail:
    // try { await sendEmail(...) } catch (err) { console.error(...) }
    // If I return { success: false } it won't trigger the catch block in controller.
    // However, the controller logic (e.g. register) doesn't depend on the return value of sendEmail strictly for success, 
    // but it catches errors to log them.
    // If I throw here, it matches existing behavior better. 
    // BUT the user explicitly gave me code that returns { success: false }. 
    // I will stick to the user's code return style, but I should be aware.
    // userController.js: 
    // try { await sendEmail(...) } catch (err) { ... }
    // If the new sendEmail catches internally and returns object, 
    // the controller catch block won't activate. 
    // This is probably fine since the controller just logs the error anyway.
    return { success: false, error: err.message };
  }
};

