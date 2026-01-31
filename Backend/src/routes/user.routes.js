import { Router } from "express";
import {
	register,
	login,
	sendVerification,
	verifyAccount,
	resendRegistrationOtp,
	requestPasswordReset,
	resetPassword,
	socialAuthRedirect,
	verifyOtpAndRegister,
	getCurrentUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtpAndRegister);
router.post("/login", login);
router.post("/send-verification", sendVerification);
router.post("/verify-account", verifyAccount);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendRegistrationOtp);

// social auth placeholders
router.get("/auth/:provider", socialAuthRedirect);

export default router;
