import { createAsyncThunk } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import toml from "@iarna/toml";
import { z } from "zod";
import { FileSchema } from "@/app/types/fileObject";

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
      const data = toml.parse(fileText);

      const parsedData = await FileSchema.parseAsync(data);

      return parsedData;
    } catch (error: unknown) {
      const err = error as Error;
      throw err; // This will trigger the rejected case
    }
  }
);
