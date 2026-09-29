import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      include: {
        translations: true,
        category: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return Response.json({
      success: true,
      technologies,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch technologies",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      categoryId,
      icon,
      experienceLevel,
      isVisible,
      displayOrder,
      translations,
    } = body;

    if (
      !categoryId ||
      !translations ||
      !Array.isArray(translations)
    ) {
      return Response.json(
        {
          success: false,
          message: "Category and translations are required",
        },
        { status: 400 }
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

    const category = await prisma.technologyCategory.findUnique({
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

    const technology = await prisma.technology.create({
      data: {
        categoryId: Number(categoryId),
        icon,
        experienceLevel: experienceLevel ?? 1,
        isVisible: isVisible ?? true,
        displayOrder: displayOrder ?? 0,

        translations: {
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

    return Response.json(
      {
        success: true,
        technology,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create technology",
      },
      { status: 500 }
    );
  }
}