import { createAsyncThunk } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import toml from "@iarna/toml";
import { FileObject, FileSchema } from "@/app/types/fileObject";
import { Platform } from "react-native";
import { shareAsync } from "expo-sharing";

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

      // Attempt to write content to the file
      await FileSystem.writeAsStringAsync(fileUri, toml.stringify(initialFile));
      console.log(`creating a file with password: ${password}`);
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
