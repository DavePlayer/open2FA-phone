import { StyleSheet, Image, Platform, View, Text } from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState } from "react";
import Button from "../components/MainButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlatformServiceSchema } from "../types/services";
import Toast from "react-native-root-toast";
import { useAppDispatch } from "../redux/store";
import { addServiceToConfirm } from "../redux/slices/platformsSlice/platformsSlice";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabTwoScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraOn, setCameraState] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanLocked, setScanLock] = useState(false);
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleScan = async () => {
    if (!permission?.granted) await requestPermission();

    console.log("camera permission granted: ", permission);

    setCameraState(true);
  };
  const handleBarcodeData = async (scanData: BarcodeScanningResult) => {
    const { data } = scanData;
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
      setCameraState(false);
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
      console.error(err);
    }
  };

  const { t } = useTranslation();
  return (
    <>
      {!cameraOn ? (
        <SafeAreaView className="bg-bg flex-1 items-center justify-center">
          <Text className="text-text text-2xl mt-5 justify-self-start text-center">
            {t("qrScanTitle")}
          </Text>
          <Button
            title={t("scanQrCode")}
            className="mt-16"
            handlePress={() => handleScan()}
          ></Button>
        </SafeAreaView>
      ) : (
        <>
          <CameraView
            // className="flex-1"
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            onBarcodeScanned={(data) => !scanLocked && handleBarcodeData(data)}
          />
          <Button
            className="absolute bottom-0 left-0 right-0"
            title={t("cancelScaning")}
            handlePress={() => setCameraState(false)}
          />
        </>
      )}
    </>
  );
}
