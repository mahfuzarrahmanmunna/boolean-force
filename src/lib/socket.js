// lib/socket.js
import { Server } from 'socket.io';
import { dbConnect } from './mongodb';

let io;

export const getSocketServer = (server) => {
  if (!io) {
    io = new Server(server, {
      path: '/api/socket',
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      //console.log('User connected:', socket.id);
      
      // User joins their personal room for private messages
      socket.on('join-user-room', (userId) => {
        socket.userId = userId;
        socket.join(userId);
        socket.broadcast.emit('user-status-update', { userId, status: 'online' });
      });
      
      // Join a chat room (private or group)
      socket.on('join-chat', async (chatId) => {
        socket.join(chatId);
        
        // Mark messages as read
        try {
          const messagesCollection = await dbConnect('messages');
          await messagesCollection.updateMany(
            { 
              chatId, 
              'recipients.userId': socket.userId,
              'recipients.read': false 
            },
            { $set: { 'recipients.$.read': true, 'recipients.$.readAt': new Date() } }
          );
          
          // Notify other users that messages were read
          socket.to(chatId).emit('messages-read', { userId: socket.userId, chatId });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });
      
      // Send a message
      socket.on('send-message', async (data) => {
        try {
          const { chatId, text, type = 'text', senderId, recipients } = data;
          
          // Save message to database
          const messagesCollection = await dbConnect('messages');
          const messageData = {
            chatId,
            senderId,
            text,
            type,
            timestamp: new Date(),
            recipients: recipients.map(recipientId => ({
              userId: recipientId,
              read: recipientId === senderId, // Sender has read their own message
              readAt: recipientId === senderId ? new Date() : null
            }))
          };
          
          const result = await messagesCollection.insertOne(messageData);
          
          // Update last message in chat
          const chatsCollection = await dbConnect('chats');
          await chatsCollection.updateOne(
            { _id: chatId },
            { 
              $set: { 
                lastMessage: {
                  text,
                  senderId,
                  timestamp: new Date(),
                  type
                }
              },
              $inc: { [`unreadCounts.${senderId}`]: 0 } // Don't increment for sender
            }
          );
          
          // Increment unread count for all recipients except sender
          await chatsCollection.updateOne(
            { _id: chatId },
            { 
              $inc: recipients.reduce((acc, recipientId) => {
                if (recipientId !== senderId) {
                  acc[`unreadCounts.${recipientId}`] = 1;
                }
                return acc;
              }, {})
            }
          );
          
          // Broadcast the message to all users in the chat room
          const messageWithId = { ...messageData, _id: result.insertedId };
          io.to(chatId).emit('new-message', messageWithId);
          
          // Also send to individual rooms for private notifications
          recipients.forEach(recipientId => {
            if (recipientId !== senderId) {
              io.to(recipientId).emit('new-notification', {
                type: 'message',
                chatId,
                message: messageWithId
              });
            }
          });
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });
      
      // Handle typing indicators
      socket.on('typing', (data) => {
        socket.to(data.chatId).emit('user-typing', {
          userId: socket.userId,
          isTyping: data.isTyping
        });
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          socket.broadcast.emit('user-status-update', { userId: socket.userId, status: 'offline' });
        }
        //console.log('User disconnected:', socket.id);
      });
    });
  }
  return io;
};