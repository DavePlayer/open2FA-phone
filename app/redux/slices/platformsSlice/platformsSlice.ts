import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fileLoadFullfilled,
  fileLoadPending,
  fileLoadRejected,
} from "./handlers/loadFileHandlers";
import { PlatformServices } from "@/app/types/services";
import { loadFile } from "../../globalThunks/loadFile";

// example code:
// otpauth://totp/OmegaLoveIssac:1?secret=AYPWCSJSIFLVYMD7&period=30&digits=6&algorithm=SHA1&issuer=OmegaLoveIssac

const initialState: PlatformServices[] = [
  {
    issuer: "google",
    icon: {
      name: "logo-google",
    },
    secret: "213",
    algorithm: "sha1",
    digits: 6,
    period: 30,
    otpType: "tmp",
    label: "tmp",
  },
  {
    issuer: "google 2",
    icon: {
      name: "logo-google",
    },
    secret: "123",
    algorithm: "sha1",
    digits: 6,
    period: 30,
    otpType: "tmp",
    label: "tmp",
  },
];

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    addService: (state, action: PayloadAction<PlatformServices>) => {
      return [...state, action.payload];
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

export const { addService } = platformsSlice.actions;
export default platformsSlice.reducer;
