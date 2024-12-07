import { createSlice } from "@reduxjs/toolkit";
import { loadFile } from "../../globalThunks/loadFile";
import { saveToFile } from "../../globalThunks/saveToFile";
import { createFile } from "../../globalThunks/createFile";
import { PlatformService } from "@/app/types/services";

const initialPlatform: PlatformService = {
  algorithm: "",
  digits: NaN,
  issuer: "",
  label: "",
  otpType: "",
  period: NaN,
  secret: "",
};

const initialState = {
  showState: false,
  platformEdited: initialPlatform,
};

const modalSlice = createSlice({
  name: "Modal",
  initialState: initialState,
  reducers: {
    showModal: (_, action) => {
      return {
        platformEdited: action.payload,
        showState: true,
      };
    },
    hideModal: () => {
      return {
        platformEdited: initialPlatform,
        showState: false,
      };
    },
  },
});

export const { hideModal, showModal } = modalSlice.actions;
export default modalSlice.reducer;
