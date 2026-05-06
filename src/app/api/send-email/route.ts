import { NextRequest, NextResponse } from "next/server";

type EmailData = {
  name: string;
  email: string;
  message: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: EmailData = await request.json();

    // Validate input
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    // Get Web3Forms access key
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error("Missing Web3Forms access key in environment variables");
      return NextResponse.json(
        { message: "Email service is not configured. Please contact the site administrator." },
        { status: 500 }
      );
    }

    // Prepare data for Web3Forms
    const formData = new FormData();
    formData.append("access_key", accessKey);
    formData.append("name", body.name);
    formData.append("email", body.email);
    formData.append("message", body.message);
    formData.append("subject", `New Contact Form Submission from ${body.name}`);

    // Send to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
    } else {
      console.error("Web3Forms error:", result);
      return NextResponse.json(
        { message: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "An error occurred while sending the email." },
      { status: 500 }
    );
  }
}
