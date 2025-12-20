import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

// Controller - Register (send OTP and store registration data in session)
const register = asyncHandler(async (req, res) => {
	const { name, email, password, role } = req.body;
	if (!name || !email || !password || !role) {
		throw new ApiError(400, "name, email, password and role are required");
	}

	const existing = await User.findOne({ email });
	if (existing) throw new ApiError(409, "User with this email already exists");

	// generate OTP 
	const otp = Math.floor(100000 + Math.random() * 900000).toString();

	// store registration data in session (will be used by verify endpoint)
	req.session.registrationData = {
		name,
		email,
		password, // will be hashed by model pre-save when creating user
		role,
		otp,
		timestamp: Date.now(),
	};

	// ensure session is saved before sending response
	await new Promise((resolve, reject) => {
		req.session.save((err) => {
			if (err) return reject(err);
			resolve();
		});
	});

	// send OTP email
	try {
		await sendEmail({
			to: email,
			subject: "Otp Verification for registration",
			html: `<p>Hi ${name},</p>
				<p>Use the following OTP to complete your registration. It expires in 15 minutes.</p>
				<h2 style="letter-spacing:6px">${otp}</h2>`,
		});
	} catch (err) {
		console.error("register: failed to send OTP email:", err.message || err);
	}

	return res.status(200).json(new ApiResponse(200, { sessionId: req.session.id, email }, "OTP sent. Verify using /verify-otp to complete registration."));
});

// Verify OTP and create user
const verifyOtpAndRegister = asyncHandler(async (req, res) => {
	const { otp } = req.body;
	if (!otp) throw new ApiError(400, "otp is required");

	const registrationData = req.session && req.session.registrationData;
	if (!registrationData) throw new ApiError(400, "No registration in progress or session expired. Please register again.");

	// 15 minute expiry
	const age = Date.now() - (registrationData.timestamp || 0);
	if (age > 10 * 60 * 1000) {
		// destroy stale session data
		req.session.destroy(() => {});
		throw new ApiError(400, "OTP expired. Please register again.");
	}

	if (registrationData.otp !== otp) {
		throw new ApiError(400, "Invalid OTP");
	}

	// create user
	const { name, email, password, role } = registrationData;
	const user = await User.create({ name, email, password, role, isAccountVerified: true });

	// clear registration session data
	req.session.destroy((err) => {
		if (err) console.error("Failed to destroy session after registration:", err);
	});

	// respond with created user id and redirect hint
	return res.status(201).json(new ApiResponse(201, { userId: user._id, redirect: "/login" }, "Registration completed. Please login."));
});

// Controller - Login
const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) throw new ApiError(400, "email and password are required");

	const user = await User.findOne({ email });
	if (!user) throw new ApiError(401, "Invalid Email");

	const ok = await user.isPasswordCorrect(password);
	if (!ok) throw new ApiError(401, "Invalid Password");

	// generate tokens using model helpers
	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	const out = {
		user: { _id: user._id, name: user.name, email: user.email, role: user.role, isAccountVerified: user.isAccountVerified },
		tokens: { accessToken, refreshToken },
	};

	res.json(new ApiResponse(200, out, "Login successful"));
});

// send verification OTP (resend)

const sendVerification = asyncHandler(async (req, res) => {
	const { email } = req.body;
	if (!email) throw new ApiError(400, "email required");

	const user = await User.findOne({ email });
	if (!user) throw new ApiError(404, "User not found");

	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	user.verifyOtp = await bcrypt.hash(otp, 10);
	user.verifyOtpExpireAt = new Date(Date.now() + 5 * 60 * 1000);
	await user.save();

	try {
		await sendEmail({
			to: email,
			subject: "Your verification OTP",
			html: `<p>Your verification OTP is:</p><h2>${otp}</h2><p>Expires in 5 minutes.</p>`,
		});
	} catch (err) {
		console.error("sendVerification: email failed", err.message || err);
	}

	res.json(new ApiResponse(200, null, "Verification OTP sent if email exists"));
});


