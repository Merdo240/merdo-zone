import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });

    return Response.json({
      success: true,
      socialLinks,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch social links",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const socialLink = await prisma.socialLink.create({
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
      message: "Social link created successfully",
      socialLink,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create social link",
      },
      { status: 500 }
    );
  }
}