import { getUserProfile, loginUser, logout, registerUser, resendOTP, updateUserProfile, verifyOTP } from "../controllers/user.controller.js";
import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/profile",isAuthenticated , getUserProfile);

router.put("/profile", isAuthenticated, updateUserProfile);

export default router;