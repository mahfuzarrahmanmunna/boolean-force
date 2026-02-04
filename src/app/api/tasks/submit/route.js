import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const taskId = formData.get("taskId");
    const description = formData.get("description");
    const file = formData.get("file");

    // 🧠 Save as "pending" for team leader
    const submission = {
      taskId,
      description,
      fileName: file?.name,
      status: "pending",
      submittedAt: new Date(),
      role: "worker",
    };

    // TODO: DB save here
    // await TaskSubmission.create(submission)

    return NextResponse.json(
      { success: true, message: "Submitted for review" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
