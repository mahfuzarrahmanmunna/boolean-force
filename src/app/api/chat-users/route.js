import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';

export async function GET(request) {
  try {
    // Connect to the database
    const usersCollection = await dbConnect('users');
    
    // Get all active admins, approved workers, and active clients
    const chatUsers = await usersCollection.find({
      $or: [
        { role: 'admin', status: 'active' },
        { role: 'worker', status: 'approved' },
        { role: 'client', status: 'active' }
      ]
    }).project({
      _id: 1,
      name: 1,
      email: 1,
      role: 1,
      status: 1,
      jobTitle: 1,
      avatar: 1
    }).toArray();
    
    return NextResponse.json({ 
      users: chatUsers,
      count: chatUsers.length
    });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch chat users',
      details: error.message 
    }, { status: 500 });
  }
}