const nodeMailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {
    try {
        
        const transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        transporter.verify((error, success) => {
            if (error) {
                console.error('Error in mail configuration:', error);
            } else {
                console.log('Mail configuration is ready to send messages');
            }
        });

        const sendMailInfo = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            html: body
        });

        // console.log('Email sent successfully:', sendMailInfo);
        return sendMailInfo;

    } catch (error) {

        console.error('Error sending email:', error);
        return {
            success: false,
            message: 'Failed to send email',
            error: error.message
        };
        
    }
};


module.exports = mailSender;