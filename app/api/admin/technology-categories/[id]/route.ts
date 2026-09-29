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
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid category ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      isVisible,
      displayOrder,
      translations,
    } = body;

    const existingCategory =
      await prisma.technologyCategory.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!existingCategory) {
      return Response.json(
        {
          success: false,
          message: "Technology category not found",
        },
        { status: 404 }
      );
    }

    const category =
      await prisma.technologyCategory.update({
        where: {
          id: categoryId,
        },

        data: {
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
                      languageCode:
                        translation.languageCode,
                      name: translation.name,
                      description:
                        translation.description,
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
      category,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update technology category",
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
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid category ID",
        },
        { status: 400 }
      );
    }

    const existingCategory =
      await prisma.technologyCategory.findUnique({
        where: {
          id: categoryId,
        },
        include: {
          technologies: true,
        },
      });

    if (!existingCategory) {
      return Response.json(
        {
          success: false,
          message: "Technology category not found",
        },
        { status: 404 }
      );
    }

    if (existingCategory.technologies.length > 0) {
      return Response.json(
        {
          success: false,
          message:
            "Cannot delete category because it contains technologies",
        },
        { status: 409 }
      );
    }

    await prisma.technologyCategory.delete({
      where: {
        id: categoryId,
      },
    });

    return Response.json({
      success: true,
      message: "Technology category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete technology category",
      },
      { status: 500 }
    );
  }
}