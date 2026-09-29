import { prisma } from "@/src/lib/prisma";
import { sendTelegramMessage } from "@/src/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      subject,
      message,
    } = body;

    if (!name?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Name is required",
        },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Message is required",
        },
        { status: 400 }
      );
    }

    // Save message to database first
    const contactMessage =
      await prisma.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          subject: subject?.trim() || null,
          message: message.trim(),
        },
      });

    // Send Telegram notification
    try {
      const telegramMessage =`
<b>━━━━━━━━━━━━━━━━━━━━</b>
🔔 <b>NEW MESSAGE</b>
<b>MERDO ZONE</b>
<b>━━━━━━━━━━━━━━━━━━━━</b>

👤 <b>FROM</b>
${escapeHtml(name.trim())}

📧 <b>EMAIL</b>
${escapeHtml(email.trim())}

📌 <b>SUBJECT</b>
${escapeHtml(subject?.trim() || "No subject")}

💬 <b>MESSAGE</b>
${escapeHtml(message.trim())}

<b>━━━━━━━━━━━━━━━━━━━━</b>
🆔 <b>Message #${contactMessage.id}</b>
🕐 <b>${new Date().toLocaleString()}</b>

⚡ <i>Merdo Zone Contact System</i>
<b>━━━━━━━━━━━━━━━━━━━━</b>
`;

      await sendTelegramMessage(telegramMessage);
    } catch (telegramError) {
      // Telegram failure should not affect message saving
      console.error(
        "Telegram notification failed:",
        telegramError
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
        contactMessage: {
          id: contactMessage.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
