import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import platformSlice from "./slices/platformsSlice/platformsSlice";
import wrapperSlice from "./slices/wrapperSlice/wrapperSlice";

export const store = configureStore({
  //   reducer: { trees: treesSlice, editedTree: editedTreeSlice, user: userSlice },
  reducer: { platforms: platformSlice, wrapperState: wrapperSlice },
  // middleware used to display state static/async state changes
  //   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
