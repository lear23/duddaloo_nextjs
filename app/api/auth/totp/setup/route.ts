// app/api/auth/totp/setup/route.ts
// SECURITY FIX: Endpoint to setup TOTP 2FA for user

import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUserFromRequest } from "@/lib/auth";
import {
  generateTOTPSecret,
  generateBackupCodes,
  hashBackupCode,
  encryptSecret,
} from "@/lib/totp";

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

    await connectDB();

    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // SECURITY FIX: Generate TOTP secret and QR code
    const { secret, qrCode } = await generateTOTPSecret(user.email);

    // SECURITY FIX: Generate backup codes
    const backupCodes = await generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => hashBackupCode(code)),
    );

    return NextResponse.json({
      secret,
      qrCode,
      backupCodes, // Return unhashed codes to user (one time only!)
      message:
        "Save these backup codes in a safe place. Each code can only be used once.",
    });
  } catch (error) {
    console.error("Error setting up TOTP:", error);
    return NextResponse.json(
      { error: "Failed to setup TOTP" },
      { status: 500 },
    );
  }
}
