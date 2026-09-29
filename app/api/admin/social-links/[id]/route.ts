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
    const socialLinkId = Number(id);

    if (!Number.isInteger(socialLinkId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid social link ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      platform,
      url,
      icon,
      isVisible,
      displayOrder,
    } = body;

    if (!platform?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Platform is required",
        },
        { status: 400 }
      );
    }

    if (!url?.trim()) {
      return Response.json(
        {
          success: false,
          message: "URL is required",
        },
        { status: 400 }
      );
    }

    const socialLink = await prisma.socialLink.update({
      where: {
        id: socialLinkId,
      },
      data: {
        platform: platform.trim(),
        url: url.trim(),
        icon: icon?.trim() || null,
        isVisible: isVisible ?? true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    return Response.json({
      success: true,
      message: "Social link updated successfully",
      socialLink,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update social link",
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
    const socialLinkId = Number(id);

    if (!Number.isInteger(socialLinkId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid social link ID",
        },
        { status: 400 }
      );
    }

    await prisma.socialLink.delete({
      where: {
        id: socialLinkId,
      },
    });

    return Response.json({
      success: true,
      message: "Social link deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete social link",
      },
      { status: 500 }
    );
  }
}