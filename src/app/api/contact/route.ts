import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let name: FormDataEntryValue | null = null;
    let email: FormDataEntryValue | null = null;
    let phone: FormDataEntryValue | null = null;
    let message: FormDataEntryValue | null = null;

    // Accept either form-data or JSON
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({} as any));
      name = body.name ?? null;
      email = body.email ?? null;
      phone = body.phone ?? null;
      message = body.message ?? null;
    } else {
      const formData = await request.formData();
      name = formData.get("name");
      email = formData.get("email");
      phone = formData.get("phone");
      message = formData.get("message");
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For now, log the submission (in production, integrate with email service)
    console.log("Contact form submission:", { name, email, phone, message });

    // If RESEND_API_KEY is provided, send through Resend (no extra dependency)
    const RESEND_KEY = process.env.RESEND_API_KEY;
    const dest = process.env.CONTACT_DESTINATION_EMAIL || "support@torq-lab.com";

    if (RESEND_KEY) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_KEY}`,
          },
          body: JSON.stringify({
            from: "TORQ Contact <noreply@torq-lab.com>",
            to: dest,
            subject: `New contact form submission from ${name ?? "Anonymous"}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone ?? "Not provided"}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `,
          }),
        });

        if (!res.ok) {
          console.error("Resend send failed", await res.text());
        }
      } catch (err) {
        console.error("Resend API error:", err);
      }
    } else {
      // No provider configured: log and return success; operator must set RESEND_API_KEY or CONTACT SMTP vars
      console.warn("No RESEND_API_KEY configured; contact submissions are logged only.");
    }

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
