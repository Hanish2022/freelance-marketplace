import { create } from "zustand";
import Axios from "../lib/Axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

// Create socket instance outside the store to ensure it's only created once
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4040", {
  withCredentials: true,
  autoConnect: false, // Don't connect automatically
});

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,
  socket: socket, // Initialize with the socket instance
  isConnected: false,
  typingUsers: {},

  // Initialize socket connection
  initializeSocket: () => {
    // No need to get socket from state since we're using the global instance
    const socket = get().socket;
    
    // Connect the socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }
    
    // Only set up event listeners if they haven't been set up yet
    if (!socket.hasListeners) {
      socket.hasListeners = true;
      
      socket.on("connect", () => {
        set({ isConnected: true });
        console.log("Socket connected");
      });
      
      socket.on("disconnect", () => {
        set({ isConnected: false });
        console.log("Socket disconnected");
      });
      
      socket.on("receive_message", (data) => {
        const { currentChat } = get();
        
        if (currentChat && currentChat._id === data.chatId) {
          set((state) => ({
            messages: [...state.messages, data.message],
          }));
        }
        
        // Update chat's last message
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat._id === data.chatId
              ? { ...chat, lastMessage: new Date() }
              : chat
          ),
        }));
      });
      
      socket.on("user_typing", (data) => {
        set((state) => ({
          typingUsers: {
            ...state.typingUsers,
            [data.chatId]: data.userId,
          },
        }));
        
        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          set((state) => ({
            typingUsers: {
              ...state.typingUsers,
              [data.chatId]: null,
            },
          }));
        }, 3000);
      });
    }
  },
  
  // Join a chat room
  joinChat: (chatId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected) {
      console.error("Socket not connected");
      // Try to connect if not connected
      if (!socket.connected) {
        socket.connect();
      }
      return;
    }
    
    socket.emit("join_chat", chatId);
  },
  
  // Leave a chat room
  leaveChat: (chatId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected) {
      console.error("Socket not connected");
      return;
    }
    
    socket.emit("leave_chat", chatId);
  },
  
  // Send a message
  sendMessage: async (chatId, content) => {
    try {
      const { socket, isConnected } = get();
      
      if (!isConnected) {
        console.error("Socket not connected");
        // Try to connect if not connected
        if (!socket.connected) {
          socket.connect();
        }
        return;
      }
      
      set({ isLoading: true, error: null });
      
      // Send message to server
      const response = await Axios.post(`/chat/${chatId}/messages`, { content });
      
      if (response.data.success) {
        const message = response.data.chat.messages[response.data.chat.messages.length - 1];
        
        // Emit message to socket
        socket.emit("send_message", {
          chatId,
          message,
        });
        
        // Update messages in state
        set((state) => ({
          messages: [...state.messages, message],
        }));
        
        // Update chat's last message
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat._id === chatId
              ? { ...chat, lastMessage: new Date() }
              : chat
          ),
        }));
        
        return message;
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      set({ error: error.message });
      toast.error("Failed to send message");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Mark messages as read
  markMessagesAsRead: async (chatId) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await Axios.put(`/chat/${chatId}/read`);
      
      if (response.data.success) {
        // Update messages in state
        set((state) => ({
          messages: state.messages.map((message) =>
            message.sender._id !== get().currentChat?.participants.find(
              (p) => p._id !== get().authUser?._id
            )?._id
              ? { ...message, read: true }
              : message
          ),
        }));
      } else {
        throw new Error(response.data.message || "Failed to mark messages as read");
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
      set({ error: error.message });
      toast.error("Failed to mark messages as read");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Get chat by service request ID
  getChatByServiceRequest: async (serviceRequestId) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await Axios.get(`/chat/service-request/${serviceRequestId}`);
      
      if (response.data.success) {
        set({
          currentChat: response.data.chat,
          messages: response.data.chat.messages,
        });
        
        // Join chat room
        get().joinChat(response.data.chat._id);
        
        return response.data.chat;
      } else {
        throw new Error(response.data.message || "Failed to get chat");
      }
    } catch (error) {
      console.error("Error getting chat:", error);
      set({ error: error.message });
      toast.error("Failed to get chat");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Get user's chats
  getUserChats: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await Axios.get("/chat/user");
      
      if (response.data.success) {
        set({ chats: response.data.chats });
        return response.data.chats;
      } else {
        throw new Error(response.data.message || "Failed to get chats");
      }
    } catch (error) {
      console.error("Error getting chats:", error);
      set({ error: error.message });
      toast.error("Failed to get chats");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Set typing indicator
  setTyping: (chatId, isTyping) => {
    const { socket, isConnected, authUser } = get();
    
    if (!isConnected || !authUser) {
      return;
    }
    
    socket.emit("typing", {
      chatId,
      userId: authUser._id,
      isTyping,
    });
  },
  
  // Clear current chat
  clearCurrentChat: () => {
    const { currentChat } = get();
    
    if (currentChat) {
      get().leaveChat(currentChat._id);
    }
    
    set({
      currentChat: null,
      messages: [],
      typingUsers: {},
    });
  },
})); 