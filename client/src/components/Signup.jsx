import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup, verifyOTP} = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    portfolio: null,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "portfolio") {
      setFormData({ ...formData, portfolio: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("skills", formData.skills);
    if (formData.portfolio) {
      data.append("portfolio", formData.portfolio);
    }

    const signupSuccess = await signup(data); // 🚀 Ensure signup was successful before showing OTP form

    if (signupSuccess) {
      // ✅ Only show OTP if signup was successful
      setUserEmail(formData.email);
      setOtpSent(true);
    }
  };
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const success = await verifyOTP(otp);

    if (success) {
      navigate("/login");
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-100 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {otpSent ? "Verify OTP" : "Sign Up"}
        </h2>

        {!otpSent ? (
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
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              required
              value={formData.skills}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="file"
              name="portfolio"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleChange}
              className="p-3 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="mt-4 bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Sign Up
            </button>
          </form>
        ) : (
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
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="mt-4 bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

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

export default Signup;
