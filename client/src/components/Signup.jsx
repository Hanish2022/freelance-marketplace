import React, { useState } from "react"; // React aur useState ko import kar rahe hain
import { useAuthStore } from "../store/useAuthStore"; // Zustand store se authentication functions import kar rahe hain
import { useNavigate } from "react-router-dom"; // React Router ka navigate function import kar rahe hain

const Signup = () => {
  const { signup, verifyOTP } = useAuthStore(); // Zustand store se signup aur OTP verification functions le rahe hain
  const navigate = useNavigate(); // navigate hook ko initialize kar rahe hain taaki page navigate kar sakein

  // Form ke liye state maintain karne ke liye useState hook ka use
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    portfolio: null, // Portfolio file store karne ke liye
  });

  const [otpSent, setOtpSent] = useState(false); // OTP screen dikhana ya signup form control karne ke liye state
  const [otp, setOtp] = useState(""); // OTP input store karne ke liye state
  const [userEmail, setUserEmail] = useState(""); // User ka email OTP message dikhane ke liye

  // Input fields handle karne ke liye function
  const handleChange = (e) => {
    if (e.target.name === "portfolio") {
      setFormData({ ...formData, portfolio: e.target.files[0] }); // Agar portfolio file ho toh usse alag se handle karein
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value }); // Baaki input fields ko update karein
    }
  };

  // Signup form submit hone par yeh function chalega
  const handleSubmit = async (e) => {
    e.preventDefault(); // Default form submit behavior ko rokna

    // FormData object banakar data append kar rahe hain
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("skills", formData.skills);
    if (formData.portfolio) {
      data.append("portfolio", formData.portfolio); // Portfolio file bhi bhej rahe hain agar di gayi ho
    }

    const signupSuccess = await signup(data); // Signup function call kar rahe hain

    if (signupSuccess) {
      // Agar signup successful ho gaya toh OTP screen dikhana shuru karenge
      setUserEmail(formData.email);
      setOtpSent(true);
    }
  };

  // OTP verify karne ka function
  const handleOtpSubmit = async (e) => {
    e.preventDefault(); // Default form submit behavior ko rokna
    const success = await verifyOTP(otp); // verifyOTP function call kar rahe hain

    if (success) {
      navigate("/login"); // Agar OTP sahi ho toh user ko login page par bhej rahe hain
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-100 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {otpSent ? "Verify OTP" : "Sign Up"}{" "}
          {/* Agar OTP bheja gaya hai toh "Verify OTP" dikhaye, nahi toh "Sign Up" */}
        </h2>

        {!otpSent ? ( // Agar OTP nahi bheja gaya toh signup form dikhaye
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange} // Name change hone par state update karega
              className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange} // Email input handle karega
              className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange} // Password input handle karega
              className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              required
              value={formData.skills}
              onChange={handleChange} // Skills input handle karega
              className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="file"
              name="portfolio"
              accept=".pdf,.doc,.docx,.jpg,.png" // Sirf allowed file formats accept karega
              onChange={handleChange} // Portfolio file change hone par handle karega
              className="p-3 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="mt-4 bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Sign Up {/* Signup button */}
            </button>
          </form>
        ) : (
          // OTP form agar signup ho gaya ho
          <form className="flex flex-col gap-4" onSubmit={handleOtpSubmit}>
            <p className="text-center text-gray-300">
              We have sent an OTP to{" "}
              <span className="text-green-400">{userEmail}</span>. Please enter
              it below to verify.
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)} // OTP input handle karega
              className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="mt-4 bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Verify OTP {/* OTP verify button */}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <span
            className="text-green-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")} // Login page par le jaane ke liye
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup; // Component ko export kar rahe hain
