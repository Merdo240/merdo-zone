import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        translations: true,
      },
    });

    return Response.json({
      success: true,
      education,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch education",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      startDate,
      endDate,
      isCurrent,
      isVisible,
      displayOrder,
      translations,
    } = body;

    if (
      !Array.isArray(translations) ||
      translations.length === 0
    ) {
      return Response.json(
        {
          success: false,
          message: "Translations are required",
        },
        { status: 400 }
      );
    }

    const education = await prisma.education.create({
      data: {
        startDate: startDate
          ? new Date(startDate)
          : null,

        endDate:
          isCurrent || !endDate
            ? null
            : new Date(endDate),

        isCurrent: Boolean(isCurrent),

        isVisible:
          isVisible === undefined
            ? true
            : Boolean(isVisible),

        displayOrder: Number(displayOrder) || 0,

        translations: {
          create: translations.map(
            (translation: {
              languageCode: string;
              title: string;
              description?: string | null;
            }) => ({
              languageCode:
                translation.languageCode,

              title: translation.title,

              description:
                translation.description || null,
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
        message: "Education created successfully",
        education,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create education",
      },
      { status: 500 }
    );
  }
}