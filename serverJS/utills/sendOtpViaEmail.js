const mailSender = require("../config/MailSender");
const otpTemplate = require("./Templates/otpTemplate");

exports.sendOtpViaMail = async (email, otp) => {

    try {

        const mailResponse = await mailSender(
            email,
            "Your OTP Code",
            otpTemplate(otp)
        );

        // console.log("Email sent successfully:", mailResponse);
        return mailResponse;

    } catch (error) {
        console.error('Error in sendOtpViaMail:', error);
        return {
            success: false,
            message: 'Failed to send OTP via email',
            error: error.message
        };
    }
};