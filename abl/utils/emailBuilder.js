const brevo = require("sib-api-v3-sdk");
const defaultClient = brevo.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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'; 

const apiInstance = new brevo.TransactionalEmailsApi();

async function sendEmail(to, subject, htmlContent) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: 'Dmitrii', email: 'dimon.989843@gmail.com' }; 
    sendSmtpEmail.to = [{ email: to, name: to }]; 

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;
