import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    const responseTime = Date.now() - startedAt;

    return NextResponse.json({
      status: "online",
      website: "online",
      database: "online",
      responseTime: `${responseTime}ms`,
      checkedAt: new Date().toISOString(),
    });
  } catch {
    const responseTime = Date.now() - startedAt;

    return NextResponse.json(
      {
        status: "degraded",
        website: "online",
        database: "offline",
        responseTime: `${responseTime}ms`,
        checkedAt: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}