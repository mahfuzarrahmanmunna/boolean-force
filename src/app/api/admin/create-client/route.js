// app/api/admin/create-client/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    subject: "Your Account Has Been Created - Set Your Password",
    html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Account Has Been Created</title>
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
                    .password-box {
                        background-color: #edf2f7;
                        border-radius: 6px;
                        padding: 15px;
                        margin: 20px 0;
                        font-family: monospace;
                        font-size: 18px;
                        text-align: center;
                        letter-spacing: 1px;
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
                        <h1>Your Account Has Been Created</h1>
                    </div>
                    
                    <div class="content">
                        <p>Dear ${user.name},</p>
                        <p>An administrator has created an account for you on the BooleanForce platform. To get started, please set your password by clicking the button below.</p>
                        
                        <div class="section">
                            <div class="section-title">Your Login Information</div>
                            <div class="info-box">
                                <p><strong>Email:</strong> ${user.email}</p>
                                <p><strong>Account Type:</strong> Client Account</p>
                            </div>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="${resetLink}" class="cta-button">Set Your Password</a>
                        </div>
                        
                        <p class="note">This link will expire in 24 hours for security reasons. If you didn't request this account creation, please contact our support team.</p>
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

export async function POST(request) {
  try {
    const { name, email, password, role, sendResetEmail } =
      await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || "client",
      status: "active", // Client accounts are active by default
      provider: "credentials",
      createdAt: new Date(),
    };

    // Insert user into database
    const result = await users.insertOne(newUser);
    const userId = result.insertedId.toString();

    // Send password reset email if requested
    if (sendResetEmail) {
      const transporter = createTransporter();
      if (transporter) {
        try {
          await sendPasswordResetEmail(newUser, transporter);
          //console.log("Password reset email sent successfully");
        } catch (emailError) {
          console.error("Error sending password reset email:", emailError);
          // The request will still succeed, but we log the error
        }
      }
    }

    // Create notification for admin
    await db.collection("notifications").insertOne({
      type: "new_client_created",
      title: "New Client Account Created",
      message: `${name} has been added as a client.`,
      userId: userId,
      read: false,
      createdAt: new Date(),
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Client account created successfully!",
        userId,
        passwordResetEmailSent:
          sendResetEmail &&
          !!process.env.GMAIL_USER &&
          !!process.env.GMAIL_PASS,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating client account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
