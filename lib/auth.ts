// lib/auth.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// SECURITY FIX: Validate JWT_SECRET exists in production
const JWT_SECRET_FALLBACK = "fallback-secret-for-dev";
export const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_FALLBACK;

// SECURITY FIX: Warn if fallback secret is used in production
if (
  process.env.NODE_ENV === "production" &&
  JWT_SECRET === JWT_SECRET_FALLBACK
) {
  throw new Error(
    "SECURITY ERROR: JWT_SECRET environment variable is not defined in production. This is a critical security risk.",
  );
}

export const SESSION_COOKIE_NAME = "admin_session";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Changed to async because cookies() is a promise
export async function setAuthCookie(userId: string): Promise<void> {
  // SECURITY FIX: Reduced session duration from 7d to 24h for better security
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });

  const cookieStore = await cookies(); // <--- IMPORTANT: await here

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Recommended to add this
    maxAge: 24 * 60 * 60, // SECURITY FIX: Changed from 7 days to 24 hours
    path: "/",
  });
}

// Changed to async
export async function getAuthUser(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies(); // <--- IMPORTANT: await here
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

// Changed to async
export async function requireAuth(): Promise<string> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user.userId;
}

// In API Routes or Middleware, req.cookies remains synchronous (Request object)
export function getAuthUserFromRequest(
  req: NextRequest,
): { userId: string } | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}
// SECURITY FIX: Helper to verify authentication in Server Actions
export async function requireAuthAction(): Promise<string> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user.userId;
}
// SECURITY FIX: Cookie name for temporary TOTP verification (2FA in progress)
export const TOTP_SESSION_COOKIE_NAME = "totp_session";

/**
 * SECURITY FIX: Set temporary TOTP verification cookie
 * Used when user has passed password but needs to verify 2FA code
 */
export async function setTOTPSession(userId: string): Promise<void> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "5m" }); // 5 min validity
  const cookieStore = await cookies();

  cookieStore.set({
    name: TOTP_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 5 * 60, // 5 minutes
    path: "/",
  });
}

/**
 * SECURITY FIX: Get TOTP verification session
 */
export async function getTOTPSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOTP_SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

/**
 * SECURITY FIX: Clear TOTP verification session
 */
export async function clearTOTPSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOTP_SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    path: "/",
  });
}
