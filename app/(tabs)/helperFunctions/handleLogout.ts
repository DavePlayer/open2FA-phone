import { clearPlatforms } from "@/app/redux/slices/platformsSlice/platformsSlice";
import { clearSettings } from "@/app/redux/slices/settingsSlice/settingsSlice";
import { AppDispatch } from "@/app/redux/store";
import { Router } from "expo-router";

export const logout = ({
  dispatch,
  router,
}: {
  dispatch: AppDispatch;
  router: Router;
}) => {
  dispatch(clearPlatforms());
  dispatch(clearSettings());
  router.push("/");
};
