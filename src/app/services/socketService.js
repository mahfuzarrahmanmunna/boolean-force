// src/app/services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.userId = null;
  }

  connect(serverUrl, token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(serverUrl, {
      auth: {
        token,
      },
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  getCurrentUserId() {
    return this.userId;
  }

  // Join with user ID
  join(userId) {
    if (this.socket) {
      this.userId = userId;
      this.socket.emit('user:join', userId);
    }
  }

  // Room operations
  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
    }
  }

  // Message operations
  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('send-message', data);
    }
  }

  updateMessageStatus(messageId, status) {
    if (this.socket) {
      this.socket.emit('update-message-status', { messageId, status });
    }
  }

  // Typing indicator
  sendTyping(data) {
    if (this.socket) {
      this.socket.emit('typing', data);
    }
  }

  // Call operations
  callUser(receiverId, offer) {
    if (this.socket) {
      this.socket.emit('call-user', { receiverId, offer });
    }
  }

  answerCall(callerId, answer) {
    if (this.socket) {
      this.socket.emit('answer-call', { callerId, answer });
    }
  }

  sendIceCandidate(targetUserId, candidate) {
    if (this.socket) {
      this.socket.emit('ice-candidate', { targetUserId, candidate });
    }
  }

  endCall(targetUserId) {
    if (this.socket) {
      this.socket.emit('end-call', { targetUserId });
    }
  }

  // Meeting operations
  joinMeeting(meetingId) {
    if (this.socket) {
      this.socket.emit('join-meeting', { meetingId });
    }
  }

  leaveMeeting(meetingId) {
    if (this.socket) {
      this.socket.emit('leave-meeting', { meetingId });
    }
  }

  sendMeetingOffer(meetingId, targetUserId, offer) {
    if (this.socket) {
      this.socket.emit('meeting-offer', { meetingId, targetUserId, offer });
    }
  }

  sendMeetingAnswer(meetingId, targetUserId, answer) {
    if (this.socket) {
      this.socket.emit('meeting-answer', { meetingId, targetUserId, answer });
    }
  }

  sendMeetingIceCandidate(meetingId, targetUserId, candidate) {
    if (this.socket) {
      this.socket.emit('meeting-ice-candidate', { meetingId, targetUserId, candidate });
    }
  }

  // Screen sharing
  startScreenShare(meetingId) {
    if (this.socket) {
      this.socket.emit('start-screen-share', { meetingId });
    }
  }

  stopScreenShare(meetingId) {
    if (this.socket) {
      this.socket.emit('stop-screen-share', { meetingId });
    }
  }

  // Event listeners
  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user-online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user-offline', callback);
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive-message', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message-sent', callback);
    }
  }

  onMessageStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('message-status-updated', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  onIncomingCall(callback) {
    if (this.socket) {
      this.socket.on('incoming-call', callback);
    }
  }

  onCallAnswered(callback) {
    if (this.socket) {
      this.socket.on('call-answered', callback);
    }
  }

  onIceCandidate(callback) {
    if (this.socket) {
      this.socket.on('ice-candidate', callback);
    }
  }

  onCallEnded(callback) {
    if (this.socket) {
      this.socket.on('call-ended', callback);
    }
  }

  onUserJoinedMeeting(callback) {
    if (this.socket) {
      this.socket.on('user-joined-meeting', callback);
    }
  }

  onUserLeftMeeting(callback) {
    if (this.socket) {
      this.socket.on('user-left-meeting', callback);
    }
  }

  onMeetingParticipants(callback) {
    if (this.socket) {
      this.socket.on('meeting-participants', callback);
    }
  }

  onMeetingOffer(callback) {
    if (this.socket) {
      this.socket.on('meeting-offer', callback);
    }
  }

  onMeetingAnswer(callback) {
    if (this.socket) {
      this.socket.on('meeting-answer', callback);
    }
  }

  onMeetingIceCandidate(callback) {
    if (this.socket) {
      this.socket.on('meeting-ice-candidate', callback);
    }
  }

  onScreenShareStarted(callback) {
    if (this.socket) {
      this.socket.on('screen-share-started', callback);
    }
  }

  onScreenShareStopped(callback) {
    if (this.socket) {
      this.socket.on('screen-share-stopped', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }
}

export default new SocketService();