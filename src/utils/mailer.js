const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({ 
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    } 
});

const sendEmail = async ({to, subject, html}) => {
    try {
        console.log("Conectando a:", process.env.SMTP_HOST);
        console.log("Enviando correo a:", to);

        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            html
        });

        console.log("Mensaje enviado:", info.messageId);
        if (nodemailer.getTestMessageUrl) {
            console.log("Vista previa:", nodemailer.getTestMessageUrl(info));
        }
        return info;
    } catch (error) {
        console.error("Error al enviar correo:", error);
        throw error;
    }
}


module.exports = {
    sendEmail
}