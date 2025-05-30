const express = require('express');
const router = express.Router();
const { SignUp, LogIn, sendOtp, LogOut, ResetPassword, ChangePassword, clodinaryCheak } = require("../controller/authController");
const { Auth } = require('../middlewares/authMiddleware');


router.post("/signup", SignUp);
router.post("/login", LogIn);
router.post("/sendotp", sendOtp);
router.post("/logout", LogOut);
router.post("/resetpassword", ResetPassword);
router.patch("/changepassword", Auth, ChangePassword);


router.post("/imagestest", clodinaryCheak);

module.exports = router;