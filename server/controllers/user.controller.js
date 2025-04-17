import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

// Helper function to send OTP email
const sendOTPEmail = async (email, otpCode) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your Email",
    text: `Your OTP is: ${otpCode}`,
  };

  await transporter.sendMail(mailOptions);
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;

    // 🔹 Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({
          message:
            "This email is already registered. Please use a different email.",
        });
    }

    // Check if a portfolio file is included
    const file = req.files && req.files.portfolio;
    let portfolioUrls = [];
    if (file) {
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      portfolioUrls.push(result.secure_url);
    }
    
    // Create new user with pending status
    const newUser = new User({
      name,
      email,
      password, // The model's pre-save hook will hash this password
      skills: Array.isArray(skills) ? skills : [skills],
      portfolio: portfolioUrls,
      registrationStatus: 'pending',
      isVerified: false
    });
    
    // Generate OTP
    const otpCode = newUser.generateOTP();
    
    // Save user
    await newUser.save();

    // Send OTP email
    await sendOTPEmail(email, otpCode);

    res
      .status(201)
      .json({
        message:
          "Registration successful. Please check your email for OTP verification.",
      });
  } catch (error) {
    console.error("Error during registration:", error);

    // Return detailed error message
    res
      .status(500)
      .json({
        message: error.message || "Registration failed due to a server error.",
      });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    
    // Check if user exists and OTP is valid
    if (user && user.otp && user.otp.code === otp) {
      // Check if OTP has expired
      if (user.otp.expiresAt && new Date() > user.otp.expiresAt) {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }
      
      // Update user status
      user.isVerified = true;
      user.registrationStatus = 'verified';
      user.otp = undefined; // Clear OTP after verification
      await user.save();
      
      return res.status(200).json({ message: "Email verified successfully." });
    }
    res.status(400).json({ message: "Invalid OTP." });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Verification failed." });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }
    
    // Generate new OTP
    const otpCode = user.generateOTP();
    await user.save();
    
    // Send new OTP email
    await sendOTPEmail(email, otpCode);
    
    return res.status(200).json({ message: "New OTP sent successfully." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    // Find the user by email and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(`User found: ${user.name}, isVerified: ${user.isVerified}`);

    // Use the model's comparePassword method
    const isMatch = await user.comparePassword(password);
    console.log(`Password match: ${isMatch}`);
    
    if (!isMatch) {
      console.log(`Password mismatch for user: ${user.name}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      console.log(`User not verified: ${user.name}`);
      return res.status(403).json({ 
        message: "Email is not verified",
        needsVerification: true,
        email: user.email
      });
    }

    // Create the payload for the token
    const payload = { _id: user._id, email: user.email };

    // Generate the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return user data (excluding sensitive information) along with the token
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      skills: user.skills,
      isVerified: user.isVerified
    };

    console.log(`Login successful for user: ${user.name}`);
    res.status(200).json({ 
      success: true,
      message: "Login successful",
      token,
      user: userData
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Login failed",
      error: error.message 
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("logout error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

// controllers/userController.js

// ... (your previous exports: registerUser, verifyOTP, loginUser)

export const getUserProfile = async (req, res) => {
  try {
    // req.user is now the complete user object from the middleware
    const user = await User.findById(req.user._id).select("-password -otp");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    // We'll allow updates to name, skills, bio, location, and portfolio
    const updates = {
      name: req.body.name,
      skills: req.body.skills,
      bio: req.body.bio,
      location: req.body.location,
      portfolio: req.body.portfolio,
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password -otp");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user, message: "Profile updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
