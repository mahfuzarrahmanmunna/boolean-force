// src/app/services/apiService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  // Authentication
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        return data.data.user;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(name, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        return data.data.user;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Users
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-users`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Rooms
  async getRooms() {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  async getRoom(roomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch room');
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  async createRoom(name, type, participants) {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ name, type, participants }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async addParticipantToRoom(roomId, participantId) {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ participantId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to add participant');
      }
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  }

  // Messages
  async getMessages(roomId, receiverId) {
    try {
      const params = new URLSearchParams();
      if (roomId) params.append('roomId', roomId);
      if (receiverId) params.append('receiverId', receiverId);
      
      const response = await fetch(`${API_BASE_URL}/messages?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(receiverId, roomId, content, type) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ receiverId, roomId, content, type }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async updateMessageStatus(messageId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update message status');
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }
}

export default new ApiService();