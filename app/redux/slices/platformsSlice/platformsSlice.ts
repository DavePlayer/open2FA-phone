import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fileLoadFullfilled,
  fileLoadPending,
  fileLoadRejected,
} from "./handlers/loadFileHandlers";
import { PlatformService } from "@/app/types/services";
import { loadFile } from "../../globalThunks/loadFile";

// example code:
// otpauth://totp/OmegaLoveIssac:1?secret=AYPWCSJSIFLVYMD7&period=30&digits=6&algorithm=SHA1&issuer=OmegaLoveIssac

export interface PlatformsSliceState {
  platformServices: PlatformService[];
  serviceToConfirm?: PlatformService;
}

const initialState: PlatformsSliceState = {
  platformServices: [],
};

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    addService: (state, action: PayloadAction<PlatformService>) => {
      return {
        ...state,
        platformServices: [...state.platformServices, action.payload],
      };
    },
    deleteService: (state, action: PayloadAction<PlatformService>) => {
      return {
        ...state,
        platformServices: state.platformServices.filter(
          (platform) => platform.label != action.payload.label
        ),
      };
    },
    clearServiceToConfirm: (state) => {
      return {
        ...state,
        serviceToConfirm: undefined,
      };
    },
    addServiceToConfirm: (state, action: PayloadAction<PlatformService>) => {
      return {
        ...state,
        serviceToConfirm: action.payload,
      };
    },
    clearPlatforms: () => {
      return initialState;
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

export const {
  addService,
  addServiceToConfirm,
  clearPlatforms,
  clearServiceToConfirm,
  deleteService,
} = platformsSlice.actions;
export default platformsSlice.reducer;
