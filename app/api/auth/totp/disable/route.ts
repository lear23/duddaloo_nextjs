// app/api/auth/totp/disable/route.ts
// SECURITY FIX: Endpoint to disable TOTP 2FA

import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthUserFromRequest } from "@/lib/auth";
import { verifyPassword } from "@/lib/auth";

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

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password required to disable 2FA" },
        { status: 400 },
      );
    }

    await connectDB();

    // SECURITY FIX: Verify password before disabling TOTP
    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // SECURITY FIX: Disable TOTP and clear secret and backup codes
    await User.findByIdAndUpdate(authUser.userId, {
      totpSecret: null,
      totpEnabled: false,
      backupCodes: [],
    });

    return NextResponse.json({
      success: true,
      message: "TOTP 2FA has been disabled",
    });
  } catch (error) {
    console.error("Error disabling TOTP:", error);
    return NextResponse.json(
      { error: "Failed to disable TOTP" },
      { status: 500 },
    );
  }
}
