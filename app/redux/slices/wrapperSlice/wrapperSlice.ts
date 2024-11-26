import { createSlice } from "@reduxjs/toolkit";
import { loadFile } from "../../globalThunks/loadFile";
import {
  fileLoadFullfilled,
  fileLoadPending,
  fileLoadRejected,
} from "./handlers/handleFileFunctions";
import { saveToFile } from "../../globalThunks/saveToFile";
import { createFile } from "../../globalThunks/createFile";

const wrapperSlice = createSlice({
  name: "platforms",
  initialState: false,
  reducers: {
    showWrapper: (state) => {
      return true;
    },
    hideWrapper: (state) => {
      return false;
    },
  },
  extraReducers: (builder) => {
    // ---------------------
    // Load File
    // ---------------------
    builder.addCase(loadFile.pending, fileLoadPending);
    builder.addCase(loadFile.fulfilled, fileLoadFullfilled);
    builder.addCase(loadFile.rejected, fileLoadRejected);
    // ---------------------
    // Save File
    // ---------------------
    builder.addCase(saveToFile.pending, fileLoadPending);
    builder.addCase(saveToFile.fulfilled, fileLoadFullfilled);
    builder.addCase(saveToFile.rejected, fileLoadRejected);
    // ---------------------
    // Save File
    // ---------------------
    builder.addCase(createFile.pending, fileLoadPending);
    builder.addCase(createFile.fulfilled, fileLoadFullfilled);
    builder.addCase(createFile.rejected, fileLoadRejected);
  },
});

export const { showWrapper, hideWrapper } = wrapperSlice.actions;
export default wrapperSlice.reducer;
