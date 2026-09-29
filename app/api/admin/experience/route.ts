import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        translations: true,
      },
    });

    return Response.json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch experience",
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
          message: "At least one translation is required",
        },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.create({
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

        displayOrder:
          Number.isInteger(displayOrder)
            ? displayOrder
            : 0,

        translations: {
          create: translations.map(
            (translation: {
              languageCode: string;
              title: string;
              description?: string;
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
        message: "Experience created successfully",
        experience,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create experience",
      },
      { status: 500 }
    );
  }
}