// Resend OTP during registration (using session)
const resendRegistrationOtp = asyncHandler(async (req, res) => {
	const registrationData = req.session && req.session.registrationData;

	if (!registrationData) {
		throw new ApiError(400, "No registration in progress or session expired. Please register again.");
	}

	const { name, email } = registrationData;

	// Generate a new OTP
	const otp = Math.floor(100000 + Math.random() * 900000).toString();

	// Update OTP and timestamp in session
	registrationData.otp = otp;
	registrationData.timestamp = Date.now();
	req.session.registrationData = registrationData;

	// Save session again
	await new Promise((resolve, reject) => {
		req.session.save((err) => (err ? reject(err) : resolve()));
	});

	// Send the new OTP email
	try {
		await sendEmail({
			to: email,
			subject: "Resend OTP - Complete Your Registration",
			html: `<p>Hi ${name},</p>
				   <p>Here is your new OTP to complete registration. It expires in 15 minutes.</p>
				   <h2 style="letter-spacing:6px">${otp}</h2>`,
		});
	} catch (err) {
		console.error("resendRegistrationOtp: failed to send OTP email:", err.message || err);
		throw new ApiError(500, "Failed to resend OTP. Try again later.");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, { sessionId: req.session.id, email }, "New OTP sent successfully."));
});

// verify account with OTP

const verifyAccount = asyncHandler(async (req, res) => {

	const { email, otp } = req.body;
	if (!email || !otp) throw new ApiError(400, "email and otp required");

	const user = await User.findOne({ email });
	if (!user) throw new ApiError(404, "User not found");

	if (!user.verifyOtp || !user.verifyOtpExpireAt) throw new ApiError(400, "No OTP pending verification");
	if (user.verifyOtpExpireAt.getTime() < Date.now()) throw new ApiError(400, "OTP expired");

	const match = await bcrypt.compare(otp, user.verifyOtp);
	if (!match) throw new ApiError(400, "Invalid OTP");

	user.isAccountVerified = true;
	user.verifyOtp = "";
	user.verifyOtpExpireAt = undefined;
	await user.save();

	res.json(new ApiResponse(200, { email: user.email }, "Account verified successfully"));
});

// Request password reset (sends OTP)

const requestPasswordReset = asyncHandler(async (req, res) => {
	const { email } = req.body;
	if (!email) throw new ApiError(400, "email required");

	const user = await User.findOne({ email });
	if (!user) throw new ApiError(404, "User not found");

	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	user.passwordResetOTP = await bcrypt.hash(otp, 10);
	user.passwordResetOTPExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
	await user.save();

	try {
		await sendEmail({
			to: email,
			subject: "Password reset code",
			html: `<p>Use this code to reset your password:</p><h2>${otp}</h2><p>Expires in 10 minutes.</p>`,
		});
	} catch (err) {
		console.error("requestPasswordReset: email error", err.message || err);
	}

	res.json(new ApiResponse(200, null, "Password reset OTP sent if the email exists"));
});

// Reset password using OTP

const resetPassword = asyncHandler(async (req, res) => {
	const { email, otp, newPassword } = req.body;
	if (!email || !otp || !newPassword) throw new ApiError(400, "email, otp and newPassword required");

	const user = await User.findOne({ email });
	if (!user) throw new ApiError(404, "User not found");

	if (!user.passwordResetOTP || !user.passwordResetOTPExpireAt) throw new ApiError(400, "No password reset requested");
	if (user.passwordResetOTPExpireAt.getTime() < Date.now()) throw new ApiError(400, "Password reset OTP expired");

	const match = await bcrypt.compare(otp, user.passwordResetOTP);
	if (!match) throw new ApiError(400, "Invalid OTP");

	user.password = newPassword; // pre-save hook will hash
	user.passwordResetOTP = "";
	user.passwordResetOTPExpireAt = undefined;
	await user.save();

	res.json(new ApiResponse(200, null, "Password reset successful"));
});

// Social auth placeholders (frontend should use proper OAuth flow)
const socialAuthRedirect = asyncHandler(async (req, res) => {
	// Providers: google, facebook, twitter
	const { provider } = req.params;
	res.json(new ApiResponse(200, null, `Use ${provider} OAuth on the frontend; configure server if you want server-side flow.`));
});

export {
	register,
	verifyOtpAndRegister,
	resendRegistrationOtp,
	login,
	sendVerification,
	verifyAccount,
	requestPasswordReset,
	resetPassword,
	socialAuthRedirect,
};
