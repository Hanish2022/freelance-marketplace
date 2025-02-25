import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skills: Array.isArray(skills) ? skills : [skills],
      portfolio: portfolioUrls,
      otp,
    });

    await newUser.save();

    // Send OTP email
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
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

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
    if (user && user.otp === otp) {
      user.isVerified = true;
      user.otp = undefined; // Clear OTP after verification
      await user.save();
      return res.status(200).json({ message: "Email verified successfully." });
    }
    res.status(400).json({ message: "Invalid OTP." });
  } catch (error) {
    res.status(500).json({ message: "Verification failed." });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Optionally, ensure the user's email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email is not verified" });
    }

    // Create the payload for the token
    const payload = { userId: user._id, email: user.email };

    // Generate the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
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
    // req.user contains payload from the token (e.g., userId and email)
    const user = await User.findById(req.user.userId).select("-password -otp");
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
    // We'll allow updates to name and skills for example.
    const updates = {
      name: req.body.name,
      skills: req.body.skills,
      // add any additional fields that you allow updates for
    };

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
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
