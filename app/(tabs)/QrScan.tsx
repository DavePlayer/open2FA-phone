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

export default function TabTwoScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraOn, setCameraState] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanLocked, setScanLock] = useState(false);
  const handleScan = async () => {
    if (!permission?.granted) await requestPermission();

    console.log("camera permission granted: ", permission);

    setCameraState(true);
  };
  const handleBarcodeData = (scanData: BarcodeScanningResult) => {
    const { data } = scanData;
    setScanLock(true);
    setTimeout(() => setScanLock(false), 2000);
    console.log(data);
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
