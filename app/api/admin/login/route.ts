import { prisma } from "@/src/lib/prisma";
import { verifyPassword } from "@/src/lib/password";
import { createSessionToken } from "@/src/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: {
        username,
      },
    });

    if (!admin) {
      return Response.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(
      password,
      admin.passwordHash
    );

    if (!passwordValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    const sessionToken = await createSessionToken(
      admin.id,
      admin.username
    );

    const cookieStore = await cookies();

    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    await prisma.adminUser.update({
      where: {
        id: admin.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return Response.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Login failed",
      },
      { status: 500 }
    );
  }
}