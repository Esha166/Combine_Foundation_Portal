import express from "express";
import { login, logout, changePassword, getMe, forgotPassword, verifyOTP, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validator.js";
import { loginValidator, changePasswordValidator } from "../validators/authValidator.js";
const authRoute = express.Router();

authRoute.post("/login", authLimiter, validate(loginValidator), login);
authRoute.get("/logout", logout);
authRoute.post("/change-password", protect, validate(changePasswordValidator), changePassword);
authRoute.get("/me", protect, getMe);

// Password reset routes
authRoute.post("/forgot-password", authLimiter, forgotPassword);
authRoute.post("/verify-otp", authLimiter, verifyOTP);
authRoute.post("/reset-password", authLimiter, resetPassword);

export default authRoute;
