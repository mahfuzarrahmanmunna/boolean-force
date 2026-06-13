// src/app/services/webrtcService.js
import socketService from './socketService';

class WebRTCService {
  constructor() {
    this.localStream = null;
    this.screenStream = null;
    this.peerConnections = new Map();
    this.remoteStreams = new Map();
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers for production
      ],
    };
  }

  async initializeLocalStream(audio = true, video = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio, video });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async initializeScreenStream() {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true 
      });
      return this.screenStream;
    } catch (error) {
      console.error('Error accessing screen:', error);
      throw error;
    }
  }

  stopLocalStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  stopScreenStream() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
  }

  getLocalStream() {
    return this.localStream;
  }

  getScreenStream() {
    return this.screenStream;
  }

  getRemoteStream(userId) {
    return this.remoteStreams.get(userId) || null;
  }

  // One-to-one call methods
  async createPeerConnection(userId) {
    const pc = new RTCPeerConnection(this.configuration);
    
    // Add local stream to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.sendIceCandidate(userId, event.candidate);
      }
    };
    
    // Handle remote stream
    pc.ontrack = (event) => {
      this.remoteStreams.set(userId, event.streams[0]);
    };
    
    this.peerConnections.set(userId, pc);
    return pc;
  }

  async createOffer(userId) {
    const pc = this.peerConnections.get(userId) || await this.createPeerConnection(userId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(userId, offer) {
    const pc = this.peerConnections.get(userId) || await this.createPeerConnection(userId);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  async handleAnswer(userId, answer) {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      await pc.setRemoteDescription(answer);
    }
  }

  async handleIceCandidate(userId, candidate) {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  closePeerConnection(userId) {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(userId);
      this.remoteStreams.delete(userId);
    }
  }

  closeAllPeerConnections() {
    this.peerConnections.forEach((pc, userId) => {
      pc.close();
      this.remoteStreams.delete(userId);
    });
    this.peerConnections.clear();
  }

  // Meeting methods (for group calls)
  async createMeetingPeerConnections(participants) {
    for (const userId of participants) {
      if (userId !== socketService.getCurrentUserId()) {
        await this.createPeerConnection(userId);
      }
    }
  }

  async switchToScreenShare() {
    if (!this.screenStream) return;
    
    // Replace video track in all peer connections
    this.peerConnections.forEach(pc => {
      const sender = pc.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && this.screenStream) {
        const videoTrack = this.screenStream.getVideoTracks()[0];
        sender.replaceTrack(videoTrack);
      }
    });
  }

  async switchToCamera() {
    if (!this.localStream) return;
    
    // Replace video track in all peer connections
    this.peerConnections.forEach(pc => {
      const sender = pc.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && this.localStream) {
        const videoTrack = this.localStream.getVideoTracks()[0];
        sender.replaceTrack(videoTrack);
      }
    });
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }
}

export default new WebRTCService();