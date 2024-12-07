import { FileObject } from "@/app/types/fileObject";
import { PayloadAction } from "@reduxjs/toolkit";
import { SettingsSliceState } from "../settingsSlice";

export const fileLoadPending = (
  state: SettingsSliceState,
  action: PayloadAction<undefined>
) => {
  console.log("reading file");
};

export const fileLoadFullfilled = (
  state: SettingsSliceState,
  action: PayloadAction<FileObject>
) => {
  const { settings } = action.payload;
  console.log("loaded these settings");
  state.fileName = settings?.fileName || "";
};

export const fileLoadRejected = (state: SettingsSliceState, action: any) => {
  // console.error(action.error.message);
  return state;
};
