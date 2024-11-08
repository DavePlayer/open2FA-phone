import { createSlice } from "@reduxjs/toolkit";
import {
  fileLoadFullfilled,
  fileLoadPending,
  fileLoadRejected,
} from "./handlers/loadFileHandlers";
import { PlatformServices } from "@/app/types/services";
import { loadFile } from "../../globalThunks/loadFile";

const initialState: PlatformServices[] = [
  {
    name: "google",
    icon: {
      name: "logo-google",
    },
    hash: "213",
  },
  {
    name: "google 2",
    icon: {
      name: "logo-google",
    },
    hash: "2",
  },
];

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //     state.value += action.payload;
    // },
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

// export const { logout } = userSlice.actions;
export default platformsSlice.reducer;
