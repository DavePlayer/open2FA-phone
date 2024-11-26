import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import toml from "@iarna/toml";
import * as FileSystem from "expo-file-system";
import { encrypt } from "./helpers/encrypt";
import * as SecureStore from "expo-secure-store";
import { shareAsync } from "expo-sharing";

export const saveToFile = createAsyncThunk(
  "app/saveStoreToFile",
  async (_, { getState }) => {
    const state = getState() as RootState;

    // Combine data from multiple slices here
    const dataToSave = {
      platformServices: state.platforms.platformServices,
    };

    const filePath = FileSystem.documentDirectory + state.settings.fileName;

    console.log("settings: ", state.settings);
    console.log("saving temp file to: ", filePath);

    try {
      const tomlData = await toml.stringify(dataToSave);
      const password = await SecureStore.getItemAsync("password");
      const iterations = await SecureStore.getItemAsync("iterations");
      if (!password || !iterations)
        throw new Error("password or iterations not found in secureStore");
      const iterationsInt = parseInt(iterations);
      if (!iterationsInt)
        throw new Error("failed to convert iterations from string to number");
      await FileSystem.writeAsStringAsync(
        filePath,
        await encrypt(password, tomlData, iterationsInt)
      );

      // Would have to eject completly from expo to do it normaly
      // Expo is sandboxed making it impossible to save file directly to external storage
      // it is very incovinient, but works
      await shareAsync(filePath, {
        dialogTitle: "Save File Again",
      });

      return;
    } catch (error) {
      console.error("Failed to save file:", error);
      throw error; // You may want to handle this error more gracefully
    }
  }
);
