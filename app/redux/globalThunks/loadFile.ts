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
    console.log("Starting decryption function");

    // Extract the salt (Base64) and the actual encrypted hash
    const [iv, encryptedText] = encryptedFileText.split("$");

    // Convert the Base64 salt back to a Uint8Array using Buffer
    // const salt: Uint8Array = new Uint8Array(Buffer.from(saltBase64, "base64"));

    // console.log("Extracted salt:", salt);
    console.log("Extracted iv:", iv);

    // const key = await deriveKey(password, salt); // Use the same key derivation

    // const ivWord = CryptoES.enc.Base64.parse(iv);
    // const ivobj = JSON.parse(iv);
    // let ivWord = CryptoES.lib.WordArray.create();
    // ivWord.sigBytes = ivobj.sigBytes;
    // ivWord.words = ivobj.words;

    var key = CryptoES.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
    var ivWord = CryptoES.enc.Hex.parse("00000000000000000000000000000000");
    var salt = CryptoES.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");

    console.log("Extracted iv word:", ivWord);
    const decryptedObj = CryptoES.AES.decrypt(encryptedText.toString(), key, {
      salt,
      iv: ivWord,
      padding: CryptoES.pad.Pkcs7,
    });

    console.log("Decrypted object:", decryptedObj);

    // Check if the decrypted object has valid data
    if (decryptedObj.sigBytes > 0) {
      const decryptedText = decryptedObj.toString(CryptoES.enc.Utf8);
      console.log("Decrypted message:", decryptedText); // Check if the decrypted message is valid
      return decryptedText;
    } else {
      throw new Error("Decryption failed: Invalid decrypted object");
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

      //----------------------------------------
      // TODO -> Decryption of the file
      //----------------------------------------
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
