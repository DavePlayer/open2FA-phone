import i18n from "@/app/utils/i18n";
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
      let err = new Error(i18n.t("fileDecryptError1"));
      err.name = i18n.t("fileError");
      throw err;
    }

    if (expectedHmac.toString(CryptoES.enc.Base64) !== hmacStr) {
      let err = new Error(i18n.t("fileDecryptionHmacError"));
      err.name = i18n.t("fileDecryptionInvalidPassword");
      throw err;
    }

    const decryptedObj = CryptoES.AES.decrypt(encryptedText, key, {
      iv: iv,
      padding: CryptoES.pad.Pkcs7,
    });

    const decryptedText = decryptedObj.toString(CryptoES.enc.Utf8);
    console.log("Decrypted message:", decryptedText); // Check if the decrypted message is valid

    await SecureStore.setItem("password", password);
    await SecureStore.setItem("iterations", iterations.toString());

    return decryptedText;
  } catch (error) {
    // console.error("Error during decryption:", error);
    throw error;
  }
}
