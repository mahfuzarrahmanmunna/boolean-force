// src/app/api/projects/[id]/route.js

import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

// Helper function to check if a user is a team leader
async function isTeamLeader(userId) {
  try {
    const teamsCollection = await dbConnect("teams");
    let team = await teamsCollection.findOne({
      teamLeader: new ObjectId(userId),
    });

    if (!team) {
      team = await teamsCollection.findOne({
        teamLeader: userId,
      });
    }

    return !!team;
  } catch (error) {
    console.error("Error checking team leader status:", error);
    return false;
  }
}

async function hasProjectPermission(userId, projectId, action = "read") {
  const projects = await dbConnect("projects");
  const teams = await dbConnect("teams");

  const project = await projects.findOne({ _id: new ObjectId(projectId) });
  if (!project) return false;

  const userIdStr = String(userId);

  if (project.createdBy && String(project.createdBy) === userIdStr) {
    return true;
  }

  if (!Array.isArray(project.assignedTo) || project.assignedTo.length === 0) {
    return false;
  }

  for (const teamId of project.assignedTo) {
    const team = await teams.findOne({ _id: new ObjectId(teamId) });
    if (!team) continue;

    if (String(team.teamLeader) === userIdStr) {
      return true;
    }

    if (action === "read") {
      if (Array.isArray(team.members)) {
        if (team.members.map(String).includes(userIdStr)) {
          return true;
        }
      }
    }
  }

  return false;
}

// GET - Fetch a specific project by ID
export async function GET(request, { params }) {
  // FIX: Added 'await' before params for Next.js 15+
  const { id } = await params;
  //console.log(`GET /api/projects/${id} called`);
  //console.log("ID type:", typeof id);
  //console.log("ID value:", id);

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    if (!ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format: ${id}`);
      return NextResponse.json(
        { success: false, error: "Invalid project ID format." },
        { status: 400 },
      );
    }

    const hasPermission = await hasProjectPermission(
      session.user.id,
      id,
      "read",
    );
    if (!hasPermission) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have permission to view this project.",
        },
        { status: 403 },
      );
    }

    const collection = await dbConnect("projects");
    const project = await collection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      console.error(`Project not found with ID: ${id}`);
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 },
      );
    }

    const serializedProject = {
      ...project,
      _id: project._id.toString(),
      assignedTo: Array.isArray(project.assignedTo)
        ? project.assignedTo.map((id) =>
            typeof id === "object" ? id.toString() : id.toString(),
          )
        : project.assignedTo
          ? [
              typeof project.assignedTo === "object"
                ? project.assignedTo.toString()
                : project.assignedTo.toString(),
            ]
          : [],
    };

    return NextResponse.json({
      success: true,
      data: serializedProject,
    });
  } catch (err) {
    console.error(`Error in GET /api/projects/${id}:`, err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while fetching project. Please try again later.",
        details: err.message,
      },
      { status: 500 },
    );
  }
}

// PUT - Update a project
export async function PUT(request, { params }) {
  const { id } = await params;
  //console.log(id);
  //console.log(`PUT /api/projects/${id} called`);
  //console.log("ID type:", typeof id);
  //console.log("ID value:", id);

  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    if (!ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format: ${id}`);
      return NextResponse.json(
        { success: false, error: "Invalid project ID format." },
        { status: 400 },
      );
    }

    const contentType = request.headers.get("content-type");
    let projectData;
    let files = [];

    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const title = formData.get("title");
      const description = formData.get("description");
      const dueDate = formData.get("dueDate");
      const priority = formData.get("priority") || "medium";
      const category = formData.get("category") || "other";
      const estimatedHours = formData.get("estimatedHours");
      const tags = formData.get("tags");
      const directions = formData.get("directions");
      const assignedTeams = formData.get("assignedTeams");

      const parsedTags = tags ? JSON.parse(tags) : [];
      const parsedAssignedTeams = assignedTeams
        ? JSON.parse(assignedTeams)
        : [];

      for (const [key, value] of formData.entries()) {
        if (key === "files" && value instanceof File) {
          const fileName = `${Date.now()}-${value.name}`;
          files.push({
            name: value.name,
            size: value.size,
            type: value.type,
            url: `/uploads/${fileName}`,
          });
        }
      }

      projectData = {
        title,
        description,
        dueDate,
        priority,
        category,
        estimatedHours,
        tags: parsedTags,
        directions,
        files,
        assignedTo: parsedAssignedTeams,
      };
    } else {
      projectData = await request.json();

      if (projectData.tags && typeof projectData.tags === "string") {
        projectData.tags = projectData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }

      if (
        projectData.assignedTo &&
        typeof projectData.assignedTo === "string"
      ) {
        projectData.assignedTo = projectData.assignedTo
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id);
      }
    }

    const collection = await dbConnect("projects");
    const existingProject = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingProject) {
      console.error(`Project not found with ID: ${id}`);
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 },
      );
    }

    //console.log("Existing project found:", existingProject);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...projectData,
          updatedAt: new Date(),
          updatedBy: new ObjectId(session.user.id),
        },
      },
    );

    //console.log("Update result:", result);

    if (result.matchedCount === 0) {
      console.error(`Failed to update project with ID: ${id}`);
      return NextResponse.json(
        { success: false, error: "Failed to update project." },
        { status: 500 },
      );
    }

    const updatedProject = await collection.findOne({ _id: new ObjectId(id) });
    //console.log("Updated project:", updatedProject);

    const serializedProject = {
      ...updatedProject,
      _id: updatedProject._id.toString(),
      assignedTo: Array.isArray(updatedProject.assignedTo)
        ? updatedProject.assignedTo.map((id) =>
            typeof id === "object" ? id.toString() : id.toString(),
          )
        : updatedProject.assignedTo
          ? [
              typeof updatedProject.assignedTo === "object"
                ? updatedProject.assignedTo.toString()
                : updatedProject.assignedTo.toString(),
            ]
          : [],
    };

    return NextResponse.json({
      success: true,
      data: serializedProject,
    });
  } catch (err) {
    console.error(`Error in PUT /api/projects/${id}:`, err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while updating project. Please try again later.",
        details: err.message,
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete a project
export async function DELETE(request, { params }) {
  const { id } = await params;
  //console.log(`DELETE /api/projects/${id} called`);
  //console.log("ID type:", typeof id);
  //console.log("ID value:", id);

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID format." },
        { status: 400 },
      );
    }

    const hasPermission = await hasProjectPermission(
      session.user.id,
      id,
      "delete",
    );
    if (!hasPermission) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have permission to delete this project.",
        },
        { status: 403 },
      );
    }

    const projectsCollection = await dbConnect("projects");
    const teamsCollection = await dbConnect("teams");

    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 },
      );
    }

    const result = await projectsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 },
      );
    }

    if (project.assignedTo && project.assignedTo.length > 0) {
      const assignedToObjectIds = project.assignedTo.map((id) => {
        return typeof id === "object" ? id : new ObjectId(id);
      });

      await teamsCollection.updateMany(
        { _id: { $in: assignedToObjectIds } },
        {
          $pull: {
            assignedProjects: new ObjectId(id),
          },
          $set: {
            updatedAt: new Date(),
          },
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (err) {
    console.error(`Error in DELETE /api/projects/${id}:`, err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while deleting project. Please try again later.",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
