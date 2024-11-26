import { createAsyncThunk } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import toml from "@iarna/toml";
import { z } from "zod";
import { FileSchema } from "@/app/types/fileObject";
import * as Crypto from "expo-crypto";
import { decrypt } from "./helpers/decrypt";

// Helper to derive a key with PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<string> {
  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + Array.from(salt).toString()
  );
  return key;
}

export const loadFile = createAsyncThunk(
  "app/loadFile",
  async ({
    uri,
    password,
    fileName,
  }: {
    uri: string;
    password: string;
    fileName: string;
  }) => {
    console.log(`reading file\npath:${uri}\nfile name: ${fileName}`);
    try {
      const fileText = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log("File text:\n", fileText);

      const decryptedFileText = await decrypt(password, fileText);
      console.log(`decrypted file: ${decryptedFileText}`);
      const data = toml.parse(decryptedFileText);

      const parsedData = await FileSchema.parseAsync(data);

      if (parsedData.settings) {
        parsedData.settings.fileName = fileName;
        // this is bad and no no
        // parsedData.settings.password = password;
      } else {
        parsedData.settings = {
          fileName,
        };
      }

      return parsedData;
    } catch (error: unknown) {
      const err = error as Error;
      throw err; // This will trigger the rejected case
    }
  }
);
