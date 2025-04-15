import express from "express";
import {
  getChatByServiceRequest,
  sendMessage,
  markMessagesAsRead,
  getUserChats,
} from "../controllers/chatController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Get chat by service request ID
router.get("/service-request/:serviceRequestId", isAuthenticated, getChatByServiceRequest);

// Send a message
router.post("/:chatId/messages", isAuthenticated, sendMessage);

// Mark messages as read
router.put("/:chatId/read", isAuthenticated, markMessagesAsRead);

// Get user's chats
router.get("/user", isAuthenticated, getUserChats);

export default router; 