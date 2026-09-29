import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/password";

export async function POST(request: NextRequest) {
  try {
    const setupSecret = request.headers.get("x-admin-setup-secret");

    if (
      !setupSecret ||
      setupSecret !== process.env.ADMIN_SETUP_SECRET
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingAdmin = await prisma.adminUser.count();

    if (existingAdmin > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin already exists",
        },
        { status: 409 }
      );
    }

    const body = await request.json();

    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const admin = await prisma.adminUser.create({
      data: {
        username,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
      },
    });

    return NextResponse.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Admin setup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}