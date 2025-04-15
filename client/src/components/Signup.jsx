import React, { useState } from "react"; // React aur useState ko import kar rahe hain
import { useAuthStore } from "../store/useAuthStore"; // Zustand store se authentication functions import kar rahe hain
import { useNavigate } from "react-router-dom"; // React Router ka navigate function import kar rahe hain
import { toast } from "react-toastify";

const Signup = () => {
  const { signup, verifyOTP, resendOTP, isVerifyingOTP, emailForOTP } = useAuthStore(); // Zustand store se signup, OTP verification, and resend OTP functions le rahe hain
  const navigate = useNavigate(); // navigate hook ko initialize kar rahe hain taaki page navigate kar sakein

  // Form ke liye state maintain karne ke liye useState hook ka use
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: "",
    portfolio: null,
  });

  const [otp, setOtp] = useState(""); // OTP input store karne ke liye state
  const [loading, setLoading] = useState(false); // Loading state maintain karne ke liye

  // Input fields handle karne ke liye function
  const handleChange = (e) => {
    if (e.target.name === "portfolio") {
      setFormData({ ...formData, portfolio: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Signup form submit hone par yeh function chalega
  const handleSubmit = async (e) => {
    e.preventDefault(); // Default form submit behavior ko rokna
    setLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      // Create FormData object
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("skills", formData.skills);
      if (formData.portfolio) {
        data.append("portfolio", formData.portfolio);
      }

      const success = await signup(data);
      if (success) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error during signup");
      setLoading(false);
    }
  };

  // OTP verify karne ka function
  const handleOTPSubmit = async (e) => {
    e.preventDefault(); // Default form submit behavior ko rokna
    setLoading(true);

    try {
      const success = await verifyOTP(otp);
      if (success) {
        navigate("/login"); // Agar OTP sahi ho toh user ko login page par bhej rahe hain
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!emailForOTP) {
      toast.error("No email found for OTP resend");
      return;
    }

    setLoading(true);
    try {
      await resendOTP(emailForOTP);
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  if (isVerifyingOTP) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-100 p-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Verify your email</h2>
          <p className="text-center text-gray-300 mb-6">
            Please enter the OTP sent to <span className="text-green-400">{emailForOTP}</span>
          </p>
          <form className="flex flex-col gap-4" onSubmit={handleOTPSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-green-500 hover:text-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend OTP
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-100 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create your account</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma-separated)"
            required
            value={formData.skills}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm">Portfolio (PDF, DOC, DOCX, JPG, PNG)</label>
            <input
              type="file"
              name="portfolio"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleChange}
              className="p-3 bg-gray-700 text-gray-100 rounded-lg focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-gray-900 hover:file:bg-green-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <span
            className="text-green-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup; // Component ko export kar rahe hain
