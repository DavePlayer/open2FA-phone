import { createAsyncThunk } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import toml from "@iarna/toml";
import { z } from "zod";
import { FileSchema } from "@/app/types/fileObject";
import * as Crypto from "expo-crypto";

// Decrypt function to verify the integrity of the encrypted text
async function decrypt(
  password: string,
  encryptedText: string
): Promise<string> {
  try {
    console.log("Starting decryption function");

    // Extract the salt (first 32 characters for the 16-byte hex salt) and the actual encrypted hash
    const saltHex = encryptedText.slice(0, 32);
    const storedHash = encryptedText.slice(32);
    console.log("Extracted salt:", saltHex);

    // Recreate the salt
    const salt = Buffer.from(saltHex, "hex");

    // Recreate the hash with password, salt, and text
    const recreatedHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password + Array.from(salt).toString()
    );

    console.log("Recreated hash:", recreatedHash);

    // Compare the recreated hash with the stored hash
    if (recreatedHash === storedHash) {
      console.log("Hashes match, decryption successful.");
      return recreatedHash; // This is essentially the decrypted text in this scheme
    } else {
      console.error("Hash mismatch, decryption failed.");
      return "";
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
