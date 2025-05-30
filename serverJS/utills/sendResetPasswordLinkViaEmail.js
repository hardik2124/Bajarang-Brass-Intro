const mailSender = require("../config/MailSender");
const resetPasswordTemplate = require("./Templates/resetPasswordLiknTemplate");


exports.sendResetPasswordLink = async (email, link) => {

    try {

        const mailResponse = await mailSender(
            email,
            "reset your password",
            resetPasswordTemplate(link)

        );

        // console.log("Email sent successfully:", mailResponse);
        return mailResponse;

    } catch (error) {
        console.error('Error in sendOtpViaMail:', error);
        return {
            success: false,
            message: 'Failed to send link via email',
            error: error.message
        };
    }
};