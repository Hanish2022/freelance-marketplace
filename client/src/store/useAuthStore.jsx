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
  needsVerification: false,

  // Check if user is authenticated on app load
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ isCheckingAuth: false, isLoggedIn: false });
        return false;
      }

      // Set default authorization header for all requests
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Verify token by fetching user profile
      const response = await Axios.get(`${import.meta.env.VITE_BASE_API_URL}/auth/profile`);
      
      if (response.data && response.data.user) {
        set({ 
          authUser: response.data.user, 
          isLoggedIn: true, 
          isCheckingAuth: false 
        });
        return true;
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("token");
      delete Axios.defaults.headers.common["Authorization"];
      set({ 
        authUser: null, 
        isLoggedIn: false, 
        isCheckingAuth: false 
      });
      return false;
    }
  },

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

      // Store email for OTP verification
      const email = isFileUpload ? data.get("email") : data.email;
      set({ emailForOTP: email, isVerifyingOTP: true }); // Email store ki aur OTP verification UI enable kiya

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

      console.log("Verifying OTP for email:", emailForOTP);
      
      const response = await Axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/verify-otp`, {
        email: emailForOTP, // Email bheji jo signup ke waqt store ki thi
        otp, // User ka enter kiya hua OTP bheja
      });

      console.log("OTP verification response:", response.data);

      if (response.data && response.data.message === "Email verified successfully.") {
        set({ isVerifyingOTP: false, emailForOTP: null }); // OTP verification ke baad state reset kiya
        toast.success("Email verified successfully!"); // Success message dikhaya
        return true; // ✅ Verification successful hua
      } else {
        toast.error("Verification failed. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("OTP Verification Error", error.response?.data?.message); // Error console pe print kiya
      
      // More detailed error handling
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid OTP"); // Invalid OTP ka error dikhaya
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please sign up again.");
      } else {
        toast.error("Verification failed. Please try again.");
      }
      
      return false; // ❌ OTP verification fail hua
    }
  },

  // Resend OTP function
  resendOTP: async (email) => {
    try {
      const response = await Axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/resend-otp`, {
        email,
      });

      console.log("Resend OTP response:", response.data);
      
      if (response.data && response.data.message === "New OTP sent successfully.") {
        toast.success("New OTP sent successfully!");
        return true;
      } else {
        toast.error("Failed to resend OTP. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Resend OTP Error:", error.response?.data?.message);
      
      if (error.response?.status === 404) {
        toast.error("User not found. Please sign up again.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Email is already verified.");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
      
      return false;
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
        Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // State update ki, user login ho gaya
      set({ authUser: user, isLoggedIn: true, needsVerification: false });

      toast.success("Login successful!"); // Success message show kiya
      navigate("/"); // User ko home page pe redirect kiya

      return true; // ✅ Login successful
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message); // Error console pe print kiya

      // Handle unverified email case
      if (error.response?.status === 403 && error.response?.data?.needsVerification) {
        set({ 
          emailForOTP: error.response.data.email, 
          isVerifyingOTP: true,
          needsVerification: true
        });
        toast.error("Email not verified. Please verify your email.");
        return false;
      }

      toast.error(error.response?.data?.message || "Invalid credentials"); // Error message show kiya

      return false; // ❌ Login fail hua
    }
  },

  // 🔹 Logout function
  logout: () => {
    localStorage.removeItem("token"); // ✅ Token ko remove kiya
    delete Axios.defaults.headers.common["Authorization"];
    set({ authUser: null, isLoggedIn: false, needsVerification: false }); // State reset ki (User logout ho gaya)
    toast.success("Logged out successfully!"); // Success message dikhaya
  },
}));
