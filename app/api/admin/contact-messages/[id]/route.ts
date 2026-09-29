import { prisma } from "@/src/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const messageId = Number(id);

    if (!Number.isInteger(messageId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid message ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const allowedStatuses = [
      "NEW",
      "READ",
      "ARCHIVED",
    ];

    if (!allowedStatuses.includes(status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid message status",
        },
        { status: 400 }
      );
    }

    const contactMessage =
      await prisma.contactMessage.update({
        where: {
          id: messageId,
        },
        data: {
          status,
        },
      });

    return Response.json({
      success: true,
      message: "Message status updated successfully",
      contactMessage,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update message status",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const messageId = Number(id);

    if (!Number.isInteger(messageId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid message ID",
        },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({
      where: {
        id: messageId,
      },
    });

    return Response.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete message",
      },
      { status: 500 }
    );
  }
}