import Axios from "../lib/Axios";
import { create } from "zustand";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  emailForOTP: null, // Store email for OTP verification
  isVerifyingOTP: false, // Control OTP input UI
  isLoggedIn: false, // Track login status

  // Signup action
  signup: async (data) => {
    try {
      const isFileUpload = data instanceof FormData;
      const apiUrl = `${import.meta.env.VITE_BASE_API_URL}/auth/register`;

      console.log("Making request to:", apiUrl);
      const res = await Axios.post(apiUrl, data, {
        withCredentials: true,
        headers: isFileUpload ? { "Content-Type": "multipart/form-data" } : {},
      });

      set({ emailForOTP: data.get("email"), isVerifyingOTP: true });

      toast.success("Signup successful! Please verify your email with OTP.");
      return true; // ✅ Success
    } catch (error) {
      console.error("SignUp Error:", error.response?.data?.message);

      if (error.response?.status === 409) {
        toast.error(
          "This email is already in use. Please use a different one."
        );
      } else {
        toast.error(
          error.response?.data?.message || "Error while creating account"
        );
      }

      return false; // ❌ Prevent OTP from showing
    }
  },

  // Verify OTP action
  verifyOTP: async (otp) => {
    try {
      const { emailForOTP } = useAuthStore.getState();

      if (!emailForOTP) {
        toast.error("No email found for verification.");
        return false;
      }

      await Axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/verify-otp`, {
        email: emailForOTP,
        otp,
      });

      set({ isVerifyingOTP: false, emailForOTP: null });

      toast.success("Email verified successfully!");
      return true; // ✅ Indicate success
    } catch (error) {
      console.error("OTP Verification Error", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Invalid OTP");
      return false; // ❌ Indicate failure
    }
  },

  // Login action
  login: async (data, navigate) => {
    try {
      const res = await Axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/auth/login`,
        data,
        { withCredentials: true }
      );
      const { token, user } = res.data;

      if (token) {
        localStorage.setItem("token", token); // ✅ Store token for future requests
      }
      // Update state on successful login
      set({ authUser: res.data.user, isLoggedIn: true });

      toast.success("Login successful!");
      navigate("/"); // Redirect user after login

      return true; // ✅ Indicate success
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message);

      toast.error(error.response?.data?.message || "Invalid credentials");

      return false; // ❌ Indicate failure
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem("token"); // ✅ Remove token
    set({ authUser: null, isLoggedIn: false });
    toast.success("Logged out successfully!");
  },
}));


