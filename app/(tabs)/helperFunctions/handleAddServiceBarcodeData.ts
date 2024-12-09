import { addServiceToConfirm } from "@/app/redux/slices/platformsSlice/platformsSlice";
import { AppDispatch } from "@/app/redux/store";
import { PlatformServiceSchema } from "@/app/types/services";
import { BarcodeScanningResult } from "expo-camera";
import { router } from "expo-router";
import { Dispatch, SetStateAction } from "react";
import Toast from "react-native-toast-message";

export const handleAddServiceBarcodeData = async (
  scanData: BarcodeScanningResult,
  setScanLock: Dispatch<SetStateAction<boolean>>,
  setAddCameraState: Dispatch<SetStateAction<boolean>>,
  dispatch: AppDispatch
) => {
  let { data } = scanData;
  console.log(data);
  data = decodeURIComponent(data); // handle special characters like @ in label which may contain email

  setScanLock(true);
  setTimeout(() => setScanLock(false), 2000);
  console.log(data);

  const [otpauthPart, queryParams] = data.split("?");

  const otpauthRegex = /^otpauth:\/\/([^/]+)\/(.+)/;
  const match = otpauthPart.match(otpauthRegex);

  const otpType = match ? match[1] : null; // e.g., 'totp'
  const label = match ? match[2] : null; // e.g., 'OmegaLoveIssac:1'

  const params = new URLSearchParams(queryParams);
  const dataObj = Object.fromEntries(params.entries());

  const typedDataObj = {
    otpType: otpType ?? "",
    label: label ?? "",
    secret: dataObj.secret ?? "",
    period: dataObj.period ? parseInt(dataObj.period, 10) : 30, // Default to 30 if not present
    digits: dataObj.digits ? parseInt(dataObj.digits, 10) : 6, // Default to 6 if not present
    algorithm: dataObj.algorithm ?? "SHA1",
    issuer: dataObj.issuer ?? undefined,
  };

  try {
    const serviceObj = await PlatformServiceSchema.parseAsync(typedDataObj);

    // TODO window for accepting scanned service
    await dispatch(addServiceToConfirm(serviceObj));
    setAddCameraState(false);
    router.navigate({
      pathname: "/(tabs)/SubPage/CorrectQrScan",
      // every param must be a string. after that it must be converted back to numbers...
      // I start considering adding tempPlatformObjToConfirm in redux slice
      params: {
        otpType: otpType ?? "",
        label: label ?? "",
        secret: dataObj.secret ?? "",
        period: dataObj.period ? parseInt(dataObj.period, 10) : 30,
        digits: dataObj.digits ? parseInt(dataObj.digits, 10) : 6,
        algorithm: dataObj.algorithm ?? "SHA1",
        issuer: dataObj.issuer ?? undefined,
      },
    });
  } catch (error) {
    const err = error as Error;
    Toast.show({
      type: "error",
      text1: "Invalid QR Code",
    });
    // console.error(err);
  }
};
