import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch contact messages",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      service,
      budget,
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

    if (!service?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Service is required",
        },
        { status: 400 }
      );
    }

    if (!subject?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Subject is required",
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

    const contactMessage =
      await prisma.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim() || null,
          service: service.trim(),
          budget: budget?.trim() || null,
          subject: subject.trim(),
          message: message.trim(),
        },
      });

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