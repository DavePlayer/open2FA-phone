import { FileObject } from "@/app/types/fileObject";
import { PayloadAction } from "@reduxjs/toolkit";

export const fileLoadPending = () => {
  console.log("fileLoadPending dispatched");
  return true;
};

export const fileLoadFullfilled = () => {
  return false;
};

export const fileLoadRejected = () => {
  return false;
};
