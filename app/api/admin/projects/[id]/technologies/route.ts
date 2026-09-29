import { prisma } from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

    const body = await request.json();

    const {
      technologyId,
      displayOrder,
    } = body;

    if (!technologyId) {
      return Response.json(
        {
          success: false,
          message: "Technology ID is required",
        },
        { status: 400 }
      );
    }

    const technology = await prisma.technology.findUnique({
      where: {
        id: Number(technologyId),
      },
    });

    if (!technology) {
      return Response.json(
        {
          success: false,
          message: "Technology not found",
        },
        { status: 404 }
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

    const projectTechnology =
      await prisma.projectTechnology.create({
        data: {
          projectId,
          technologyId: Number(technologyId),
          displayOrder: displayOrder ?? 0,
        },
        include: {
          technology: {
            include: {
              translations: true,
            },
          },
        },
      });

    return Response.json(
      {
        success: true,
        projectTechnology,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to add technology to project",
      },
      { status: 500 }
    );
  }
}

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

    const technologies =
      await prisma.projectTechnology.findMany({
        where: {
          projectId,
        },
        include: {
          technology: {
            include: {
              translations: true,
              category: {
                include: {
                  translations: true,
                },
              },
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
        message: "Failed to fetch project technologies",
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

    const body = await request.json();
    const { technologyId } = body;

    if (!technologyId) {
      return Response.json(
        {
          success: false,
          message: "Technology ID is required",
        },
        { status: 400 }
      );
    }

    const projectTechnology =
      await prisma.projectTechnology.findUnique({
        where: {
          projectId_technologyId: {
            projectId,
            technologyId: Number(technologyId),
          },
        },
      });

    if (!projectTechnology) {
      return Response.json(
        {
          success: false,
          message: "Technology is not linked to this project",
        },
        { status: 404 }
      );
    }

    await prisma.projectTechnology.delete({
      where: {
        projectId_technologyId: {
          projectId,
          technologyId: Number(technologyId),
        },
      },
    });

    return Response.json({
      success: true,
      message: "Technology removed from project successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to remove technology from project",
      },
      { status: 500 }
    );
  }
}