// src/app/api/contact/send-email/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
        const { to, subject, message, fromName, fromEmail } = await request.json();

        // Validate required fields
        if (!to || !subject || !message) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: to, subject, message" },
                { status: 400 }
            );
        }

        // Create transporter
        const transporter = createTransporter();
        if (!transporter) {
            return NextResponse.json(
                { success: false, error: "Email service is not configured properly" },
                { status: 500 }
            );
        }

        // Prepare email options
        const mailOptions = {
            from: `${fromName || process.env.GMAIL_USER} <${process.env.GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reply from TechSolutions</title>
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
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">TechSolutions</div>
                            <h1>Reply to Your Inquiry</h1>
                        </div>
                        
                        <div class="content">
                            <p>Dear Valued Customer,</p>
                            
                            <div class="message-box">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                            
                            <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
                        </div>
                        
                        <div class="footer">
                            <p>Best regards,<br>${fromName || 'The TechSolutions Team'}</p>
                            <p>© ${new Date().getFullYear()} TechSolutions. All rights reserved.</p>
                            <p>123 Tech Street, Silicon Valley, CA 94025 | +1 (555) 123-4567 | ${fromEmail || process.env.GMAIL_USER}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log("Reply email sent successfully to:", to);

        return NextResponse.json({
            success: true,
            message: "Email sent successfully",
        });

    } catch (error) {
        console.error("Error sending reply email:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send email" },
            { status: 500 }
        );
    }
}