import CryptoES from "crypto-es";
import * as SecureStore from "expo-secure-store";

// Decrypt function to verify the integrity of the encrypted text
export async function decrypt(
  password: string,
  encryptedFileText: string
): Promise<string> {
  try {
    console.log(
      `Starting decryption function\ntext: ${encryptedFileText}\nPassword: ${password}\n`
    );

    // Extract the salt (Base64) and the actual encrypted hash
    const [iterationsStr, saltStr, ivStr, hmacStr, encryptedText] =
      encryptedFileText.split("$");

    console.log(encryptedFileText.split("$"));

    // var key = CryptoES.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
    // var ivWord = CryptoES.enc.Hex.parse("00000000000000000000000000000000");
    // var salt = CryptoES.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");

    // Convert Base64 strings back to WordArray format
    const salt = CryptoES.enc.Base64.parse(saltStr);
    const iv = CryptoES.enc.Base64.parse(ivStr);
    const hmac = CryptoES.enc.Base64.parse(hmacStr);
    const iterations = parseInt(iterationsStr);

    // Compute expected HMAC
    const hmacKey = CryptoES.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: iterations,
    });

    const expectedHmac = CryptoES.HmacSHA256(encryptedText, hmacKey);

    const key = CryptoES.PBKDF2(password, salt, {
      keySize: 256 / 32, // 256-bit key
      iterations: iterations,
    });

    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("Extracted salt:", salt.toString(CryptoES.enc.Hex));
    console.log("Extracted IV:", iv.toString(CryptoES.enc.Hex));
    console.log("Extracted hmac:", hmac.toString(CryptoES.enc.Hex));
    console.log("Expected  hmac:", expectedHmac.toString(CryptoES.enc.Hex));
    console.log("Extracted iterations:", iterations);
    console.log("password`: ", password);
    console.log("Derived Key (from PBKDF2):", key.toString(CryptoES.enc.Hex));
    console.log(
      "------------------------------------------------------------------------"
    );

    if (!iterations) {
      throw new Error("File is not ok");
    }

    if (expectedHmac.toString(CryptoES.enc.Base64) !== hmacStr) {
      throw new Error(
        "Decryption failed: HMAC verification failed. Invalid password."
      );
    }

    const decryptedObj = CryptoES.AES.decrypt(encryptedText, key, {
      iv: iv,
      padding: CryptoES.pad.Pkcs7,
    });

    // Check if the decrypted object has valid data
    if (decryptedObj.sigBytes > 0) {
      const decryptedText = decryptedObj.toString(CryptoES.enc.Utf8);
      console.log("Decrypted message:", decryptedText); // Check if the decrypted message is valid

      // if data is loaded and is correct, save password and iterations in secure storage, so user
      // won't have to write it on each change
      await SecureStore.setItem("password", password);
      await SecureStore.setItem("iterations", iterations.toString());

      return decryptedText;
    } else {
      throw new Error("Decryption failed: Invalid password");
    }
  } catch (error) {
    console.error("Error during decryption:", error);
    throw error;
  }
}
