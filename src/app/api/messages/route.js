// app/api/messages/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { dbConnect } from '@/lib/dbConnect';

// Get messages for a chat
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = parseInt(searchParams.get('skip')) || 0;
    
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }
    
    const messagesCollection = await dbConnect('messages');
    const messages = await messagesCollection
      .find({ chatId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Mark messages as read for this user
    // Note: In a real app, you'd get the user ID from the session
    
    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}