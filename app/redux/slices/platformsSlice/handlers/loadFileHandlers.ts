import { FileObject } from "@/app/types/fileObject";
import { PlatformServices } from "@/app/types/services";
import { PayloadAction } from "@reduxjs/toolkit";

export const fileLoadPending = (
  state: PlatformServices[],
  action: PayloadAction<undefined>
) => {
  console.log("reading file");
};

export const fileLoadFullfilled = (
  state: PlatformServices[],
  action: PayloadAction<FileObject>
) => {
  console.log(`file loaded: ${JSON.stringify(action.payload, null, 4)}`);

  // temporary solution. handling loading after decryption option
  return action.payload.platforms;
};

export const fileLoadRejected = (
  state: PlatformServices[],
  action: PayloadAction<any>
) => {
  console.error(action.payload);
};
