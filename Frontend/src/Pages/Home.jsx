import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

const ChatApp = ({ onLogout }) => {
  const navigate = useNavigate();
  const { socket, onlineUsers, sendMessage: socketSendMessage } = useSocket();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(`${apiBaseUrl}/api/v1/user/logout`, {}, {
        withCredentials: true,
      });
      if (onLogout) {
        onLogout();
      }
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch logged-in user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/v1/user/me`, {
          withCredentials: true,
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    fetchCurrentUser();
  }, [apiBaseUrl]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;
      
      try {
        const res = await axios.get(`${apiBaseUrl}/api/v1/user/users`, {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [currentUser, apiBaseUrl]);

  // Socket.IO real-time message handling
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (messageData) => {
        if (selectedUser && messageData.senderId === selectedUser._id) {
          setMessages(prevMessages => [...prevMessages, {
            sender: selectedUser.userName,
            content: messageData.message,
            createdAt: messageData.createdAt,
            senderID: messageData.senderId
          }]);
        }
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to fetch messages between current user and selected user
  const fetchMessages = useCallback(async () => {
    if (!selectedUser || !currentUser) return;
    
    try {
      const response = await axios.get(`${apiBaseUrl}/api/v1/message/${selectedUser._id}`, {
        withCredentials: true,
      });
      
      const transformedMessages = response.data.map(msg => ({
        sender: msg.senderID === currentUser._id ? currentUser.userName : selectedUser.userName,
        content: msg.message,
        createdAt: msg.createdAt,
        senderID: msg.senderID
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  }, [selectedUser, currentUser, apiBaseUrl]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      fetchMessages();
    }
  }, [selectedUser, currentUser, fetchMessages]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !currentUser || !selectedUser) return;
    
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/v1/message/send/${selectedUser._id}`,
        { message: newMsg },
        { withCredentials: true }
      );

      if (response.data.newMessage) {
        const newMessage = {
          sender: currentUser.userName,
          content: newMsg,
          createdAt: response.data.newMessage.createdAt,
          senderID: currentUser._id
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        socketSendMessage(selectedUser._id, newMsg);
        setNewMsg("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!currentUser) {
    return <div className="m-auto text-center text-gray-500">Loading user...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Modern classic design with smaller width on larger screens */}
      <div className={`w-full md:w-72 lg:w-80 xl:w-72 bg-white shadow-lg flex flex-col ${
        selectedUser ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {currentUser && (
                <img
                  src={currentUser.profilePic || "https://via.placeholder.com/36"}
                  alt={currentUser.fullname}
                  className="w-9 h-9 rounded-full mr-3 object-cover border-2 border-white/20"
                />
              )}
              <h2 className="text-lg font-semibold text-white">PVT MSG</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        
        
        {/* Current User Card */}
        {currentUser && (
          <div className="mx-3 mt-3 mb-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={currentUser.profilePic || "https://via.placeholder.com/40"}
                  alt={currentUser.fullname}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="font-medium text-gray-900 text-sm truncate">{currentUser.fullname}</div>
                <div className="text-xs text-blue-600 truncate">@{currentUser.userName}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <svg className="w-8 h-8 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            users
              .filter(user => user._id !== currentUser._id)
              .map(user => {
                const isOnline = onlineUsers.includes(user._id);
                const isSelected = selectedUser?._id === user._id;
                
                return (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center p-3 mx-2 my-1 cursor-pointer rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={user.profilePic || "https://via.placeholder.com/44"}
                        alt={user.fullname}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className={`font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {user.fullname}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2">
                          {isOnline ? "now" : "2m"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                          {isOnline ? "Online" : "Tap to start chatting"}
                        </p>
                        {isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Chat Area - Wider on larger screens with modern design */}
      <div className={`flex-1 flex flex-col ${
        selectedUser ? 'flex' : 'hidden md:flex'
      }`}>
        {selectedUser ? (
          <>
            {/* Mobile Chat Header */}
            <div className="md:hidden bg-gradient-to-r  text-black p-4 shadow-md">
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="mr-3 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center flex-1">
                  <img
                    src={selectedUser.profilePic || "https://via.placeholder.com/40"}
                    alt={selectedUser.fullname}
                    className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-black">{selectedUser.fullname}</h3>
                    <p className="text-xs text-black">
                      {onlineUsers.includes(selectedUser._id) ? "Online" : "Last seen recently"}
                    </p>
                  </div>
                </div>
               
              </div>
            </div>
            
            {/* Desktop Chat Header */}
            <div className="hidden md:flex border-b border-blue-800 p-4 shadow-lg">
              <div className="flex items-center flex-1">
                <div className="relative">
                  <img
                    src={selectedUser.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.fullname}`}
                    alt={selectedUser.fullname}
                    className="w-11 h-11 rounded-full object-cover bg-white/20 border-2 border-white/30"
                  />
                  {onlineUsers.includes(selectedUser._id) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-black">{selectedUser.fullname}</h3>
                  <p className="text-sm text-black">
                    {onlineUsers.includes(selectedUser._id) ? (
                      <span className="flex items-center text-green-300">
                        <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                        Online
                      </span>
                    ) : "Last seen recently"}
                  </p>
                </div>
              </div>
             
            </div>
            
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 bg-slate-50 space-y-3 md:space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 text-base md:text-lg mb-2 font-medium">No messages yet</p>
                  <p className="text-slate-500 text-sm md:text-base">Start a conversation with {selectedUser.fullname}!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === currentUser.userName ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[70%] px-3 md:px-4 py-2 md:py-3 rounded-2xl break-words shadow-sm transition-all duration-200 hover:shadow-md ${
                        msg.sender === currentUser.userName 
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white" 
                          : "bg-white text-slate-900 border border-slate-200"
                      }`}
                    >
                      <div className="leading-relaxed text-sm md:text-base">{msg.content}</div>
                      {msg.createdAt && (
                        <div className={`text-xs mt-2 ${
                          msg.sender === currentUser.userName ? "text-blue-100" : "text-slate-500"
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="bg-white border-t border-slate-200 p-3 md:p-4 lg:p-6 shadow-lg">
              <div className="flex gap-2 md:gap-4 items-end">
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-slate-300 rounded-full px-4 md:px-6 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm md:text-base bg-slate-50 hover:bg-white"
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMsg.trim()}
                  className={`p-2 md:p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                    newMsg.trim() 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg">
              <svg className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Welcome to Messages</h3>
            <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-md">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
