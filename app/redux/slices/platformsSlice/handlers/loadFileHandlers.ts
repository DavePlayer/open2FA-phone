import { FileObject } from "@/app/types/fileObject";
import { PlatformService } from "@/app/types/services";
import { PayloadAction } from "@reduxjs/toolkit";
import { PlatformsSliceState } from "../platformsSlice";

export const fileLoadPending = (
  state: PlatformsSliceState,
  action: PayloadAction<undefined>
) => {
  console.log("reading file");
};

export const fileLoadFullfilled = (
  state: PlatformsSliceState,
  action: PayloadAction<FileObject>
) => {
  console.log(`file loaded: ${JSON.stringify(action.payload, null, 4)}`);

  return {
    ...state,
    platformServices: action.payload.platformServices,
  };
};

export const fileLoadRejected = (state: PlatformsSliceState, action: any) => {
  // console.error(action.error.message);
  return state;
};
