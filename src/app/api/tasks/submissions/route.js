import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🔹 Mock data (DB না থাকলে reviewer এর জন্য enough)
    const submissions = [
      {
        id: "1",
        taskTitle: "Build Login Page",
        workerName: "John Doe",
        status: "pending",
        submittedAt: "2026-02-02",
      },
      {
        id: "2",
        taskTitle: "API Integration",
        workerName: "Jane Smith",
        status: "approved",
        submittedAt: "2026-02-01",
      },
    ];

    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
