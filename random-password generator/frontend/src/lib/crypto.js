export async function deriveKey(password, email) {
  const enc = new TextEncoder();


  const emailBuffer = enc.encode(email.toLowerCase());
  const saltHash = await window.crypto.subtle.digest("SHA-256", emailBuffer);
  const salt = saltHash.slice(0, 16);

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false, // extractable
    ["encrypt", "decrypt"]
  );
}

export async function hashPasswordForBackend(password) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hash = await window.crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToBuffer(base64) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptData(dataObject, key) {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const dataString = JSON.stringify(dataObject);

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    enc.encode(dataString)
  );

  const ivBase64 = bufferToBase64(iv);
  const encryptedBase64 = bufferToBase64(encrypted);


  return `${ivBase64}:${encryptedBase64}`;
}

export async function decryptData(encryptedString, key) {
  if (!encryptedString || !encryptedString.includes(":")) {

    return encryptedString;
  }

  try {
    const [ivBase64, encryptedBase64] = encryptedString.split(":");
    const iv = base64ToBuffer(ivBase64);
    const encrypted = base64ToBuffer(encryptedBase64);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv)
      },
      key,
      encrypted
    );

    const dec = new TextDecoder();
    const decryptedString = dec.decode(decrypted);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return encryptedString;
  }
}
