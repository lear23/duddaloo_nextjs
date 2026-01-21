// app/api/auth/totp/verify/route.ts
// SECURITY FIX: Endpoint to verify and enable TOTP 2FA

import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUserFromRequest } from "@/lib/auth";
import { verifyTOTPToken, encryptSecret } from "@/lib/totp";

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Verify user is authenticated
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 },
      );
    }

    const { secret, totpToken } = await request.json();

    if (!secret || !totpToken) {
      return NextResponse.json(
        { error: "Secret and TOTP token required" },
        { status: 400 },
      );
    }

    // SECURITY FIX: Verify the TOTP token with the secret
    const isValid = verifyTOTPToken(totpToken, secret);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid TOTP code" }, { status: 401 });
    }

    await connectDB();

    // SECURITY FIX: Save encrypted secret and enable TOTP
    const encryptedSecret = encryptSecret(secret);

    await User.findByIdAndUpdate(authUser.userId, {
      totpSecret: encryptedSecret,
      totpEnabled: true,
    });

    return NextResponse.json({
      success: true,
      message: "TOTP 2FA has been successfully enabled",
    });
  } catch (error) {
    console.error("Error verifying TOTP:", error);
    return NextResponse.json(
      { error: "Failed to verify TOTP" },
      { status: 500 },
    );
  }
}
