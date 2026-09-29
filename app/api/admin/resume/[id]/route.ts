import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/src/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const resumeId = Number(id);

    if (!Number.isInteger(resumeId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const oldResume = await prisma.resume.findUnique({
  where: {
    id: resumeId,
  },
});

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

    if (
  oldResume?.publicId &&
  oldResume.publicId !== (publicId?.trim() || null)
) {
  await cloudinary.uploader.destroy(
    oldResume.publicId,
    {
      resource_type: "raw",
      type: "upload",
    }
  );
}

    const resume = await prisma.resume.update({
      where: {
        id: resumeId,
      },
      data: {
        title: title.trim(),
        fileUrl: fileUrl.trim(),
        publicId: publicId?.trim() || null,
        assetId: assetId?.trim() || null,
        isVisible: isVisible ?? true,
      },
    });

    return Response.json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update resume",
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
    const resumeId = Number(id);

    if (!Number.isInteger(resumeId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 }
      );
    }

    const resume = await prisma.resume.findUnique({
  where: {
    id: resumeId,
  },
});

if (!resume) {
  return Response.json(
    {
      success: false,
      message: "Resume not found",
    },
    { status: 404 }
  );
}

if (resume.publicId) {
  await cloudinary.uploader.destroy(
    resume.publicId,
    {
      resource_type: "raw",
      type: "upload",
    }
  );
}

await prisma.resume.delete({
  where: {
    id: resumeId,
  },
});

    return Response.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete resume",
      },
      { status: 500 }
    );
  }
}