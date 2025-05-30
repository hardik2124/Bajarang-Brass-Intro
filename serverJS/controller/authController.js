const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpSchema = require("../models/otpSchema");
const otpGenerator = require("otp-generator");
const userSchema = require("../models/userSchema");
const validatCredentials = require("../utills/Validations");
const { sendOtpViaMail } = require("../utills/sendOtpViaEmail");
const { sendResetPasswordLink } = require("../utills/sendResetPasswordLinkViaEmail");
const { uploadImageToCloudinary } = require("../utills/imageUploader");

exports.SignUp = async (req, res) => {
    try {

        const { firstName, lastName, email, password, confirmPassword, phoneNumber, otp } = req.body;

        const requiredFields = {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            phoneNumber,
            otp
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            // console.log(key, value);
            if (!value) {
                return res.status(400).json({
                    success: false,
                    message: `${key} field is required`,
                });
            }
        }

        // console.log('Received data:', req.body);
        const { error, value } = validatCredentials.validate({ email, password, firstName }, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.reduce((acc, curr) => {
                acc[curr.context.key] = curr.message;
                return acc;
            }, {});
            return res.status(400).json({ success: false, errors: errorMessages });
        }


        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password do not match',
            });
        }

        if (await userSchema.findOne({ email })) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        const checkOTP = await otpSchema.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        if (!checkOTP || checkOTP.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userSchema({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            companyDetails: null
        });

        const savedUser = await newUser.save();
        // console.log('User saved successfully:', savedUser);

        const token = generateToken(savedUser);
        if (!token) {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate token',
            });
        }
        // console.log('Generated JWT token:', token);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            maxAge: 10 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                phoneNumber: savedUser.phoneNumber
            },
            token: token
        })


    } catch (error) {
        console.log('Error in SignUp:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

exports.LogIn = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and Password are required',
            });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            });
        }

        const token = generateToken(user);
        if (!token) {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate token',
            });
        }

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            maxAge: 10 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber
            },
            token: token
        });

    } catch (error) {
        console.log('Error in LogIn:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

exports.sendOtp = async (req, res) => {
    try {

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        if (await userSchema.findOne({ email })) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        };

        let otp;
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true,
            });
            console.log("Generated OTP:", otp);
        } while (await otpSchema.findOne({ otp: otp }));

        await otpSchema.create({
            email: email,
            otp: otp,
        });

        const response = await sendOtpViaMail(email, otp);

        if (!response) {
            console.error("Failed to send OTP email");
            return res.status(400).json({
                success: false,
                message: "something went wrong while sending otp mail !!",
            });
        }

        console.log("OTP sent successfully");
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: {
                email: email,
                otp: otp
            }
        });


    } catch (error) {
        console.log('Error in sendOtp:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

exports.LogOut = async (req, res) => {
    try {
        res.clearCookie('authToken');
        return res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });

    } catch (error) {
        console.log('Error in LogOut:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

exports.ResetPassword = async (req, res) => {
    try {

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        const existingUser = await userSchema.findOne({ email });
        if (!existingUser) {
            console.log('User not found for email:', email);
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const token = crypto.randomUUID().toString();

        await userSchema.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 15 * 60 * 1000,
            },
            {
                new: true,
            }
        );

        const url = `http://localhost:5000/reset-password/${token}`;

        await sendResetPasswordLink(email, url);

        return res.status(200).json({
            success: true,
            message: 'Reset password link sent successfully'

        });

    } catch (error) {
        console.log('Error in ResetPassword:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

exports.ChangePassword = async (req, res) => {
    try {

        const { oldpassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.userID;
        if (!oldpassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New Password and Confirm Password do not match',
            });
        }
        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const isOldPasswordValid = await bcrypt.compare(oldpassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid old password',
            });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });

    } catch (error) {
        console.log('Error in ChangePassword:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    };
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRATE,
        { expiresIn: "10d" }
    );
};



exports.clodinaryCheak = async (req, res) => {
    try {

        const thumbnailImage = req.files.thumbnailImage;
        const otherImages = req.files.otherImages;

        console.log('Received files:', thumbnailImage, otherImages);
        if (!thumbnailImage || !otherImages) {
            return res.status(400).json({
                success: false,
                message: 'Both thumbnailImage and otherImages are required',
            });
        }
        const otherImagesUrls = [];
        let imageUrl = await uploadImageToCloudinary(thumbnailImage, 'thumbnail');
        let url;
        if (Array.isArray(otherImages)) {
            for (const singleImage of otherImages) {
                url = await uploadImageToCloudinary(singleImage, 'otherImages');
                if (url) {
                    otherImagesUrls.push(url.secure_url);
                } else {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to upload one or more images to Cloudinary',
                    });
                }
            }
        } else {
            url = await uploadImageToCloudinary(otherImages, 'otherImages');
            if (url) {
                otherImagesUrls.push(url.secure_url);
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload image to Cloudinary',
                });
            }
        }



        return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            thumbnailImageUrl: imageUrl.secure_url,
            otherImagesUrls: otherImagesUrls
        });


    } catch (error) {
        console.log('Error in clodinaryCheak:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}