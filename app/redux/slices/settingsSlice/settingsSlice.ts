import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fileLoadFullfilled,
  fileLoadPending,
  fileLoadRejected,
} from "./handlers/loadFileHandlers";
import { loadFile } from "../../globalThunks/loadFile";

// example code:
// otpauth://totp/OmegaLoveIssac:1?secret=AYPWCSJSIFLVYMD7&period=30&digits=6&algorithm=SHA1&issuer=OmegaLoveIssac

export interface SettingsSliceState {
  fileName: string;
}

const initialState: SettingsSliceState = {
  fileName: "",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
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

export const {} = settingsSlice.actions;
export default settingsSlice.reducer;
