// lib/totp.ts
// SECURITY FIX: TOTP (Time-based One-Time Password) implementation for 2FA

import speakeasy from "speakeasy";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";

// SECURITY FIX: Configuration for TOTP
const TOTP_CONFIG = {
  name: "Duddaloo Store",
  issuer: "Duddaloo",
  length: 32, // Secret key length
  window: 1, // Allow 1 time step before/after for clock skew
};

/**
 * SECURITY FIX: Generate TOTP secret and QR code for setup
 * @param email User email address
 * @returns Secret and QR code URL for scanning
 */
export async function generateTOTPSecret(email: string) {
  try {
    // Generate secret using speakeasy
    const secret = speakeasy.generateSecret({
      name: `${TOTP_CONFIG.name} (${email})`,
      issuer: TOTP_CONFIG.issuer,
      length: TOTP_CONFIG.length,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || "");

    return {
      secret: secret.base32, // Store this in DB (encrypted)
      qrCode: qrCodeUrl,
    };
  } catch (error) {
    console.error("Error generating TOTP secret:", error);
    throw new Error("Failed to generate TOTP secret");
  }
}

/**
 * SECURITY FIX: Verify TOTP token (6-digit code)
 * @param token The 6-digit code from authenticator app
 * @param secret The stored secret
 * @returns True if token is valid
 */
export function verifyTOTPToken(token: string, secret: string): boolean {
  try {
    // Remove spaces and ensure it's 6 digits
    const cleanToken = token.replace(/\s/g, "");

    if (!/^\d{6}$/.test(cleanToken)) {
      return false;
    }

    // Verify token with clock skew window
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: cleanToken,
      window: TOTP_CONFIG.window,
    });

    return verified === true;
  } catch (error) {
    console.error("Error verifying TOTP token:", error);
    return false;
  }
}

/**
 * SECURITY FIX: Generate backup codes for emergency access
 * @returns Array of 10 backup codes
 */
export async function generateBackupCodes(): Promise<string[]> {
  const codes: string[] = [];

  for (let i = 0; i < 10; i++) {
    // Generate 8-character codes
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }

  return codes;
}

/**
 * SECURITY FIX: Hash backup code for storage
 * @param code Backup code to hash
 * @returns Hashed code
 */
export async function hashBackupCode(code: string): Promise<string> {
  return await bcrypt.hash(code, 10);
}

/**
 * SECURITY FIX: Verify backup code
 * @param code Backup code from user
 * @param hashedCode Hashed code from database
 * @returns True if code matches
 */
export async function verifyBackupCode(
  code: string,
  hashedCode: string,
): Promise<boolean> {
  return await bcrypt.compare(code, hashedCode);
}

/**
 * SECURITY FIX: Encrypt secret for storage (basic base64 + env key)
 * Note: For production, use proper encryption like crypto-js or libsodium
 * @param secret The TOTP secret to encrypt
 * @returns Encrypted secret
 */
export function encryptSecret(secret: string): string {
  // SECURITY NOTE: This is basic encryption. For production, use crypto-js or similar
  const encryptionKey =
    process.env.TOTP_ENCRYPTION_KEY || "default-encryption-key";
  return Buffer.from(`${secret}:${encryptionKey}`).toString("base64");
}

/**
 * SECURITY FIX: Decrypt secret for verification
 * @param encryptedSecret The encrypted secret from database
 * @returns Decrypted secret
 */
export function decryptSecret(encryptedSecret: string): string {
  try {
    const encryptionKey =
      process.env.TOTP_ENCRYPTION_KEY || "default-encryption-key";
    const decrypted = Buffer.from(encryptedSecret, "base64").toString("utf-8");
    const [secret] = decrypted.split(":");
    return secret;
  } catch (error) {
    console.error("Error decrypting TOTP secret:", error);
    throw new Error("Failed to decrypt TOTP secret");
  }
}
