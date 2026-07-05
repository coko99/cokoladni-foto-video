import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, SALT_ROUNDS);
}

export async function verifyPin(pin: string, hash: string | null): Promise<boolean> {
  if (!hash) return true;
  if (!pin) return false;
  return bcrypt.compare(pin, hash);
}
