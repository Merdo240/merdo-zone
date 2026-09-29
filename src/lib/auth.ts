import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

export async function createSessionToken(
  adminId: number,
  username: string
): Promise<string> {
  return new SignJWT({
    adminId,
    username,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySessionToken(
  token: string
): Promise<{ adminId: number; username: string } | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    if (
      typeof payload.adminId !== "number" ||
      typeof payload.username !== "string"
    ) {
      return null;
    }

    return {
      adminId: payload.adminId,
      username: payload.username,
    };
  } catch {
    return null;
  }
}


export async function getAdminSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}