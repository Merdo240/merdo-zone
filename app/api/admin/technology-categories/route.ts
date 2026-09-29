import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.technologyCategory.findMany({
      include: {
        translations: true,
        technologies: {
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
      categories,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch technology categories",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      isVisible,
      displayOrder,
      translations,
    } = body;

    if (!translations || !Array.isArray(translations)) {
      return Response.json(
        {
          success: false,
          message: "Translations are required",
        },
        { status: 400 }
      );
    }

    const category = await prisma.technologyCategory.create({
      data: {
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
      },
    });

    return Response.json(
      {
        success: true,
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create technology category",
      },
      { status: 500 }
    );
  }
}