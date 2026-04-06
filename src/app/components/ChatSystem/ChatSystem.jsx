// src/app/components/ChatSystem/ChatSystem.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/app/contexts/ChatContext";
import webRTCService from "@/app/services/webrtcService";
// import {
//   FiCheckCircle,
//   FiInfo,
//   FiLogOut,
//   FiMonitor,
//   FiMoreVertical,
//   FiPaperclip,
//   FiPhone,
//   FiSearch,
//   FiSend,
//   FiSettings,
//   FiSmile,
//   FiUsers,
//   FiVideo,
//   FiVideoOff,
//   FiMic,
//   FiMicOff,
//   FiMonitorOff,
// } from "react-icons/fi";
import { FiCheckCircle, FiInfo, FiLogOut, FiMic, FiMicOff, FiMonitor, FiMoreVertical, FiPaperclip, FiPhone, FiSearch, FiSend, FiSettings, FiSmile, FiUsers, FiVideo, FiVideoOff, } from "react-icons/fi";


export default function ChatSystem() {
  const {
    state,
    selectRoom,
    selectChatUser,
    sendMessage,
    sendTyping,
    initiateCall,
    answerCall,
    endCall,
    startMeeting,
    leaveMeeting,
    startScreenShare,
    stopScreenShare,
    toggleAudio,
    toggleVideo,
    logout,
    createRoom,
    fetchUsers,
  } = useChat();
  const [activeTab, setActiveTab] = useState("chats");
  const [message, setMessage] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [callType, setCallType] = useState("video");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hideHeader, setHideHeader] = useState(false); // New state to control header visibility
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [users, setUsers] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    try {
      const fetchUserData = async () => {
        const res = await fetch("http://localhost:8000/chat-users");
        const data = await res.json();
        if (data.success) {
          // Assuming the API returns an array of users
          //console.log("Fetched users:", data.data);
          setUsers(data.data);
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      };
      fetchUserData();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  useEffect(() => {
    // Set local video stream
    if (localVideoRef.current && state.activeCall) {
      const localStream = webRTCService.getLocalStream();
      localVideoRef.current.srcObject = localStream;
    }
  }, [state.activeCall]);

  useEffect(() => {
    // Set remote video stream
    if (remoteVideoRef.current && state.activeCall) {
      const remoteStream = webRTCService.getRemoteStream(
        state.activeCall.userId
      );
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [state.activeCall]);

  const handleSendMessage = () => {
    if (message.trim() && (state.currentRoom || state.currentChatUser)) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleTyping = () => {
    sendTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 1000);
  };

  const handleInitiateCall = (userId, type) => {
    setCallType(type);
    initiateCall(userId, type);
    setShowCallModal(true);
  };

  const handleAnswerCall = (accept) => {
    answerCall(accept);
    if (accept) {
      setShowCallModal(true);
    }
  };

  const handleEndCall = () => {
    endCall();
    setShowCallModal(false);
  };

  const handleStartMeeting = (roomId) => {
    startMeeting(roomId);
    setShowMeetingModal(true);
  };

  const handleLeaveMeeting = () => {
    leaveMeeting();
    setShowMeetingModal(false);
  };

  const handleStartScreenShare = async () => {
    try {
      await startScreenShare();
      setIsScreenSharing(true);
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  const handleStopScreenShare = async () => {
    try {
      await stopScreenShare();
      setIsScreenSharing(false);
    } catch (error) {
      console.error("Error stopping screen share:", error);
    }
  };

  const handleToggleAudio = () => {
    const newEnabled = !isAudioEnabled;
    setIsAudioEnabled(newEnabled);
    toggleAudio(newEnabled);
  };

  const handleToggleVideo = () => {
    const newEnabled = !isVideoEnabled;
    setIsVideoEnabled(newEnabled);
    toggleVideo(newEnabled);
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const isUserOnline = (userId) => {
    return state.onlineUsers.includes(userId);
  };

  const isUserTyping = (userId) => {
    return state.typingUsers[userId] || false;
  };

  const getChatName = () => {
    if (state.currentRoom) {
      return state.currentRoom.name;
    } else if (state.currentChatUser) {
      return state.currentChatUser.name;
    }
    return "Unknown";
  };

  const getChatAvatar = () => {
    if (state.currentRoom) {
      return state.currentRoom.name.substring(0, 2).toUpperCase();
    } else if (state.currentChatUser) {
      return state.currentChatUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "??";
  };

  const isChatOnline = () => {
    if (state.currentRoom) {
      return state.currentRoom.participants.some((p) => isUserOnline(p._id));
    } else if (state.currentChatUser) {
      return isUserOnline(state.currentChatUser._id);
    }
    return false;
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length < 1) return;

    try {
      await createRoom(
        isGroupChat ? newChatName : "",
        isGroupChat ? "group" : "private",
        selectedUsers
      );

      // Reset form
      setNewChatName("");
      setSelectedUsers([]);
      setIsGroupChat(false);
      setShowNewChatModal(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden ">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 flex flex-col border-r border-gray-700">
        {/* User Profile */}
        <div className="p-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {state.user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="ml-3">
                <div className="font-semibold">
                  {state.user?.name || "User"}
                </div>
                <div className="text-xs text-gray-400">Active now</div>
              </div>
            </div>
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <FiMoreVertical size={18} />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-700">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      setShowNewChatModal(true);
                      setShowProfileMenu(false);
                    }}
                  >
                    <FiUsers className="mr-3" /> New Chat
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                    <FiSettings className="mr-3" /> Settings
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    onClick={logout}
                  >
                    <FiLogOut className="mr-3" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 mb-2">
          <button
            className={`flex-1 py-2 text-center font-medium transition-all ${
              activeTab === "chats"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium transition-all ${
              activeTab === "users"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats"
            ? state?.rooms?.map((room) => (
                <div
                  key={room._id}
                  className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
                    state.currentRoom?._id === room._id ? "bg-gray-700" : ""
                  }`}
                  onClick={() => {
                    selectRoom(room);
                    setHideHeader(true); // Hide header when room is selected
                  }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {room.name.substring(0, 2).toUpperCase()}
                    </div>
                    {room.type === "group" && (
                      <div className="absolute bottom-0 right-0 bg-gray-700 text-xs text-gray-300 rounded-full w-5 h-5 flex items-center justify-center">
                        {
                          room.participants.filter((p) => isUserOnline(p._id))
                            .length
                        }
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold">{room.name}</h3>
                      <span className="text-xs text-gray-400">
                        {room.updatedAt ? formatDate(room.updatedAt) : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-400 truncate">
                        {room.type === "group"
                          ? `${room.participants.length} members`
                          : "Group chat"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            : users.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
                    state.currentChatUser?._id === user._id ? "bg-gray-700" : ""
                  }`}
                  onClick={() => {
                    selectChatUser(user);
                    setHideHeader(true); // Hide header when user is selected
                  }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    {isUserOnline(user._id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold">{user.name}</h3>
                      <span className="text-xs text-gray-400">
                        {isUserOnline(user._id) ? "Online" : "Offline"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Chat Area */}
      {state.currentRoom || state.currentChatUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header - Now conditionally rendered based on hideHeader state */}
          {!hideHeader && (state.currentRoom || state.currentChatUser) && (
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {getChatAvatar()}
                  </div>
                  {isChatOnline() && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div className="ml-3">
                  <h2 className="font-semibold">{getChatName()}</h2>
                  <p className="text-xs text-gray-400">
                    {state.currentRoom
                      ? `${state.currentRoom.participants.length} members, ${
                          state.currentRoom.participants.filter((p) =>
                            isUserOnline(p._id)
                          ).length
                        } online`
                      : isChatOnline()
                      ? "Active now"
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  onClick={() => {
                    if (state.currentChatUser) {
                      handleInitiateCall(state.currentChatUser._id, "audio");
                    } else if (state.currentRoom) {
                      handleStartMeeting(state.currentRoom._id);
                    }
                  }}
                >
                  <FiPhone size={18} />
                </button>
                <button
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  onClick={() => {
                    if (state.currentChatUser) {
                      handleInitiateCall(state.currentChatUser._id, "video");
                    } else if (state.currentRoom) {
                      handleStartMeeting(state.currentRoom._id);
                    }
                  }}
                >
                  <FiVideo size={18} />
                </button>
                <button
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  onClick={() => setShowChatInfo(!showChatInfo)}
                >
                  <FiInfo size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Show Chat Info button when header is hidden */}
          {hideHeader && (state.currentRoom || state.currentChatUser) && (
            <div className="bg-gray-800 p-2 border-b border-gray-700 flex items-center justify-center">
              <button 
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                onClick={() => setHideHeader(false)}
              >
                <FiInfo size={16} className="mr-1" />
                Show Chat Info
              </button>
            </div>
          )}

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 bg-gray-900"
            style={{ backgroundColor: "rgb(7, 14, 34)" }}
          >
            {state.messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex mb-4 ${
                  msg.senderId === state.user?._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.senderId !== state.user?._id && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                    {msg.sender?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.senderId === state.user?._id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div
                    className={`flex items-center justify-end mt-1 text-xs ${
                      msg.senderId === state.user?._id
                        ? "text-blue-200"
                        : "text-gray-400"
                    }`}
                  >
                    <span>{formatTime(msg.createdAt)}</span>
                    {msg.senderId === state.user?._id && (
                      <span className="ml-1">
                        {msg.status === "sent" && <FiCheck size={14} />}
                        {msg.status === "delivered" && (
                          <FiCheckCircle size={14} />
                        )}
                        {msg.status === "seen" && (
                          <FiCheckCircle size={14} className="text-blue-300" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {state.currentChatUser &&
              isUserTyping(state.currentChatUser._id) && (
                <div className="flex justify-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                    {state.currentChatUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="bg-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <div className="flex items-center">
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors mr-2">
                <FiPaperclip size={20} />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2.5 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-600 rounded-full transition-colors">
                  <FiSmile size={18} />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 flex items-center justify-center bg-gray-900"
          style={{ backgroundColor: "rgb(7, 14, 34)" }}
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <FiUsers size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to Messenger
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Select a conversation from the sidebar to start messaging. You can
              have private chats or join group conversations.
            </p>
          </div>
        </div>
      )}

      {/* Chat Info Sidebar */}
      {showChatInfo && (state.currentRoom || state.currentChatUser) && (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Chat Info</h3>
            <button
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => setShowChatInfo(false)}
            >
              ×
            </button>
          </div>

          <div className="p-4 flex flex-col items-center border-b border-gray-700">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
              {getChatAvatar()}
            </div>
            <h2 className="font-semibold text-xl">{getChatName()}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {state.currentRoom
                ? `${state.currentRoom.participants.length} members`
                : isChatOnline()
                ? "Active now"
                : "Offline"}
            </p>
            {state.currentRoom && (
              <div className="mt-4 w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Online</span>
                  <span>
                    {
                      state.currentRoom.participants.filter((p) =>
                        isUserOnline(p._id)
                      ).length
                    }{" "}
                    members
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (state.currentRoom.participants.filter((p) =>
                          isUserOnline(p._id)
                        ).length /
                          state.currentRoom.participants.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <h4 className="font-semibold mb-3">
              {state.currentRoom ? "Members" : "Shared Media"}
            </h4>
            {state.currentRoom ? (
              <div className="space-y-2">
                {state.currentRoom.participants.map((participant) => (
                  <div key={participant._id} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{participant.name}</p>
                      <p className="text-xs text-gray-400">
                        {isUserOnline(participant._id)
                          ? "Active now"
                          : "Offline"}
                      </p>
                    </div>
                    {isUserOnline(participant._id) && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-700 rounded-lg"
                  ></div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <button className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium">
              {state.currentRoom ? "Leave Group" : "Delete Chat"}
            </button>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create New Chat</h2>

            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isGroupChat}
                  onChange={(e) => setIsGroupChat(e.target.checked)}
                  className="mr-2"
                />
                <span>Group Chat</span>
              </label>

              {isGroupChat && (
                <input
                  type="text"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder="Group Name"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Select Participants</h3>
              <div className="max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <label key={user._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="mr-2"
                    />
                    <div className="flex items-center flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <span>{user.name}</span>
                      {isUserOnline(user._id) && (
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChat}
                disabled={
                  selectedUsers.length < 1 ||
                  (isGroupChat && !newChatName.trim())
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incoming Call Modal */}
      {state.incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {state.incomingCall.callerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <h2 className="text-xl font-semibold mb-2">Incoming Call</h2>
              <p className="text-gray-400 mb-6">
                {state.incomingCall.callerName} is calling you
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleAnswerCall(false)}
                  className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                >
                  <FiPhone size={24} className="transform rotate-135" />
                </button>
                <button
                  onClick={() => handleAnswerCall(true)}
                  className="p-3 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
                >
                  <FiPhone size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Call Modal */}
      {showCallModal && state.activeCall && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-white font-medium">
                  {state.activeCall.userName}
                </p>
                <p className="text-gray-400 text-sm">00:00</p>
              </div>
            </div>

            <div className="grid grid-cols-2 h-full">
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white text-sm">
                  You
                </div>
              </div>
              <div className="relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white text-sm">
                  {state.activeCall.userName}
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={handleToggleAudio}
                className={`p-3 rounded-full transition-colors ${
                  isAudioEnabled
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isAudioEnabled ? <FiMic size={24} /> : <FiMicOff size={24} />}
              </button>
              <button
                onClick={handleToggleVideo}
                className={`p-3 rounded-full transition-colors ${
                  isVideoEnabled
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isVideoEnabled ? (
                  <FiVideo size={24} />
                ) : (
                  <FiVideoOff size={24} />
                )}
              </button>
              <button
                onClick={handleEndCall}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
              >
                <FiPhone size={24} className="transform rotate-135" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Modal */}
      {showMeetingModal && state.activeMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-white font-medium">
                  {state.activeMeeting.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {state.meetingParticipants.length} participants
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-4 h-full">
              {/* Local video */}
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  You
                </div>
              </div>

              {/* Remote videos */}
              {state.meetingParticipants.map((participant) => (
                <div key={participant._id} className="relative">
                  <video
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    {participant.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={handleToggleAudio}
                className={`p-3 rounded-full transition-colors ${
                  isAudioEnabled
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isAudioEnabled ? <FiMic size={24} /> : <FiMicOff size={24} />}
              </button>
              <button
                onClick={handleToggleVideo}
                className={`p-3 rounded-full transition-colors ${
                  isVideoEnabled
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isVideoEnabled ? (
                  <FiVideo size={24} />
                ) : (
                  <FiVideoOff size={24} />
                )}
              </button>
              <button
                onClick={
                  isScreenSharing
                    ? handleStopScreenShare
                    : handleStartScreenShare
                }
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {isScreenSharing ? (
                  <FiMonitorOff size={24} />
                ) : (
                  <FiMonitor size={24} />
                )}
              </button>
              <button
                onClick={handleLeaveMeeting}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
              >
                <FiPhone size={24} className="transform rotate-135" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}