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
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return Response.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    const images = await prisma.projectImage.findMany({
      where: {
        projectId,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return Response.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch project images",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return Response.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      imageUrl,
      publicId,
      altText,
      displayOrder,
    } = body;

    if (!imageUrl) {
      return Response.json(
        {
          success: false,
          message: "Image URL is required",
        },
        { status: 400 }
      );
    }

    const image = await prisma.projectImage.create({
      data: {
        projectId,
        imageUrl,
        publicId,
        altText,
        displayOrder: displayOrder ?? 0,
      },
    });

    return Response.json(
      {
        success: true,
        image,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to add project image",
      },
      { status: 500 }
    );
  }
}