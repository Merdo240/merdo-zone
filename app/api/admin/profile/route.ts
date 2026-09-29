import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      include: {
        translations: true,
      },
    });

    return Response.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch profile",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      brandName,
      translations,
    } = body;

    if (!brandName?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Brand name is required",
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(translations) ||
      translations.length === 0
    ) {
      return Response.json(
        {
          success: false,
          message:
            "At least one translation is required",
        },
        { status: 400 }
      );
    }

    const existingProfile =
      await prisma.profile.findFirst();

    let profile;

    if (existingProfile) {
      profile = await prisma.profile.update({
        where: {
          id: existingProfile.id,
        },

        data: {
          brandName: brandName.trim(),

          translations: {
            deleteMany: {},

            create: translations.map(
              (translation: {
                languageCode: string;
                jobTitle: string;
                shortBio?: string | null;
                about?: string | null;
                heroTitle?: string | null;
                heroDescription?: string | null;
              }) => ({
                languageCode:
                  translation.languageCode,

                jobTitle:
                  translation.jobTitle?.trim() || "",

                shortBio:
                  translation.shortBio?.trim() ||
                  null,

                about:
                  translation.about?.trim() ||
                  null,

                heroTitle:
                  translation.heroTitle?.trim() ||
                  null,

                heroDescription:
                  translation.heroDescription?.trim() ||
                  null,
              })
            ),
          },
        },

        include: {
          translations: true,
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          brandName: brandName.trim(),

          translations: {
            create: translations.map(
              (translation: {
                languageCode: string;
                jobTitle: string;
                shortBio?: string | null;
                about?: string | null;
                heroTitle?: string | null;
                heroDescription?: string | null;
              }) => ({
                languageCode:
                  translation.languageCode,

                jobTitle:
                  translation.jobTitle?.trim() || "",

                shortBio:
                  translation.shortBio?.trim() ||
                  null,

                about:
                  translation.about?.trim() ||
                  null,

                heroTitle:
                  translation.heroTitle?.trim() ||
                  null,

                heroDescription:
                  translation.heroDescription?.trim() ||
                  null,
              })
            ),
          },
        },

        include: {
          translations: true,
        },
      });
    }

    return Response.json({
      success: true,
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to save profile",
      },
      { status: 500 }
    );
  }
}