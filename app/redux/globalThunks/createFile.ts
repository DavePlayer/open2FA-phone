import { createAsyncThunk } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import toml from "@iarna/toml";
import { FileObject, FileSchema } from "@/app/types/fileObject";
import { Platform } from "react-native";
import { shareAsync } from "expo-sharing";
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

const encodeBase64 = (bytes: Uint8Array): string => {
  return btoa(String.fromCharCode(...bytes));
};

CryptoES.pad.NoPadding = { pad: function () {}, unpad: function () {} };

// Encrypt function using HMAC (or another encryption function, as AES is unsupported directly in expo-crypto)
async function encrypt(
  password: string,
  textToEncrypt: string
): Promise<string> {
  console.log("Start encrypt function");

  // Using a static key and iv for testing purposes
  const key = CryptoES.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
  const iv = CryptoES.enc.Hex.parse("00000000000000000000000000000000");
  const salt = CryptoES.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");

  console.log("Key:", key);
  console.log("IV:", iv);
  console.log("Salt:", salt);

  // Encrypt the text using AES
  const encrypted = CryptoES.AES.encrypt(textToEncrypt, key, {
    iv: iv,
    padding: CryptoES.pad.Pkcs7, // Use Pkcs7 padding
  });

  const encryptedText = encrypted.toString() || ""; // Ensure ciphertext is in Base64
  console.log("Encrypted message:", encryptedText);

  // Return salt (Base64) + encrypted text
  const saltStr = salt.toString(CryptoES.enc.Base64);
  return saltStr + "$" + encryptedText;
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
