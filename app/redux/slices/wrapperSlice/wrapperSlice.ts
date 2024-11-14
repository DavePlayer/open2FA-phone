import { createSlice } from "@reduxjs/toolkit";
import { PlatformServices } from "@/app/types/services";
import { loadFile } from "../../globalThunks/loadFile";

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
  extraReducers: (builder) => {},
});

export const { showWrapper, hideWrapper } = wrapperSlice.actions;
export default wrapperSlice.reducer;
