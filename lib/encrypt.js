import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.CLIENT_SECRET || "client-encryption-key";

export function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

export function decryptData(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}