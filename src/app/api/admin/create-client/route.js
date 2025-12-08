// src/app/api/admin/create-client/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const createTransporter = () => {
    // Check if Gmail credentials are available
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error("Gmail credentials are not set in environment variables. Email sending will be skipped.");
        return null; // Return null instead of throwing an error
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });
};

export async function POST(request) {
    try {
        const { name, email, password, role, sendResetEmail } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'A user with this email already exists' },
                { status: 400 }
            );
        }

        // Create password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password, // In a real app, you should hash this password
            role: role || 'client',
            resetToken,
            resetTokenExpiry,
            isActive: true,
            isEmailVerified: false
        });

        // Send password reset email if requested
        if (sendResetEmail) {
            try {
                // Create a transporter
                const transporter = createTransporter();
                if (!transporter) {
                    console.error("Email service is not configured properly");
                    return NextResponse.json(
                        { message: 'Client account created but email could not be sent' },
                        { status: 201 }
                    );
                }

                // Create the reset URL
                const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

                // Send email with the same design as the contact email
                await transporter.sendMail({
                    from: `BooleanForce <${process.env.GMAIL_USER}>`,
                    to: email,
                    subject: 'Welcome to BooleanForce - Set Your Password',
                    html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Welcome to BooleanForce</title>
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
                                .message-box {
                                    background-color: #f8fafc;
                                    border-left: 4px solid #667eea;
                                    padding: 20px;
                                    margin: 20px 0;
                                    border-radius: 0 4px 4px 0;
                                }
                                .button {
                                    display: inline-block;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    text-decoration: none;
                                    padding: 12px 24px;
                                    border-radius: 6px;
                                    font-weight: 600;
                                    margin: 20px 0;
                                    text-align: center;
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
                                .temp-password {
                                    background-color: #f1f5f9;
                                    border: 1px dashed #cbd5e0;
                                    padding: 15px;
                                    border-radius: 6px;
                                    font-family: monospace;
                                    font-size: 16px;
                                    text-align: center;
                                    margin: 15px 0;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <div class="logo">BooleanForce</div>
                                    <h1>Welcome to BooleanForce!</h1>
                                </div>
                                
                                <div class="content">
                                    <p>Dear ${name},</p>
                                    
                                    <p>An administrator has created an account for you on the BooleanForce platform. To get started, please set your password by clicking the button below:</p>
                                    
                                    <div style="text-align: center;">
                                        <a href="${resetUrl}" class="button">Set Your Password</a>
                                    </div>
                                    
                                    <p>Alternatively, you can copy and paste this link into your browser:</p>
                                    <div class="message-box">${resetUrl}</div>
                                    
                                    <p>Your temporary password is:</p>
                                    <div class="temp-password">${password}</div>
                                    
                                    <p>Please note that this link will expire in 24 hours for security reasons. If you don't set your password within this time, you may need to contact the administrator for assistance.</p>
                                </div>
                                
                                <div class="footer">
                                    <p>Best regards,<br>The BooleanForce Team</p>
                                    <p>© ${new Date().getFullYear()} BooleanForce. All rights reserved.</p>
                                    <p>123 Tech Street, Silicon Valley, CA 94025 | +1 (555) 123-4567 | ${process.env.GMAIL_USER}</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                });

                console.log("Password reset email sent successfully to:", email);
            } catch (emailError) {
                console.error("Error sending password reset email:", emailError);
                // Don't fail the entire operation if email fails
                return NextResponse.json(
                    {
                        message: 'Client account created but email could not be sent',
                        userId: newUser._id,
                        tempPassword: password
                    },
                    { status: 201 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Client account created successfully',
            userId: newUser._id,
            tempPassword: password
        });

    } catch (error) {
        console.error("Error creating client account:", error);
        return NextResponse.json(
            { message: 'Failed to create client account' },
            { status: 500 }
        );
    }
}