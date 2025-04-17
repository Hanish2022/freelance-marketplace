import React, { useState } from "react"; // React aur useState hook ko import kar rahe hain state management ke liye
import { useAuthStore } from "../store/useAuthStore"; // Auth store se login function use karne ke liye import kar rahe hain
import { useNavigate } from "react-router-dom"; // Navigation handle karne ke liye useNavigate hook import kar rahe hain

const Login = () => {
  const { login } = useAuthStore(); // useAuthStore() hook se login function ko access kar rahe hain
  const navigate = useNavigate(); // navigate function ko initialize kar rahe hain navigation ke liye
  const [formData, setFormData] = useState({ email: "", password: "" }); // formData state bana rahe hain user ke email aur password ke liye
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    // Jab bhi user input field me value type karega, state update hogi
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Form submit hone par page reload hone se rok raha hai
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Attempting login with:", formData.email);
      const success = await login(formData, navigate); // login function call kar rahe hain backend authentication ke liye
      
      if (!success) {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-100 p-6">
      {/* Ye container pura screen cover karega aur center aligned hoga */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Login form ka card-like UI */}
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 text-white rounded-lg">
            {error}
          </div>
        )}
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Form ke andar email aur password ke input fields hain */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="mt-4 bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-green-500 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")} // Agar user ke paas account nahi hai to signup page par navigate karega
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login; // Component ko export kar rahe hain taaki baaki application me use ho sake
