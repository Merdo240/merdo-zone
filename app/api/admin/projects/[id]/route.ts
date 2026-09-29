import { prisma } from "@/src/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        translations: true,
        technologies: {
          include: {
            technology: {
              include: {
                translations: true,
              },
            },
          },
        },
        images: true,
      },
    });

    if (!project) {
      return Response.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch project",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      slug,
      coverImageUrl,
      coverImagePublicId,
      githubUrl,
      liveDemoUrl,
      isVisible,
      displayOrder,
      translations,
    } = body;

    const existingProject = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!existingProject) {
      return Response.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        slug,
        coverImageUrl,
        coverImagePublicId,
        githubUrl,
        liveDemoUrl,
        isVisible,
        displayOrder,

        ...(Array.isArray(translations)
          ? {
              translations: {
                deleteMany: {},

                create: translations.map(
                  (translation: {
                    languageCode: string;
                    name: string;
                    shortDescription?: string;
                    fullDescription?: string;
                  }) => ({
                    languageCode: translation.languageCode,
                    name: translation.name,
                    shortDescription:
                      translation.shortDescription,
                    fullDescription:
                      translation.fullDescription,
                  })
                ),
              },
            }
          : {}),
      },

      include: {
        translations: true,
      },
    });

    return Response.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update project",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const existingProject = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!existingProject) {
      return Response.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    // Delete cover image from Cloudinary
    if (existingProject.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(
          existingProject.coverImagePublicId,
          {
            resource_type: "image",
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete cover image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    // Delete project from database
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return Response.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete project",
      },
      { status: 500 }
    );
  }
}