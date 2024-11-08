import { createAsyncThunk } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import toml from "@iarna/toml";
import { FileObject, FileSchema } from "@/app/types/fileObject";
import { Platform } from "react-native";
import { shareAsync } from "expo-sharing";
import * as Crypto from "expo-crypto";

// Helper to derive a key with PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<string> {
  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + Array.from(salt).toString()
  );
  return key;
}

const encodeBase64 = (bytes: Uint8Array): string => {
  return btoa(String.fromCharCode(...bytes));
};

// Encrypt function using HMAC (or another encryption function, as AES is unsupported directly in expo-crypto)
async function encrypt(
  password: string,
  textToEncrypt: string
): Promise<string> {
  console.log("Start encrypt function");

  // Generate a random salt
  const salt = await Crypto.getRandomBytesAsync(16);
  console.log("Generated salt:", salt);

  // Derive a key using the password and salt
  const key = await deriveKey(password, salt);
  console.log("Derived key:", key);

  console.log("Encrypting message");

  // Encrypt the text by hashing it with the derived key
  const encrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    textToEncrypt + key
  );
  console.log("Encrypted message:", encrypted);

  // Convert salt to base64 manually (using a TextEncoder)
  const saltBase64 = encodeBase64(salt);

  // Combine salt (Base64) and ciphertext
  const encryptedTextWithSalt = saltBase64 + encrypted.base64;

  return encryptedTextWithSalt;
}

const initialFile: FileObject = {
  platforms: [],
  settings: {
    test: "test",
  },
};

export const createFile = createAsyncThunk(
  "app/createFile",
  async ({ password }: { password: string }) => {
    try {
      let fileUri = FileSystem.documentDirectory + "database.2fa";

      console.log("before encrypt function");

      const encryptedFileText = await encrypt(
        password,
        toml.stringify(initialFile)
      );

      await FileSystem.writeAsStringAsync(fileUri, encryptedFileText);
      console.log("created file text: ", encryptedFileText);

      console.log("File created and written at", fileUri);

      if (Platform.OS === "ios") {
        // For iOS, we check if the file actually exists
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          throw new Error("File doesn't exist at the specified URI");
        }
      }

      await shareAsync(fileUri, {
        dialogTitle: "Save File",
      });
    } catch (error: unknown) {
      const err = error as Error;
      throw err; // This will trigger the rejected case
    }
  }
);
