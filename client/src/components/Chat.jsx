import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { format } from "date-fns";

const Chat = ({ serviceRequestId, onClose }) => {
  const {
    currentChat,
    messages,
    isLoading,
    error,
    initializeSocket,
    getChatByServiceRequest,
    sendMessage,
    markMessagesAsRead,
    setTyping,
    clearCurrentChat,
    typingUsers,
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // Initialize socket and get chat
  useEffect(() => {
    initializeSocket();
    getChatByServiceRequest(serviceRequestId);
    
    return () => {
      clearCurrentChat();
    };
  }, [serviceRequestId, initializeSocket, getChatByServiceRequest, clearCurrentChat]);
  
  // Mark messages as read when chat is loaded
  useEffect(() => {
    if (currentChat && messages.length > 0) {
      markMessagesAsRead(currentChat._id);
    }
  }, [currentChat, messages, markMessagesAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      setTyping(currentChat._id, true);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTyping(currentChat._id, false);
    }, 1000);
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    try {
      await sendMessage(currentChat._id, messageText);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => getChatByServiceRequest(serviceRequestId)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!currentChat) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-400">No chat available</p>
      </div>
    );
  }
  
  // Get the other participant
  const otherParticipant = currentChat.participants.find(
    (p) => p._id !== authUser._id
  );
  
  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
            {otherParticipant?.name?.charAt(0) || "U"}
          </div>
          <div className="ml-3">
            <h3 className="text-white font-medium">{otherParticipant?.name || "User"}</h3>
            <p className="text-xs text-gray-400">
              {typingUsers[currentChat._id] ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwnMessage = message.sender._id === authUser._id;
              
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                      isOwnMessage
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-700 text-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(message.timestamp), "h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-700">
        <div className="flex">
          <input
            type="text"
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-l-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 