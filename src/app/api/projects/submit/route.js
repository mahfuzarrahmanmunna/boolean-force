// src/app/api/projects/submit/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
// FIX: Removed "/next" from the import path
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    const data = await request.json();
    const { projectId, notes, files = [] } = data;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required." },
        { status: 400 },
      );
    }

    if (!notes || notes.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Submission notes are required." },
        { status: 400 },
      );
    }

    const teamsCollection = await dbConnect("teams");
    const team = await teamsCollection.findOne({
      teamLeader: new ObjectId(session.user.id),
    });

    if (!team) {
      return NextResponse.json(
        { success: false, error: "Only team leaders can submit projects." },
        { status: 403 },
      );
    }

    const projectsCollection = await dbConnect("projects");
    const project = await projectsCollection.findOne({
      _id: new ObjectId(projectId),
      assignedTo: { $in: [team._id.toString()] },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found or not assigned to your team.",
        },
        { status: 404 },
      );
    }

    if (project.status === "submitted" || project.status === "completed") {
      return NextResponse.json(
        { success: false, error: "This project has already been submitted." },
        { status: 400 },
      );
    }

    const updateData = {
      status: "submitted",
      submittedAt: new Date(),
      submittedBy: new ObjectId(session.user.id),
      submissionNotes: notes.trim(),
      updatedAt: new Date(),
    };

    if (files.length > 0) {
      updateData.submittedFiles = files;
    }

    const result = await projectsCollection.updateOne(
      { _id: new ObjectId(projectId) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to submit project." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project submitted successfully for review.",
      data: {
        projectId,
        projectTitle: project.title,
        submittedAt: new Date(),
        submittedBy: session.user.name,
        teamName: team.name,
      },
    });
  } catch (error) {
    console.error("Error submitting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit project." },
      { status: 500 },
    );
  }
}
