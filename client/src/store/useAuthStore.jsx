import Axios from "../lib/Axios"; // Axios instance import kiya jo API requests handle karega
import { create } from "zustand"; // Zustand ka `create` function import kiya state management ke liye
import { toast } from "react-toastify"; // Notifications dikhane ke liye `react-toastify` ka use kiya

// Zustand store banaya jo authentication-related state aur functions handle karega
export const useAuthStore = create((set) => ({
  authUser: null, // Current logged-in user ka data store karega
  isCheckingAuth: true, // Authentication check ho raha hai ya nahi, ye track karega
  emailForOTP: null, // Email store karega jo OTP verification ke liye use hogi
  isVerifyingOTP: false, // UI control karega, agar OTP verify ho raha hai toh true hoga
  isLoggedIn: false, // User login hai ya nahi, ye track karega

  // 🔹 Signup function (User ko register karne ke liye)
  signup: async (data) => {
    try {
      const isFileUpload = data instanceof FormData; // Check kiya ki data file upload hai ya nahi
      const apiUrl = `${import.meta.env.VITE_BASE_API_URL}/auth/register`; // API endpoint ka URL generate kiya

      console.log("Making request to:", apiUrl);
      const res = await Axios.post(apiUrl, data, {
        withCredentials: true, // Credentials send karne ke liye
        headers: isFileUpload ? { "Content-Type": "multipart/form-data" } : {}, // Agar file upload ho rahi hai toh `Content-Type` set karega
      });

      set({ emailForOTP: data.get("email"), isVerifyingOTP: true }); // Email store ki aur OTP verification UI enable kiya

      toast.success("Signup successful! Please verify your email with OTP."); // Success message dikhaya
      return true; // ✅ Signup successful hua
    } catch (error) {
      console.error("SignUp Error:", error.response?.data?.message); // Error console pe print kiya

      if (error.response?.status === 409) {
        // Agar email already registered hai toh
        toast.error(
          "This email is already in use. Please use a different one."
        ); // Error message show kiya
      } else {
        toast.error(
          error.response?.data?.message || "Error while creating account"
        ); // General error message
      }

      return false; // ❌ Signup fail hua
    }
  },

  // 🔹 OTP Verification function
  verifyOTP: async (otp) => {
    try {
      const { emailForOTP } = useAuthStore.getState(); // Store se emailForOTP le raha hai

      if (!emailForOTP) {
        // Agar emailForOTP null hai toh error show karega
        toast.error("No email found for verification.");
        return false;
      }

      await Axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/verify-otp`, {
        email: emailForOTP, // Email bheji jo signup ke waqt store ki thi
        otp, // User ka enter kiya hua OTP bheja
      });

      set({ isVerifyingOTP: false, emailForOTP: null }); // OTP verification ke baad state reset kiya

      toast.success("Email verified successfully!"); // Success message dikhaya
      return true; // ✅ Verification successful hua
    } catch (error) {
      console.error("OTP Verification Error", error.response?.data?.message); // Error console pe print kiya
      toast.error(error.response?.data?.message || "Invalid OTP"); // Invalid OTP ka error dikhaya
      return false; // ❌ OTP verification fail hua
    }
  },

  // 🔹 Login function
  login: async (data, navigate) => {
    try {
      const res = await Axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/auth/login`, // Login API ka endpoint
        data, // User ka login data (email & password)
        { withCredentials: true } // Cookies aur credentials send kar raha hai
      );
      const { token, user } = res.data; // Response se token aur user data extract kiya

      if (token) {
        localStorage.setItem("token", token); // ✅ Token ko localStorage me save kiya
      }

      // State update ki, user login ho gaya
      set({ authUser: res.data.user, isLoggedIn: true });

      toast.success("Login successful!"); // Success message show kiya
      navigate("/"); // User ko home page pe redirect kiya

      return true; // ✅ Login successful
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message); // Error console pe print kiya

      toast.error(error.response?.data?.message || "Invalid credentials"); // Error message show kiya

      return false; // ❌ Login fail hua
    }
  },

  // 🔹 Logout function
  logout: () => {
    localStorage.removeItem("token"); // ✅ Token ko remove kiya
    set({ authUser: null, isLoggedIn: false }); // State reset ki (User logout ho gaya)
    toast.success("Logged out successfully!"); // Success message dikhaya
  },
}));
