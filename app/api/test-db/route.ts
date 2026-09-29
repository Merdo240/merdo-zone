import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.count();
    const technologies = await prisma.technology.count();
    const categories = await prisma.technologyCategory.count();

    return Response.json({
      success: true,
      projects,
      technologies,
      categories,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}