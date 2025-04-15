import Chat from "../models/Chat.js";
import ServiceRequest from "../models/ServiceRequest.js";

// Get chat by service request ID
export const getChatByServiceRequest = async (req, res) => {
  try {
    const { serviceRequestId } = req.params;
    
    // Check if service request exists
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }
    
    // Check if user is part of the service request
    if (
      serviceRequest.user.toString() !== req.user._id.toString() &&
      serviceRequest.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this chat",
      });
    }
    
    // Find or create chat
    let chat = await Chat.findOne({ serviceRequest: serviceRequestId })
      .populate("participants", "name email")
      .populate("messages.sender", "name email");
    
    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        serviceRequest: serviceRequestId,
        participants: [serviceRequest.user, serviceRequest.assignedTo].filter(Boolean),
      });
      
      // Populate the new chat
      chat = await Chat.findById(chat._id)
        .populate("participants", "name email")
        .populate("messages.sender", "name email");
    }
    
    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }
    
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }
    
    // Check if user is part of the chat
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to send messages in this chat",
      });
    }
    
    // Add message to chat
    chat.messages.push({
      sender: req.user._id,
      content,
    });
    
    chat.lastMessage = Date.now();
    await chat.save();
    
    // Get updated chat with populated fields
    const updatedChat = await Chat.findById(chatId)
      .populate("participants", "name email")
      .populate("messages.sender", "name email");
    
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      chat: updatedChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }
    
    // Check if user is part of the chat
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this chat",
      });
    }
    
    // Mark all messages from other users as read
    chat.messages.forEach(message => {
      if (message.sender.toString() !== req.user._id.toString()) {
        message.read = true;
      }
    });
    
    await chat.save();
    
    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's chats
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("serviceRequest", "title status")
      .populate("participants", "name email")
      .sort({ lastMessage: -1 });
    
    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 