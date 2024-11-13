import { createAsyncThunk } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import toml from "@iarna/toml";
import { z } from "zod";
import { FileSchema } from "@/app/types/fileObject";
import * as Crypto from "expo-crypto";
import CryptoES from "crypto-es";
import { Buffer } from "buffer";

// Helper to derive a key with PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<string> {
  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + Array.from(salt).toString()
  );
  return key;
}

// Decrypt function to verify the integrity of the encrypted text
async function decrypt(
  password: string,
  encryptedFileText: string
): Promise<string> {
  try {
    console.log(`Starting decryption function, password: ${password}`);

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

    console.log("Decrypted object:", decryptedObj);

    // Check if the decrypted object has valid data
    if (decryptedObj.sigBytes > 0) {
      const decryptedText = decryptedObj.toString(CryptoES.enc.Utf8);
      console.log("Decrypted message:", decryptedText); // Check if the decrypted message is valid
      return decryptedText;
    } else {
      throw new Error("Decryption failed: Invalid password");
    }
  } catch (error) {
    console.error("Error during decryption:", error);
    throw error;
  }
}

export const loadFile = createAsyncThunk(
  "app/loadFile",
  async ({ uri, password }: { uri: string; password: string }) => {
    try {
      // Read the file content
      const fileText = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log("File text:\n", fileText); // works, YAY

      const decryptedFileText = await decrypt(password, fileText);
      console.log(`decrypted file: ${decryptedFileText}`);
      const data = toml.parse(decryptedFileText);

      const parsedData = await FileSchema.parseAsync(data);

      return parsedData;
    } catch (error: unknown) {
      const err = error as Error;
      throw err; // This will trigger the rejected case
    }
  }
);
