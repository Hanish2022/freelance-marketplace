import { getUserProfile, loginUser, logout, registerUser, updateUserProfile, verifyOTP } from "../controllers/user.controller.js";
import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/profile",isAuthenticated , getUserProfile);

router.put("/profile", isAuthenticated, updateUserProfile);

export default router;