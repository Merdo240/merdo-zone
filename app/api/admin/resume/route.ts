import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch resumes",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      fileUrl,
      publicId,
      assetId,
      isVisible,
    } = body;

    if (!title?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    if (!fileUrl?.trim()) {
      return Response.json(
        {
          success: false,
          message: "File URL is required",
        },
        { status: 400 }
      );
    }

    const resume = await prisma.resume.create({
      data: {
        title: title.trim(),
        fileUrl: fileUrl.trim(),
        publicId: publicId?.trim() || null,
        assetId: assetId?.trim() || null,
        isVisible: isVisible ?? true,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Resume created successfully",
        resume,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create resume",
      },
      { status: 500 }
    );
  }
}