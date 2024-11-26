import { createAsyncThunk } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import toml from "@iarna/toml";
import { FileObject, FileSchema } from "@/app/types/fileObject";
import { Platform } from "react-native";
import { shareAsync } from "expo-sharing";
import * as Crypto from "expo-crypto";
import { encrypt } from "./helpers/encrypt";

// Helper to derive a key with PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<string> {
  const key = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + Array.from(salt).toString()
  );
  return key;
}

const initialFile: FileObject = {
  platformServices: [],
  settings: {},
};

export const createFile = createAsyncThunk(
  "app/createFile",
  async ({
    password,
    iterations,
  }: {
    password: string;
    iterations: number;
  }) => {
    try {
      let fileUri = FileSystem.documentDirectory + "database.2fa";

      console.log("before encrypt function");

      const encryptedFileText = await encrypt(
        password,
        toml.stringify(initialFile),
        iterations
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
