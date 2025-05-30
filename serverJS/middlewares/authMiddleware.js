const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.Auth = async (req, res, next) => {
    try {

        let token = req.cookies?.token || req.header("Authorization")?.replace(/^Bearer\s+/i, "");

        if (!token) {
            return res.status(500).json({
                success: false,
                message: "No token provided",
            })
        }

        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRATE);
            // console.log(decode);
            req.user = decode;
            req.user.userID = decode.id;
            // console.log(req.user);
        } catch (e) {
            console.log("auth controller token is invalid", e.message);
            return res.status(401).json({
                success: false,
                message: "token is invalid",
            });
        }

        next();

    } catch (error) {
        console.log("auth middleware error", error.message);
        return res.status(500).json({
            message: "Authentication failed",
            error: error.message
        })
    }
};
