import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const educationId = Number(id);

    if (!Number.isInteger(educationId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid education ID",
        },
        { status: 400 }
      );
    }

    const education =
      await prisma.education.findUnique({
        where: {
          id: educationId,
        },
        include: {
          translations: true,
        },
      });

    if (!education) {
      return Response.json(
        {
          success: false,
          message: "Education not found",
        },
        { status: 404 }
      );
    }

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

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const educationId = Number(id);

    if (!Number.isInteger(educationId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid education ID",
        },
        { status: 400 }
      );
    }

    const existingEducation =
      await prisma.education.findUnique({
        where: {
          id: educationId,
        },
      });

    if (!existingEducation) {
      return Response.json(
        {
          success: false,
          message: "Education not found",
        },
        { status: 404 }
      );
    }

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

    const education =
      await prisma.$transaction(async (tx) => {
        await tx.educationTranslation.deleteMany({
          where: {
            educationId,
          },
        });

        return tx.education.update({
          where: {
            id: educationId,
          },

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
              Number(displayOrder) || 0,

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
                    translation.description ||
                    null,
                })
              ),
            },
          },

          include: {
            translations: true,
          },
        });
      });

    return Response.json({
      success: true,
      message: "Education updated successfully",
      education,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update education",
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
    const educationId = Number(id);

    if (!Number.isInteger(educationId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid education ID",
        },
        { status: 400 }
      );
    }

    const education =
      await prisma.education.findUnique({
        where: {
          id: educationId,
        },
      });

    if (!education) {
      return Response.json(
        {
          success: false,
          message: "Education not found",
        },
        { status: 404 }
      );
    }

    await prisma.education.delete({
      where: {
        id: educationId,
      },
    });

    return Response.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete education",
      },
      { status: 500 }
    );
  }
}