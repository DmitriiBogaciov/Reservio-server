const brevo = require("sib-api-v3-sdk");
const defaultClient = brevo.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.Sendinblue_API_Key; 

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
