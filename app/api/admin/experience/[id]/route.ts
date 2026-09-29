import { prisma } from "@/src/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const experienceId = Number(id);

    if (!Number.isInteger(experienceId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid experience ID",
        },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.findUnique({
      where: {
        id: experienceId,
      },
      include: {
        translations: true,
      },
    });

    if (!experience) {
      return Response.json(
        {
          success: false,
          message: "Experience not found",
        },
        { status: 404 }
      );
    }

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

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const experienceId = Number(id);

    if (!Number.isInteger(experienceId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid experience ID",
        },
        { status: 400 }
      );
    }

    const existingExperience =
      await prisma.experience.findUnique({
        where: {
          id: experienceId,
        },
      });

    if (!existingExperience) {
      return Response.json(
        {
          success: false,
          message: "Experience not found",
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
          message: "At least one translation is required",
        },
        { status: 400 }
      );
    }

    const experience =
      await prisma.experience.update({
        where: {
          id: experienceId,
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
            Number.isInteger(displayOrder)
              ? displayOrder
              : 0,

          translations: {
            deleteMany: {},

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

    return Response.json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update experience",
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
    const experienceId = Number(id);

    if (!Number.isInteger(experienceId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid experience ID",
        },
        { status: 400 }
      );
    }

    const existingExperience =
      await prisma.experience.findUnique({
        where: {
          id: experienceId,
        },
      });

    if (!existingExperience) {
      return Response.json(
        {
          success: false,
          message: "Experience not found",
        },
        { status: 404 }
      );
    }

    await prisma.experience.delete({
      where: {
        id: experienceId,
      },
    });

    return Response.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete experience",
      },
      { status: 500 }
    );
  }
}