import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id, imageId } = await context.params;

    const projectId = Number(id);
    const projectImageId = Number(imageId);

    if (
      !Number.isInteger(projectId) ||
      !Number.isInteger(projectImageId)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid project or image ID",
        },
        { status: 400 }
      );
    }

    const existingImage =
      await prisma.projectImage.findFirst({
        where: {
          id: projectImageId,
          projectId,
        },
      });

    if (!existingImage) {
      return Response.json(
        {
          success: false,
          message: "Project image not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      imageUrl,
      publicId,
      altText,
      displayOrder,
    } = body;

    if (imageUrl !== undefined && !imageUrl) {
      return Response.json(
        {
          success: false,
          message: "Image URL cannot be empty",
        },
        { status: 400 }
      );
    }

    const image = await prisma.projectImage.update({
      where: {
        id: projectImageId,
      },

      data: {
        ...(imageUrl !== undefined
          ? {
              imageUrl,
            }
          : {}),

        ...(publicId !== undefined
          ? {
              publicId,
            }
          : {}),

        ...(altText !== undefined
          ? {
              altText,
            }
          : {}),

        ...(displayOrder !== undefined
          ? {
              displayOrder,
            }
          : {}),
      },
    });

    return Response.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update project image",
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
    const { id, imageId } = await context.params;

    const projectId = Number(id);
    const projectImageId = Number(imageId);

    if (
      !Number.isInteger(projectId) ||
      !Number.isInteger(projectImageId)
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid project or image ID",
        },
        { status: 400 }
      );
    }

    const existingImage =
      await prisma.projectImage.findFirst({
        where: {
          id: projectImageId,
          projectId,
        },
      });

    if (!existingImage) {
      return Response.json(
        {
          success: false,
          message: "Project image not found",
        },
        { status: 404 }
      );
    }

    await prisma.projectImage.delete({
      where: {
        id: projectImageId,
      },
    });

    return Response.json({
      success: true,
      message: "Project image deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete project image",
      },
      { status: 500 }
    );
  }
}