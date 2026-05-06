import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const message = formData.get("message");

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For now, log the submission (in production, integrate with email service)
    console.log("Contact form submission:", { name, email, phone, message });

    // TODO: Integrate with email service (e.g., SendGrid, Resend, Nodemailer)
    // Example with Resend (requires RESEND_API_KEY env variable):
    // const response = await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     from: "noreply@torq-lab.com",
    //     to: "support@torq-lab.com",
    //     subject: `New contact form submission from ${name}`,
    //     html: `
    //       <h2>New Contact Form Submission</h2>
    //       <p><strong>Name:</strong> ${name}</p>
    //       <p><strong>Email:</strong> ${email}</p>
    //       <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    //       <p><strong>Message:</strong></p>
    //       <p>${message}</p>
    //     `,
    //   }),
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully. We will contact you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
