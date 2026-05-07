import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let name: FormDataEntryValue | null = null;
    let email: FormDataEntryValue | null = null;
    let message: FormDataEntryValue | null = null;

    // Accept either form-data or JSON
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({} as any));
      name = body.name ?? null;
      email = body.email ?? null;
      message = body.message ?? null;
    } else {
      const formData = await request.formData();
      name = formData.get("name");
      email = formData.get("email");
      message = formData.get("message");
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the submission
    console.log("Contact form submission:", { name, email, message });

    // If RESEND_API_KEY is provided, send through Resend (no extra dependency)
    const RESEND_KEY = process.env.RESEND_API_KEY;
    const dest = process.env.CONTACT_DESTINATION_EMAIL || "support@torq-lab.com";

    if (RESEND_KEY) {
      try {
        // Email 1: Send submission to support team
        const supportRes = await fetch("https://api.resend.com/emails", {
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

              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `,
          }),
        });

        if (!supportRes.ok) {
          console.error("Resend send to support failed", await supportRes.text());
        }

        // Email 2: Send confirmation to the submitter
        const confirmRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_KEY}`,
          },
          body: JSON.stringify({
            from: "TORQ Contact <noreply@torq-lab.com>",
            to: email as string,
            subject: "We received your message — TORQ",
            html: `
              <h2>Thank you for contacting TORQ!</h2>
              <p>Hi ${name},</p>
              <p>We received your message and will get back to you as soon as possible.</p>
              <p><strong>Your message:</strong></p>
              <p>${message}</p>
              <hr />
              <p style="font-size: 12px; color: #666;">
                If you have any questions in the meantime, feel free to reply to this email or visit our site at https://torq-lab.com
              </p>
            `,
          }),
        });

        if (!confirmRes.ok) {
          console.error("Resend confirmation send failed", await confirmRes.text());
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
