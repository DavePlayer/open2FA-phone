import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fileLoadFullfilled,
  fileLoadPending,
  fileLoadRejected,
} from "./handlers/loadFileHandlers";
import { loadFile } from "../../globalThunks/loadFile";
import * as SecureStore from "expo-secure-store";

// example code:
// otpauth://totp/OmegaLoveIssac:1?secret=AYPWCSJSIFLVYMD7&period=30&digits=6&algorithm=SHA1&issuer=OmegaLoveIssac

export interface SettingsSliceState {
  fileName: string;
  language?: string;
}

const initialState: SettingsSliceState = {
  fileName: "",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      SecureStore.setItem("language", action.payload);
      return {
        ...state,
        language: action.payload,
      };
    },
    clearSettings: (state) => {
      return {
        ...state,
        fileName: "",
      };
    },
  },
  extraReducers: (builder) => {
    // ---------------------
    // Load File
    // ---------------------
    builder.addCase(loadFile.pending, (state, action) =>
      fileLoadPending(state, action)
    );
    builder.addCase(loadFile.fulfilled, fileLoadFullfilled);
    builder.addCase(loadFile.rejected, fileLoadRejected);
  },
});

export const { setLanguage, clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
