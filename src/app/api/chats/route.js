import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// Get all chats for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const chatsCollection = await dbConnect('chats');
    const chats = await chatsCollection.find({
      participants: userId
    }).sort({ updatedAt: -1 }).toArray();
    
    // Get unread counts for each chat
    const chatsWithUnread = chats.map(chat => ({
      ...chat,
      unreadCount: chat.unreadCounts?.[userId] || 0
    }));
    
    return NextResponse.json({ chats: chatsWithUnread });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// Create a new chat
export async function POST(request) {
  try {
    const { name, type, participants, createdBy } = await request.json();
    
    if (!participants || participants.length < 2) {
      return NextResponse.json({ error: 'At least 2 participants are required' }, { status: 400 });
    }
    
    const chatsCollection = await dbConnect('chats');
    
    // Check if private chat between these users already exists
    if (type === 'private') {
      const existingChat = await chatsCollection.findOne({
        type: 'private',
        participants: { $all: participants, $size: participants.length }
      });
      
      if (existingChat) {
        return NextResponse.json({ chat: existingChat });
      }
    }
    
    const newChat = {
      name,
      type, // 'private' or 'group'
      participants,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      unreadCounts: participants.reduce((acc, participantId) => {
        acc[participantId] = 0;
        return acc;
      }, {})
    };
    
    const result = await chatsCollection.insertOne(newChat);
    
    return NextResponse.json({ 
      chat: { ...newChat, _id: result.insertedId } 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}