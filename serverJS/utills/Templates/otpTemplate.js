const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	
	</head>
	
	<body style="margin: 0; font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
    
    <!-- Header -->
    <div style="background-color: #0a7e07; padding: 20px 30px; text-align: center;">
      <img src="cid:logo" alt="Bajarang Brass Logo" style="height: 60px; margin-bottom: 10px;">
      <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Verify Your Email</h1>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333333;">Dear User,</p>

      <p style="font-size: 15px; color: #555555;">
        Welcome to <strong>Bajarang Brass</strong>! To secure your account, please use the OTP below to complete your verification process:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; letter-spacing: 6px; color: #0a7e07; font-weight: bold;">${otp}</span>
      </div>

      <p style="font-size: 14px; color: #666666;">
        This OTP is valid for <strong>5 minutes</strong>. If you did not initiate this request, you can safely ignore this email.
      </p>

      <p style="font-size: 14px; color: #666666; margin-top: 30px;">
        Thank you,<br>
        The Bajarang Brass Team
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #999999;">
      © 2025 Bajarang Brass. All rights reserved.
    </div>
  </div>
</body>

	
	</html>`;
};
module.exports = otpTemplate;
