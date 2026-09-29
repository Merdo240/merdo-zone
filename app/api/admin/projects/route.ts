import { prisma } from "@/src/lib/prisma";

export async function GET() {
    
  try {
    const projects = await prisma.project.findMany({
      include: {
        translations: true,
        technologies: {
          include: {
            technology: {
              include: {
                translations: true,
              },
            },
          },
        },
        images: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return Response.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}   
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      slug,
      coverImageUrl,
      coverImagePublicId,
      githubUrl,
      liveDemoUrl,
      isVisible,
      displayOrder,
      translations,
    } = body;

    if (!slug || !translations || !Array.isArray(translations)) {
      return Response.json(
        {
          success: false,
          message: "Slug and translations are required",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        slug,
        coverImageUrl,
        coverImagePublicId,
        githubUrl,
        liveDemoUrl,
        isVisible: isVisible ?? true,
        displayOrder: displayOrder ?? 0,

        translations: {
          create: translations.map((translation: {
            languageCode: string;
            name: string;
            shortDescription?: string;
            fullDescription?: string;
          }) => ({
            languageCode: translation.languageCode,
            name: translation.name,
            shortDescription: translation.shortDescription,
            fullDescription: translation.fullDescription,
          })),
        },
      },

      include: {
        translations: true,
      },
    });

    return Response.json(
      {
        success: true,
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create project",
      },
      { status: 500 }
    );
  }
}