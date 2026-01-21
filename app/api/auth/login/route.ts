import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import {
  verifyPassword,
  setAuthCookie,
  setTOTPSession,
  TOTP_SESSION_COOKIE_NAME,
} from "@/lib/auth";
// SECURITY FIX: Import TOTP verification
import { verifyTOTPToken, decryptSecret } from "@/lib/totp";
// SECURITY FIX: Import rate limiting
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rateLimiter";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password, totpToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 },
      );
    }

    // SECURITY FIX: Check rate limiting based on email
    const rateLimitKey = email.toLowerCase();
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
          remainingAttempts: 0,
        },
        { status: 429 },
      );
    }

    await connectDB();

    // SECURITY FIX: First step - verify password
    const user = await User.findOne({ email });
    if (!user) {
      // SECURITY FIX: Record failed attempt
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      // SECURITY FIX: Record failed attempt
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 },
      );
    }

    // SECURITY FIX: Second step - check if TOTP is enabled
    if (user.totpEnabled && user.totpSecret) {
      // If no TOTP token provided, create temporary session and ask for it
      if (!totpToken) {
        await setTOTPSession(user._id.toString());
        return NextResponse.json(
          {
            success: false,
            requiresTOTP: true,
            message: "Please provide TOTP code",
          },
          { status: 200 },
        );
      }

      // Verify TOTP token
      try {
        const decryptedSecret = decryptSecret(user.totpSecret);
        const isTOTPValid = verifyTOTPToken(totpToken, decryptedSecret);

        if (!isTOTPValid) {
          // SECURITY FIX: Record failed TOTP attempt
          recordFailedAttempt(rateLimitKey);
          return NextResponse.json(
            { error: "Invalid TOTP code" },
            { status: 401 },
          );
        }
      } catch (error) {
        console.error("TOTP verification error:", error);
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json(
          { error: "TOTP verification failed" },
          { status: 500 },
        );
      }

      // SECURITY FIX: Clear TOTP session after successful verification
      const cookieStore = await cookies();
      cookieStore.set(TOTP_SESSION_COOKIE_NAME, "", {
        maxAge: 0,
        path: "/",
      });
    }

    // SECURITY FIX: Reset rate limit on successful login
    resetRateLimit(rateLimitKey);

    // SECURITY FIX: Set authentication cookie after all verifications pass
    await setAuthCookie(user._id.toString());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
