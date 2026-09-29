import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const technologyId = Number(id);

    if (!Number.isInteger(technologyId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid technology ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      categoryId,
      icon,
      experienceLevel,
      isVisible,
      displayOrder,
      translations,
    } = body;

    const existingTechnology =
      await prisma.technology.findUnique({
        where: {
          id: technologyId,
        },
      });

    if (!existingTechnology) {
      return Response.json(
        {
          success: false,
          message: "Technology not found",
        },
        { status: 404 }
      );
    }

    if (
      experienceLevel !== undefined &&
      (!Number.isInteger(experienceLevel) ||
        experienceLevel < 1 ||
        experienceLevel > 5)
    ) {
      return Response.json(
        {
          success: false,
          message: "Experience level must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    if (categoryId !== undefined) {
      const category =
        await prisma.technologyCategory.findUnique({
          where: {
            id: Number(categoryId),
          },
        });

      if (!category) {
        return Response.json(
          {
            success: false,
            message: "Technology category not found",
          },
          { status: 404 }
        );
      }
    }

    const technology = await prisma.technology.update({
      where: {
        id: technologyId,
      },

      data: {
        ...(categoryId !== undefined
          ? {
              categoryId: Number(categoryId),
            }
          : {}),

        ...(icon !== undefined
          ? {
              icon,
            }
          : {}),

        ...(experienceLevel !== undefined
          ? {
              experienceLevel,
            }
          : {}),

        ...(isVisible !== undefined
          ? {
              isVisible,
            }
          : {}),

        ...(displayOrder !== undefined
          ? {
              displayOrder,
            }
          : {}),

        ...(Array.isArray(translations)
          ? {
              translations: {
                deleteMany: {},

                create: translations.map(
                  (translation: {
                    languageCode: string;
                    name: string;
                    description?: string;
                  }) => ({
                    languageCode: translation.languageCode,
                    name: translation.name,
                    description: translation.description,
                  })
                ),
              },
            }
          : {}),
      },

      include: {
        translations: true,

        category: {
          include: {
            translations: true,
          },
        },
      },
    });

    return Response.json({
      success: true,
      technology,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update technology",
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
    const technologyId = Number(id);

    if (!Number.isInteger(technologyId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid technology ID",
        },
        { status: 400 }
      );
    }

    const existingTechnology =
      await prisma.technology.findUnique({
        where: {
          id: technologyId,
        },
      });

    if (!existingTechnology) {
      return Response.json(
        {
          success: false,
          message: "Technology not found",
        },
        { status: 404 }
      );
    }

    await prisma.projectTechnology.deleteMany({
      where: {
        technologyId,
      },
    });

    await prisma.technology.delete({
      where: {
        id: technologyId,
      },
    });

    return Response.json({
      success: true,
      message: "Technology deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete technology",
      },
      { status: 500 }
    );
  }
}