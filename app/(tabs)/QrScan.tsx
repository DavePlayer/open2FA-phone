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
import { z } from "zod";
import { PlatformServicesSchema } from "../types/services";
import Toast from "react-native-root-toast";
import { useAppDispatch } from "../redux/store";
import { addService } from "../redux/slices/platformsSlice/platformsSlice";

export default function TabTwoScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraOn, setCameraState] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanLocked, setScanLock] = useState(false);

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
      const serviceObj = await PlatformServicesSchema.parseAsync(typedDataObj);

      // TODO window for accepting scanned service
      await dispatch(addService(serviceObj));
    } catch (error) {
      const err = error as Error;
      console.error(err);
    }
  };
  return (
    <>
      {!cameraOn ? (
        <SafeAreaView className="bg-bg flex-1 items-center justify-center">
          <Text className="text-text text-2xl mt-5 justify-self-start">
            Scan the QR code on the website where you are enabling 2FA
          </Text>
          <Button
            title="Scan QR code"
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
            title="Cancel Scaning"
            handlePress={() => setCameraState(false)}
          />
        </>
      )}
    </>
  );
}
