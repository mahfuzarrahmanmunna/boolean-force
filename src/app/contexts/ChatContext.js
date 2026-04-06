// src/app/contexts/ChatContext.js
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '@/app/services/apiService';
import socketService from '@/app/services/socketService';
import webRTCService from '@/app/services/webrtcService';

const initialState = {
  user: null,
  users: [],
  rooms: [],
  messages: [],
  currentRoom: null,
  currentChatUser: null,
  onlineUsers: [],
  typingUsers: {},
  incomingCall: null,
  activeCall: null,
  activeMeeting: null,
  meetingParticipants: [],
  loading: false,
  error: null,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload.messageId
            ? { ...msg, status: action.payload.status }
            : msg
        ),
      };
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'SET_CURRENT_CHAT_USER':
      return { ...state, currentChatUser: action.payload };
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    case 'ADD_ONLINE_USER':
      return { ...state, onlineUsers: [...state.onlineUsers, action.payload] };
    case 'REMOVE_ONLINE_USER':
      return {
        ...state,
        onlineUsers: state.onlineUsers.filter(id => id !== action.payload),
      };
    case 'SET_TYPING_USERS':
      return { ...state, typingUsers: action.payload };
    case 'SET_TYPING_USER':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.userId]: action.payload.isTyping,
        },
      };
    case 'SET_INCOMING_CALL':
      return { ...state, incomingCall: action.payload };
    case 'SET_ACTIVE_CALL':
      return { ...state, activeCall: action.payload };
    case 'END_CALL':
      return { ...state, activeCall: null };
    case 'SET_ACTIVE_MEETING':
      return { ...state, activeMeeting: action.payload };
    case 'SET_MEETING_PARTICIPANTS':
      return { ...state, meetingParticipants: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Initialize socket connection
  useEffect(() => {
    const token = apiService.getAuthToken();
    if (token) {
      const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
      socketService.connect(serverUrl, token);
      
      // Set up socket event listeners
      setupSocketListeners();
      
      return () => {
        socketService.disconnect();
      };
    }
  }, []);

  const setupSocketListeners = () => {
    // User status
    socketService.onUserOnline((user) => {
      dispatch({ type: 'ADD_ONLINE_USER', payload: user._id });
    });
    
    socketService.onUserOffline((user) => {
      dispatch({ type: 'REMOVE_ONLINE_USER', payload: user._id });
    });
    
    // Messages
    socketService.onReceiveMessage((message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
      
      // Mark as delivered
      if (message.status !== 'seen') {
        socketService.updateMessageStatus(message._id, 'delivered');
      }
    });
    
    socketService.onMessageSent((message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    });
    
    socketService.onMessageStatusUpdated(({ messageId, status }) => {
      dispatch({ type: 'UPDATE_MESSAGE', payload: { messageId, status } });
    });
    
    // Typing
    socketService.onUserTyping(({ userId, isTyping }) => {
      dispatch({ type: 'SET_TYPING_USER', payload: { userId, isTyping } });
    });
    
    // Calls
    socketService.onIncomingCall((data) => {
      dispatch({ type: 'SET_INCOMING_CALL', payload: data });
    });
    
    socketService.onCallAnswered((data) => {
      webRTCService.handleAnswer(data.receiverId, data.answer);
    });
    
    socketService.onIceCandidate((data) => {
      webRTCService.handleIceCandidate(data.senderId, data.candidate);
    });
    
    socketService.onCallEnded(() => {
      webRTCService.closeAllPeerConnections();
      webRTCService.stopLocalStream();
      dispatch({ type: 'END_CALL' });
    });
    
    // Meetings
    socketService.onUserJoinedMeeting((data) => {
      // Update meeting participants
      if (state.activeMeeting) {
        const updatedParticipants = [...state.meetingParticipants, {
          _id: data.userId,
          name: data.name,
          avatar: data.avatar,
          isOnline: true,
        }];
        dispatch({ type: 'SET_MEETING_PARTICIPANTS', payload: updatedParticipants });
        
        // Create peer connection with new participant
        webRTCService.createPeerConnection(data.userId);
        webRTCService.createOffer(data.userId).then(offer => {
          socketService.sendMeetingOffer(state.activeMeeting._id, data.userId, offer);
        });
      }
    });
    
    socketService.onUserLeftMeeting((data) => {
      // Update meeting participants
      if (state.activeMeeting) {
        const updatedParticipants = state.meetingParticipants.filter(
          p => p._id !== data.userId
        );
        dispatch({ type: 'SET_MEETING_PARTICIPANTS', payload: updatedParticipants });
        
        // Close peer connection
        webRTCService.closePeerConnection(data.userId);
      }
    });
    
    socketService.onMeetingParticipants((participants) => {
      dispatch({ type: 'SET_MEETING_PARTICIPANTS', payload: participants });
    });
    
    socketService.onMeetingOffer(async (data) => {
      // Create peer connection and answer
      await webRTCService.createPeerConnection(data.senderId);
      const answer = await webRTCService.createAnswer(data.senderId, data.offer);
      socketService.sendMeetingAnswer(data.meetingId, data.senderId, answer);
    });
    
    socketService.onMeetingAnswer((data) => {
      webRTCService.handleAnswer(data.senderId, data.answer);
    });
    
    socketService.onMeetingIceCandidate((data) => {
      webRTCService.handleIceCandidate(data.senderId, data.candidate);
    });
    
    // Screen sharing
    socketService.onScreenShareStarted((data) => {
      // Handle screen share started
      //console.log('Screen share started by:', data.name);
    });
    
    socketService.onScreenShareStopped((data) => {
      // Handle screen share stopped
      //console.log('Screen share stopped by:', data.userId);
    });
    
    // Errors
    socketService.onError((error) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    });
  };

  // Initialize socket with user session
  useEffect(() => {
    // Wait for session to be available
    if (typeof window !== 'undefined') {
      const checkSession = () => {
        // Get user from session storage or wherever you store it
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          dispatch({ type: 'SET_USER', payload: user });
          
          // Join with user ID after socket is connected
          if (socketService.isConnected()) {
            socketService.join(user._id || user.id);
          }
        }
      };
      
      // Check immediately
      checkSession();
      
      // Also check when socket connects
      const interval = setInterval(() => {
        if (socketService.isConnected()) {
          checkSession();
          clearInterval(interval);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, []);

  // Authentication
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await apiService.login(email, password);
      dispatch({ type: 'SET_USER', payload: user });
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Join with user ID after socket is connected
      if (socketService.isConnected()) {
        socketService.join(user._id || user.id);
      } else {
        // Wait for socket to connect then join
        const checkAndJoin = setInterval(() => {
          if (socketService.isConnected()) {
            socketService.join(user._id || user.id);
            clearInterval(checkAndJoin);
          }
        }, 100);
      }
      
      // Reconnect socket with new token
      const token = apiService.getAuthToken();
      if (token) {
        const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
        socketService.connect(serverUrl, token);
        setupSocketListeners();
      } 
      
      return user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socketService.disconnect();
    webRTCService.closeAllPeerConnections();
    webRTCService.stopLocalStream();
    dispatch({ type: 'SET_USER', payload: null });
  };

  // Data fetching
  const fetchUsers = async () => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });

    const res = await fetch('http://localhost:8000/chat-users');
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await res.json();
    
    // Extract the actual users array from the response
    const users = data.data || data;
    //console.log(users)
    
    dispatch({ type: 'SET_USERS', payload: users });

    // Online users
    const onlineUserIds = users
      .filter(user => user.isOnline)
      .map(user => user._id);

    dispatch({ type: 'SET_ONLINE_USERS', payload: onlineUserIds });

  } catch (error) {
    console.error('Error fetching users:', error);
    dispatch({ type: 'SET_ERROR', payload: error.message });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};



  const fetchRooms = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const rooms = await apiService.getRooms();
      dispatch({ type: 'SET_ROOMS', payload: rooms });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchMessages = async (roomId, receiverId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const messages = await apiService.getMessages(roomId, receiverId);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
      
      // Mark messages as seen
      const unseenMessages = messages.filter(
        msg => msg.status !== 'seen' && msg.senderId !== state.user?._id
      );
      
      unseenMessages.forEach(msg => {
        socketService.updateMessageStatus(msg._id, 'seen');
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Room and user selection
  const selectRoom = (room) => {
    dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
    dispatch({ type: 'SET_CURRENT_CHAT_USER', payload: null });
    socketService.joinRoom(room._id);
    fetchMessages(room._id);
  };

  const selectChatUser = (user) => {
    dispatch({ type: 'SET_CURRENT_CHAT_USER', payload: user });
    dispatch({ type: 'SET_CURRENT_ROOM', payload: null });
    fetchMessages(undefined, user._id);
  };

  // Messaging
  const sendMessage = (content, type = 'text') => {
    if (state.currentRoom) {
      socketService.sendMessage({
        roomId: state.currentRoom._id,
        content,
        type,
      });
    } else if (state.currentChatUser) {
      socketService.sendMessage({
        receiverId: state.currentChatUser._id,
        content,
        type,
      });
    }
  };

  const sendTyping = (isTyping) => {
    if (state.currentRoom) {
      socketService.sendTyping({
        roomId: state.currentRoom._id,
        isTyping,
      });
    } else if (state.currentChatUser) {
      socketService.sendTyping({
        receiverId: state.currentChatUser._id,
        isTyping,
      });
    }
  };

  // Room management
  const createRoom = async (name, type, participants) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const room = await apiService.createRoom(name, type, participants);
      dispatch({ type: 'SET_ROOMS', payload: [room, ...state.rooms] });
      return room;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Call management
  const initiateCall = async (userId, type) => {
    try {
      // Initialize local stream
      await webRTCService.initializeLocalStream(type === 'audio' ? true : true, type === 'video' ? true : false);
      
      // Create peer connection
      await webRTCService.createPeerConnection(userId);
      
      // Create offer
      const offer = await webRTCService.createOffer(userId);
      
      // Send call request
      socketService.callUser(userId, offer);
      
      // Set active call
      const user = state.users.find(u => u._id === userId);
      dispatch({
        type: 'SET_ACTIVE_CALL',
        payload: {
          userId,
          userName: user?.name || 'Unknown',
          type,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const answerCall = async (accept) => {
    if (!state.incomingCall) return;
    
    if (accept) {
      try {
        // Initialize local stream
        await webRTCService.initializeLocalStream(true, true);
        
        // Create peer connection
        await webRTCService.createPeerConnection(state.incomingCall.callerId);
        
        // Create answer
        const answer = await webRTCService.createAnswer(
          state.incomingCall.callerId,
          state.incomingCall.offer
        );
        
        // Send answer
        socketService.answerCall(state.incomingCall.callerId, answer);
        
        // Set active call
        dispatch({
          type: 'SET_ACTIVE_CALL',
          payload: {
            userId: state.incomingCall.callerId,
            userName: state.incomingCall.callerName,
            type: 'video', // Default to video for now
          },
        });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
    
    // Clear incoming call
    dispatch({ type: 'SET_INCOMING_CALL', payload: null });
  };

  const endCall = () => {
    if (state.activeCall) {
      socketService.endCall(state.activeCall.userId);
      webRTCService.closePeerConnection(state.activeCall.userId);
      webRTCService.stopLocalStream();
      dispatch({ type: 'END_CALL' });
    }
  };

  // Meeting management
  const startMeeting = async (roomId) => {
    try {
      // Initialize local stream
      await webRTCService.initializeLocalStream(true, true);
      
      // Get room details
      const room = await apiService.getRoom(roomId);
      
      // Create meeting
      const meeting = {
        _id: `meeting-${Date.now()}`,
        name: `${room.name} Meeting`,
        roomId,
        participants: room.participants,
        createdBy: state.user?._id || '',
        isActive: true,
        startTime: new Date().toISOString(),
      };
      
      dispatch({ type: 'SET_ACTIVE_MEETING', payload: meeting });
      dispatch({ type: 'SET_MEETING_PARTICIPANTS', payload: room.participants });
      
      // Join meeting
      socketService.joinMeeting(roomId);
      
      // Create peer connections with all participants
      const otherParticipants = room.participants.filter(p => p._id !== state.user?._id);
      await webRTCService.createMeetingPeerConnections(otherParticipants.map(p => p._id));
      
      // Create offers for all participants
      for (const participant of otherParticipants) {
        const offer = await webRTCService.createOffer(participant._id);
        socketService.sendMeetingOffer(meeting._id, participant._id, offer);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const joinMeeting = async (meetingId) => {
    try {
      // Initialize local stream
      await webRTCService.initializeLocalStream(true, true);
      
      // Join meeting
      socketService.joinMeeting(meetingId);
      
      // Set active meeting
      dispatch({
        type: 'SET_ACTIVE_MEETING',
        payload: {
          _id: meetingId,
          name: 'Meeting',
          roomId: meetingId,
          participants: [],
          createdBy: '',
          isActive: true,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const leaveMeeting = () => {
    if (state.activeMeeting) {
      socketService.leaveMeeting(state.activeMeeting.roomId);
      webRTCService.closeAllPeerConnections();
      webRTCService.stopLocalStream();
      webRTCService.stopScreenStream();
      dispatch({ type: 'SET_ACTIVE_MEETING', payload: null });
      dispatch({ type: 'SET_MEETING_PARTICIPANTS', payload: [] });
    }
  };

  // Screen sharing
  const startScreenShare = async () => {
    try {
      await webRTCService.initializeScreenStream();
      await webRTCService.switchToScreenShare();
      
      if (state.activeMeeting) {
        socketService.startScreenShare(state.activeMeeting.roomId);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const stopScreenShare = async () => {
    try {
      await webRTCService.switchToCamera();
      webRTCService.stopScreenStream();
      
      if (state.activeMeeting) {
        socketService.stopScreenShare(state.activeMeeting.roomId);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Media controls
  const toggleAudio = (enabled) => {
    webRTCService.toggleAudio(enabled);
  };

  const toggleVideo = (enabled) => {
    webRTCService.toggleVideo(enabled);
  };

  // Initial data fetch
  useEffect(() => {
    if (state.user) {
      fetchUsers();
      fetchRooms();
    }
  }, [state.user]);

  return (
    <ChatContext.Provider
      value={{
        state,
        login,
        logout,
        fetchUsers,
        // users,
        fetchRooms,
        fetchMessages,
        selectRoom,
        selectChatUser,
        sendMessage,
        sendTyping,
        createRoom,
        initiateCall,
        answerCall,
        endCall,
        startMeeting,
        joinMeeting,
        leaveMeeting,
        startScreenShare,
        stopScreenShare,
        toggleAudio,
        toggleVideo,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};