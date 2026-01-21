// models/User.ts
import { Schema, model, models } from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  password: string; // hashed
  // SECURITY FIX: TOTP 2FA fields
  totpSecret?: string; // TOTP secret key (encrypted)
  totpEnabled?: boolean; // Whether TOTP is enabled for this user
  backupCodes?: string[]; // Emergency backup codes (hashed)
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // SECURITY FIX: TOTP 2FA fields
  totpSecret: { type: String, select: false }, // Don't include in queries by default
  totpEnabled: { type: Boolean, default: false },
  backupCodes: [{ type: String, select: false }], // Don't include in queries by default
});

const User = models.User || model("User", userSchema);
export default User;
