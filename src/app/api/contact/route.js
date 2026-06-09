import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
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

// Format services for display
const formatServices = (services) => {
  const serviceNames = {
    pos: "POS Systems",
    brand: "Brand Visual Identity",
    erp: "ERP Software Solutions",
    web: "Web Development",
    mobile: "Mobile App Development",
    cloud: "Cloud Solutions",
  };

  return services.map((id) => serviceNames[id] || id).join(", ");
};

// Send notification email to admin
const sendAdminEmail = async (formData, transporter) => {
  const { name, email, phone, company, services, budget, timeline, message } =
    formData;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: `New Contact Form Submission: ${name}`,
    html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Form Submission</title>
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
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }
                    .info-item {
                        margin-bottom: 10px;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #4a5568;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .info-value {
                        color: #2d3748;
                    }
                    .message-box {
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
                    .badge {
                        display: inline-block;
                        padding: 4px 8px;
                        background-color: #edf2f7;
                        color: #4a5568;
                        border-radius: 4px;
                        font-size: 14px;
                        margin-right: 5px;
                        margin-bottom: 5px;
                    }
                    .priority {
                        display: inline-block;
                        padding: 4px 10px;
                        background-color: #f56565;
                        color: white;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">BooleanForce</div>
                        <h1>New Contact Form Submission</h1>
                    </div>
                    
                    <div class="content">
                        <div class="priority">NEW INQUIRY</div>
                        
                        <div class="section">
                            <div class="section-title">Contact Information</div>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Name:</span>
                                    <span class="info-value">${name}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Email:</span>
                                    <span class="info-value">${email}</span>
                                </div>
                                ${
                                  phone
                                    ? `
                                <div class="info-item">
                                    <span class="info-label">Phone:</span>
                                    <span class="info-value">${phone}</span>
                                </div>
                                `
                                    : ""
                                }
                                ${
                                  company
                                    ? `
                                <div class="info-item">
                                    <span class="info-label">Company:</span>
                                    <span class="info-value">${company}</span>
                                </div>
                                `
                                    : ""
                                }
                            </div>
                        </div>
                        
                        ${
                          services && services.length > 0
                            ? `
                        <div class="section">
                            <div class="section-title">Services Interested In</div>
                            <div>
                                ${services.map((service) => `<span class="badge">${formatServices([service])}</span>`).join("")}
                            </div>
                        </div>
                        `
                            : ""
                        }
                        
                        ${
                          budget || timeline
                            ? `
                        <div class="section">
                            <div class="section-title">Project Details</div>
                            <div class="info-grid">
                                ${
                                  budget
                                    ? `
                                <div class="info-item">
                                    <span class="info-label">Budget:</span>
                                    <span class="info-value">${budget}</span>
                                </div>
                                `
                                    : ""
                                }
                                ${
                                  timeline
                                    ? `
                                <div class="info-item">
                                    <span class="info-label">Timeline:</span>
                                    <span class="info-value">${timeline}</span>
                                </div>
                                `
                                    : ""
                                }
                            </div>
                        </div>
                        `
                            : ""
                        }
                        
                        <div class="section">
                            <div class="section-title">Message</div>
                            <div class="message-box">
                                ${message}
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>This message was sent from your website contact form.</p>
                        <p>© ${new Date().getFullYear()} BooleanForce. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
  };

  await transporter.sendMail(mailOptions);
};

// Send confirmation email to user
const sendUserEmail = async (formData, transporter) => {
  const { name, email, services, budget, timeline, message } = formData;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Thank you for contacting BooleanForce",
    html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank you for contacting BooleanForce</title>
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
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }
                    .info-item {
                        margin-bottom: 10px;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #4a5568;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .info-value {
                        color: #2d3748;
                    }
                    .message-box {
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
                    .badge {
                        display: inline-block;
                        padding: 4px 8px;
                        background-color: #edf2f7;
                        color: #4a5568;
                        border-radius: 4px;
                        font-size: 14px;
                        margin-right: 5px;
                        margin-bottom: 5px;
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
                    .team-member {
                        display: flex;
                        align-items: center;
                        margin-top: 20px;
                    }
                    .team-member img {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        margin-right: 15px;
                    }
                    .team-member-info h4 {
                        margin: 0;
                        font-size: 16px;
                        color: #2d3748;
                    }
                    .team-member-info p {
                        margin: 0;
                        font-size: 14px;
                        color: #718096;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">BooleanForce</div>
                        <h1>Thank You for Contacting Us</h1>
                    </div>
                    
                    <div class="content">
                        <p>Dear ${name},</p>
                        <p>Thank you for reaching out to BooleanForce. We have received your message and will get back to you within 24 hours.</p>
                        
                        <div class="section">
                            <div class="section-title">Your Inquiry Summary</div>
                            
                            ${
                              services && services.length > 0
                                ? `
                            <div class="info-item">
                                <span class="info-label">Services:</span>
                                <div>
                                    ${services.map((service) => `<span class="badge">${formatServices([service])}</span>`).join("")}
                                </div>
                            </div>
                            `
                                : ""
                            }
                            
                            <div class="info-grid">
                                ${
                                  budget
                                    ? `
                                <div class="info-item">
                                    <span class="info-label">Budget:</span>
                                    <span class="info-value">${budget}</span>
                                </div>
                                `
                                    : ""
                                }
                                ${
                                  timeline
                                    ? `
                                <div class="info-item">
                                    <span class="info-label">Timeline:</span>
                                    <span class="info-value">${timeline}</span>
                                </div>
                                `
                                    : ""
                                }
                            </div>
                            
                            <div class="info-item">
                                <span class="info-label">Message:</span>
                                <div class="message-box">
                                    ${message}
                                </div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <div class="section-title">What Happens Next?</div>
                            <p>Our team will review your inquiry and assign a dedicated project manager who will contact you to discuss your requirements in detail. We typically respond within 24 hours.</p>
                            
                            <div style="text-align: center;">
                                <a href="https://BooleanForce.com" class="cta-button">Visit Our Website</a>
                            </div>
                        </div>
                        
                        <div class="section">
                            <div class="section-title">Your Dedicated Team</div>
                            <p>At BooleanForce, we pride ourselves on delivering exceptional results. Our team of experts is ready to bring your vision to life.</p>
                            
                            <div class="team-member">
                                <img src="https://picsum.photos/seed/BooleanForce/50/50.jpg" alt="Team Member">
                                <div class="team-member-info">
                                    <h4>Alex Johnson</h4>
                                    <p>Senior Project Manager</p>
                                </div>
                            </div>
                        </div>
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

export async function GET() {
  try {
    const collection = await dbConnect("contacts");
    const data = await collection.find({}).toArray();
    return NextResponse.json(data);
  } catch (err) {
    console.error("BooleanForce: Error in GET /api/contact:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const postData = await request.json();
    //console.log("Received form data:", postData);

    // Validate required fields
    if (!postData.name || !postData.email || !postData.message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Save to database
    const collection = await dbConnect("contacts");
    const result = await collection.insertOne(postData);
    //console.log("Data saved to database:", result);

    // Send emails
    const transporter = createTransporter();
    if (transporter) {
      try {
        // Send notification to admin
        await sendAdminEmail(postData, transporter);
        //console.log("Admin email sent successfully");

        // Send confirmation to user
        await sendUserEmail(postData, transporter);
        //console.log("User confirmation email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // The request will still succeed, but we log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (err) {
    console.error("BooleanForce: Error in POST /api/contact:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
}
