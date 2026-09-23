import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
}
const ALGORITHM = "aes-256-gcm";

export const encryptText = (text) => {
  if (!text) return text;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");


  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

export const decryptText = (encryptedData) => {
  if (!encryptedData) return encryptedData;

  const parts = encryptedData.split(":");
  if (parts.length !== 3) {

    return encryptedData;
  }

  const [ivHex, authTagHex, encryptedText] = parts;

  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, "hex"),
      Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return encryptedData;
  }
};
