import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./database/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import skillExchangeRoutes from "./routes/skillExchangeRoutes.js"; // ✅ Added Skill Exchange Routes
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js"; // Added Service Request Routes
import chatRoutes from "./routes/chatRoutes.js"; // Added Chat Routes

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Reflects the request's origin
    credentials: true,
  })
);

// Enable file upload middleware (supports Cloudinary)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skill-exchange", skillExchangeRoutes); // ✅ Added Skill Exchange Routes
app.use("/api/service-request", serviceRequestRoutes); // Added Service Request Routes
app.use("/api/chat", chatRoutes); // Added Chat Routes

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  // Join a chat room
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });
  
  // Leave a chat room
  socket.on("leave_chat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat: ${chatId}`);
  });
  
  // Send a message
  socket.on("send_message", (data) => {
    io.to(data.chatId).emit("receive_message", data);
  });
  
  // Typing indicator
  socket.on("typing", (data) => {
    socket.to(data.chatId).emit("user_typing", data);
  });
  
  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 4040;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
