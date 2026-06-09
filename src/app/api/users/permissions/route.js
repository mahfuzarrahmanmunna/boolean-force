// app/api/users/permissions/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { dbConnect } from '@/lib/dbConnect';

// GET method to fetch user permissions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const usersCollection = await dbConnect('users');
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { permissions: 1, role: 1 } }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Default permissions based on role
    const defaultPermissions = {
      admin: {
        project: ['create_project', 'edit_project', 'view_all_projects', 'delete_project', 'assign_project'],
        task: ['create_task', 'edit_task', 'delete_task', 'submit_task', 'approve_task', 'assign_task'],
        monetization: ['view_payments', 'process_payments', 'manage_pricing'],
        team: ['add_member', 'remove_member', 'edit_member', 'view_team_stats'],
        system: ['view_analytics', 'export_data', 'system_settings']
      },
      worker: {
        project: ['view_assigned_projects'],
        task: ['view_assigned_tasks', 'submit_task', 'update_task_status'],
        monetization: ['view_earnings'],
        team: ['view_team_members'],
        system: []
      },
      client: {
        project: ['view_own_projects'],
        task: ['view_project_tasks', 'create_task', 'approve_task'],
        monetization: ['make_payments', 'view_invoices'],
        team: [],
        system: []
      }
    };
    
    const permissions = user.permissions || defaultPermissions[user.role] || {};
    
    return NextResponse.json({ 
      permissions,
      role: user.role 
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}

// POST method to update user permissions (admin only)
export async function POST(request) {
  try {
    const { adminId, userId, permissions } = await request.json();
    
    if (!adminId || !userId || !permissions) {
      return NextResponse.json({ 
        error: 'Admin ID, User ID, and permissions are required' 
      }, { status: 400 });
    }
    
    // Verify admin
    const usersCollection = await dbConnect('users');
    const admin = await usersCollection.findOne({ 
      _id: new ObjectId(adminId), 
      role: 'admin',
      status: 'active'
    });
    
    if (!admin) {
      return NextResponse.json({ 
        error: 'Unauthorized: Admin access required' 
      }, { status: 403 });
    }
    
    // Update user permissions
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          permissions,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Permissions updated successfully' 
    });
  } catch (error) {
    console.error('Error updating permissions:', error);
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 });
  }
}