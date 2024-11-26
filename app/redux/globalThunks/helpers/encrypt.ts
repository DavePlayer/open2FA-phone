import CryptoES from "crypto-es";

// Encrypt function using HMAC (or another encryption function, as AES is unsupported directly in expo-crypto)
export async function encrypt(
  password: string,
  textToEncrypt: string,
  iterations: number
): Promise<string> {
  console.log("Start encrypt function");

  // Using a static key and iv for testing purposes
  // const key = CryptoES.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
  // const iv = CryptoES.enc.Hex.parse("00000000000000000000000000000000");
  // const salt = CryptoES.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");

  const salt = CryptoES.lib.WordArray.random(128 / 8); // 128-bit salt

  const key = CryptoES.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256-bit key
    iterations: iterations,
  });

  const iv = CryptoES.lib.WordArray.random(128 / 8); // 128-bit IV

  console.log(
    "------------------------------------------------------------------------"
  );
  console.log("salt:", salt.toString(CryptoES.enc.Hex));
  console.log("IV:", iv.toString(CryptoES.enc.Hex));
  console.log("iterations: ", iterations);
  console.log("password`: ", password);
  console.log("key: ", key.toString(CryptoES.enc.Hex));
  console.log(
    "------------------------------------------------------------------------"
  );

  // Encrypt the text using AES
  const encrypted = CryptoES.AES.encrypt(textToEncrypt, key, {
    iv: iv,
    padding: CryptoES.pad.Pkcs7, // Use Pkcs7 padding
  });

  const encryptedText = encrypted.toString() || ""; // Ensure ciphertext is in Base64
  console.log("Encrypted message:", encryptedText);

  // Compute expected HMAC
  const hmacKey = CryptoES.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: iterations,
  });
  const hmac = CryptoES.HmacSHA256(encryptedText, hmacKey);

  console.log(
    "------------------------------------------------------------------------"
  );
  console.log("salt:", salt.toString(CryptoES.enc.Hex));
  console.log("IV:", iv.toString(CryptoES.enc.Hex));
  console.log("hmac:", hmac.toString(CryptoES.enc.Hex));
  console.log("iterations: ", iterations);
  console.log("password`: ", password);
  console.log("key: ", key.toString(CryptoES.enc.Hex));
  console.log("password`: ", hmac.toString(CryptoES.enc.Hex));
  console.log(
    "------------------------------------------------------------------------"
  );

  // Return salt (Base64) + IV (Base64) + encrypted text
  const saltStr = salt.toString(CryptoES.enc.Base64);
  const ivStr = iv.toString(CryptoES.enc.Base64);
  const hmacStr = hmac.toString(CryptoES.enc.Base64);
  return `${iterations}\$${saltStr}\$${ivStr}\$${hmacStr}\$${encryptedText}`;
}
