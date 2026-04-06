// app/api/auth/forgot-password/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodbAdapter";
import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
const createTransporter = () => {
  // Check if Gmail credentials are available
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error(
      "Gmail credentials are not set in environment variables. Email sending will be skipped.",
    );
    return null; // Return null instead of throwing an error
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
};

// Generate a random reset token
const generateResetToken = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Send password reset email
const sendPasswordResetEmail = async (user, transporter) => {
  const resetToken = generateResetToken();
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  // Store the reset token in the database
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  await db.collection("passwordResets").insertOne({
    email: user.email,
    token: resetToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    createdAt: new Date(),
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: "Reset Your Password",
    html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f5f7fa;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px 20px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 600;
                    }
                    .content {
                        padding: 30px 20px;
                    }
                    .section {
                        margin-bottom: 25px;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #4a5568;
                        margin-bottom: 10px;
                        padding-bottom: 5px;
                        border-bottom: 2px solid #e2e8f0;
                    }
                    .info-box {
                        background-color: #f8fafc;
                        border-left: 4px solid #667eea;
                        padding: 20px;
                        margin-top: 20px;
                        border-radius: 0 4px 4px 0;
                    }
                    .footer {
                        background-color: #f8fafc;
                        padding: 20px;
                        text-align: center;
                        color: #718096;
                        font-size: 14px;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: 700;
                        margin-bottom: 10px;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: 600;
                        margin-top: 20px;
                        text-align: center;
                    }
                    .note {
                        font-size: 14px;
                        color: #718096;
                        font-style: italic;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">BooleanForce</div>
                        <h1>Reset Your Password</h1>
                    </div>
                    
                    <div class="content">
                        <p>Dear ${user.name},</p>
                        <p>We received a request to reset your password. Click the button below to set a new password.</p>
                        
                        <div style="text-align: center;">
                            <a href="${resetLink}" class="cta-button">Reset Password</a>
                        </div>
                        
                        <p class="note">This link will expire in 24 hours for security reasons. If you didn't request this password reset, please ignore this email or contact our support team.</p>
                    </div>
                    
                    <div class="footer">
                        <p>Best regards,<br>The BooleanForce Team</p>
                        <p>© ${new Date().getFullYear()} BooleanForce. All rights reserved.</p>
                        <p>House - SA- 23,(2nd floor) Adarsha Nagar Road,Madda Badda,Dhaka 1212 | 01817886592 | consult@booleanforce.com</p>
                    </div>
                </div>
            </body>
            </html>
        `,
  };

  await transporter.sendMail(mailOptions);
};

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Find the user
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      // For security reasons, we don't want to reveal that the user doesn't exist
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, a password reset link has been sent.",
        },
        { status: 200 },
      );
    }

    // Send password reset email
    const transporter = createTransporter();
    if (transporter) {
      try {
        await sendPasswordResetEmail(user, transporter);
        // //console.log("Password reset email sent successfully");
      } catch (emailError) {
        console.error("Error sending password reset email:", emailError);
        // The request will still succeed, but we log the error
      }
    }

    // Return success response
    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
