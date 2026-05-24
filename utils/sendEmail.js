const sgMail = require('@sendgrid/mail');

/**
 * Sends an email using SendGrid mail service
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email plain text message
 * @param {string} [options.html] - Optional HTML template/body
 */
const sendEmail = async (options) => {
    // Configure SendGrid with API Key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: options.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@ecommerce.com', // Verified sender email in SendGrid
        subject: options.subject,
        text: options.message,
        html: options.html || `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">${options.message}</div>`
    };

    await sgMail.send(msg);
};

module.exports = sendEmail;
