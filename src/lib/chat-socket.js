import { Server } from 'socket.io';
import { dbConnect } from '@/lib/dbConnect';

let io;

export const getChatSocketServer = (server) => {
  if (!io) {
    io = new Server(server, {
      path: '/api/chat-socket',
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      //console.log('User connected to chat:', socket.id);
      
      // User authentication and joining their personal room
      socket.on('authenticate', async (data) => {
        try {
          const { userId, role } = data;
          
          // Verify user exists and is active/approved
          const usersCollection = await dbConnect('users');
          const user = await usersCollection.findOne({ 
            _id: new ObjectId(userId),
            $or: [
              { role: 'admin', status: 'active' },
              { role: 'worker', status: 'approved' },
              { role: 'client', status: 'active' }
            ]
          });
          
          if (!user) {
            socket.emit('auth-error', { message: 'User not found or not authorized' });
            socket.disconnect();
            return;
          }
          
          // Store user info in socket
          socket.userId = userId;
          socket.userRole = role;
          socket.userName = user.name;
          
          // Join user's personal room for private messages
          socket.join(userId);
          
          // Notify others that this user is online
          socket.broadcast.emit('user-online', { userId, userName: user.name, role });
          
          // Send list of online users to this user
          const onlineUsers = Array.from(io.sockets.sockets.values())
            .filter(s => s.userId && s.userId !== userId)
            .map(s => ({ userId: s.userId, userName: s.userName, role: s.userRole }));
          
          socket.emit('online-users', onlineUsers);
          
          socket.emit('authenticated', { success: true });
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('auth-error', { message: 'Authentication failed' });
        }
      });
      
      // Join a chat room
      socket.on('join-chat', async (data) => {
        try {
          const { chatId } = data;
          
          // Verify user has permission to join this chat
          const chatsCollection = await dbConnect('chats');
          const chat = await chatsCollection.findOne({ 
            _id: new ObjectId(chatId),
            participants: socket.userId
          });
          
          if (!chat) {
            socket.emit('error', { message: 'Chat not found or access denied' });
            return;
          }
          
          socket.join(chatId);
          socket.emit('joined-chat', { chatId });
          
          // Notify others in the chat that this user has joined
          socket.to(chatId).emit('user-joined-chat', { 
            userId: socket.userId, 
            userName: socket.userName 
          });
        } catch (error) {
          console.error('Error joining chat:', error);
          socket.emit('error', { message: 'Failed to join chat' });
        }
      });
      
      // Send a message
      socket.on('send-message', async (data) => {
        try {
          const { chatId, text, type = 'text' } = data;
          
          // Verify user is in this chat
          const chatsCollection = await dbConnect('chats');
          const chat = await chatsCollection.findOne({ 
            _id: new ObjectId(chatId),
            participants: socket.userId
          });
          
          if (!chat) {
            socket.emit('error', { message: 'Chat not found or access denied' });
            return;
          }
          
          // Save message to database
          const messagesCollection = await dbConnect('messages');
          const messageData = {
            chatId,
            senderId: socket.userId,
            senderName: socket.userName,
            text,
            type,
            timestamp: new Date(),
            readBy: [socket.userId] // Sender has read their own message
          };
          
          const result = await messagesCollection.insertOne(messageData);
          
          // Update last message in chat
          await chatsCollection.updateOne(
            { _id: new ObjectId(chatId) },
            { 
              $set: { 
                lastMessage: {
                  text,
                  senderId: socket.userId,
                  senderName: socket.userName,
                  timestamp: new Date(),
                  type
                },
                updatedAt: new Date()
              }
            }
          );
          
          // Broadcast the message to all users in the chat room
          const messageWithId = { ...messageData, _id: result.insertedId };
          io.to(chatId).emit('new-message', messageWithId);
          
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });
      
      // Handle typing indicators
      socket.on('typing', (data) => {
        const { chatId, isTyping } = data;
        socket.to(chatId).emit('user-typing', {
          userId: socket.userId,
          userName: socket.userName,
          isTyping
        });
      });
      
      // Mark messages as read
      socket.on('mark-messages-read', async (data) => {
        try {
          const { chatId } = data;
          
          // Update read status in database
          const messagesCollection = await dbConnect('messages');
          await messagesCollection.updateMany(
            { 
              chatId,
              senderId: { $ne: socket.userId }, // Not sent by this user
              readBy: { $ne: socket.userId } // Not already read by this user
            },
            { 
              $push: { readBy: socket.userId }
            }
          );
          
          // Notify other users that messages were read
          socket.to(chatId).emit('messages-read', { 
            userId: socket.userId,
            chatId 
          });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          socket.broadcast.emit('user-offline', { 
            userId: socket.userId, 
            userName: socket.userName 
          });
        }
        //console.log('User disconnected from chat:', socket.id);
      });
    });
  }
  return io;
};