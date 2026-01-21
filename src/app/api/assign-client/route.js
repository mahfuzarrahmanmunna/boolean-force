import { NextResponse } from "next/server";
// import { dbConnect } from '@/lib/mongodb';
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request) {
  try {
    const { adminId, workerId, clientId } = await request.json();

    if (!adminId || !workerId || !clientId) {
      return NextResponse.json(
        {
          error: "Admin ID, Worker ID, and Client ID are required",
        },
        { status: 400 },
      );
    }

    // Verify admin
    const usersCollection = await dbConnect("users");
    const admin = await usersCollection.findOne({
      _id: new ObjectId(adminId),
      role: "admin",
      status: "active",
    });

    if (!admin) {
      return NextResponse.json(
        {
          error: "Unauthorized: Admin access required",
        },
        { status: 403 },
      );
    }

    // Verify worker and client
    const worker = await usersCollection.findOne({
      _id: new ObjectId(workerId),
      role: "worker",
      status: "approved",
    });

    const client = await usersCollection.findOne({
      _id: new ObjectId(clientId),
      role: "client",
      status: "active",
    });

    if (!worker || !client) {
      return NextResponse.json(
        {
          error: "Worker or client not found or not eligible",
        },
        { status: 404 },
      );
    }

    // Check if chat already exists between this worker and client
    const chatsCollection = await dbConnect("chats");
    const existingChat = await chatsCollection.findOne({
      type: "private",
      participants: { $all: [workerId, clientId], $size: 2 },
    });

    let chatId;

    if (existingChat) {
      chatId = existingChat._id.toString();
    } else {
      // Create new chat between worker and client
      const newChat = {
        type: "private",
        participants: [workerId, clientId],
        assignedBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await chatsCollection.insertOne(newChat);
      chatId = result.insertedId.toString();
    }

    // Add client to worker's assigned work if not already there
    await usersCollection.updateOne(
      { _id: new ObjectId(workerId) },
      {
        $addToSet: { assignedWork: clientId },
        $set: { updatedAt: new Date() },
      },
    );

    return NextResponse.json({
      success: true,
      chatId,
      message: "Client assigned to worker successfully",
    });
  } catch (error) {
    console.error("Error assigning client:", error);
    return NextResponse.json(
      {
        error: "Failed to assign client to worker",
      },
      { status: 500 },
    );
  }
}
