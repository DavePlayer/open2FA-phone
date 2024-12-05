import { StyleSheet, Image, Platform, View, Text } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import Button from "../components/MainButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootState, useAppDispatch } from "../redux/store";
import { useTranslation } from "react-i18next";
import { handleAddServiceBarcodeData } from "./helperFunctions/handleAddServiceBarcodeData";
import { handleRelayServiceBarcodeData } from "./helperFunctions/handleRelayServiceBarcodeData";
import { useSelector } from "react-redux";

export default function TabTwoScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [AddCameraOn, setAddCameraState] = useState(false);
  const [relayCameraOn, setRelayCameraState] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanLocked, setScanLock] = useState(false);
  const platforms = useSelector((root: RootState) => root.platforms);

  const dispatch = useAppDispatch();

  // ask for permissions to turn on camera for scaning QR codes with 2FA service data
  const handleScan = async () => {
    if (!permission?.granted) await requestPermission();

    console.log("camera permission granted: ", permission);

    setAddCameraState(true);
  };

  // ask for permissions to turn on camera for scaning Relay QR codes
  const handleRelayScan = async () => {
    if (!permission?.granted) await requestPermission();

    console.log("camera permission granted: ", permission);

    setRelayCameraState(true);
  };

  const { t } = useTranslation();
  return (
    <>
      {!AddCameraOn && !relayCameraOn && (
        <SafeAreaView className="bg-bg flex-1 items-center justify-center">
          <View className="h-[50v] flex-1 justify-center items-center border-b-2 border-white">
            <Text className="text-text text-2xl mt-5 justify-self-start text-center">
              {t("qrScanTitle")}
            </Text>
            <Button
              title={t("scanQrCode")}
              className="mt-16"
              handlePress={() => handleScan()}
            ></Button>
          </View>
          <View className="h-[50v] flex-1 justify-center items-center">
            <Text className="text-text text-2xl mt-5 justify-self-start text-center">
              {t("qrScanRelayTitle")}
            </Text>
            <Button
              title={t("scanRelayQrCode")}
              className="mt-16"
              handlePress={() => handleRelayScan()}
            ></Button>
          </View>
        </SafeAreaView>
      )}
      {AddCameraOn && (
        <>
          <CameraView
            // className="flex-1"
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            onBarcodeScanned={(data) =>
              !scanLocked &&
              handleAddServiceBarcodeData(
                data,
                setScanLock,
                setAddCameraState,
                dispatch
              )
            }
          />
          <Button
            className="absolute bottom-0 left-0 right-0"
            title={t("cancelScaning")}
            handlePress={() => setAddCameraState(false)}
          />
        </>
      )}
      {relayCameraOn && (
        <>
          <CameraView
            // className="flex-1"
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            onBarcodeScanned={(data) =>
              !scanLocked &&
              handleRelayServiceBarcodeData(
                data,
                platforms,
                setRelayCameraState,
                setScanLock
              )
            }
          />
          <Button
            className="absolute bottom-0 left-0 right-0"
            title={t("cancelScaning")}
            handlePress={() => setRelayCameraState(false)}
          />
        </>
      )}
    </>
  );
}
