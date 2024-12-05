import {
  addServiceToConfirm,
  PlatformsSliceState,
} from "@/app/redux/slices/platformsSlice/platformsSlice";
import { QrRelaySchema } from "@/app/types/QrRelay";
import { BarcodeScanningResult } from "expo-camera";
import Toast from "react-native-root-toast";
import forge from "node-forge";
import { Dispatch, SetStateAction } from "react";
import * as OTPAuth from "otpauth";

const encryptData = (data: string, publicKeyPem: string): string => {
  const key = forge.pki.publicKeyFromPem(publicKeyPem);

  // Encrypt the data using RSA-OAEP
  const encrypted = key.encrypt(data, "RSA-OAEP");

  return encrypted;
};

// Your handleRelayServiceBarcodeData function remains the same:
export const handleRelayServiceBarcodeData = async (
  scanData: BarcodeScanningResult,
  platforms: PlatformsSliceState,
  setCameraState: Dispatch<SetStateAction<boolean>>,
  setScanLocked: Dispatch<SetStateAction<boolean>>
) => {
  setScanLocked(true);
  setTimeout(() => setScanLocked(false), 2000);
  let { raw } = scanData;

  if (raw) {
    const parsedObj = JSON.parse(raw);
    console.log("parsed object: ", parsedObj);
    try {
      const QrRelayData = QrRelaySchema.parse(parsedObj);
      const publicKeyPem = QrRelayData.publicKey; // Direct PEM key from the QR data

      const matchedPlatform = platforms.platformServices.find(
        (platform) =>
          platform.issuer == QrRelayData.issuer &&
          platform.label == QrRelayData.label
      );

      if (!matchedPlatform) {
        Toast.show("Service not found");
        return setCameraState(false);
      }
      const totp = new OTPAuth.TOTP({
        issuer: matchedPlatform.issuer,
        digits: matchedPlatform.digits,
        label: matchedPlatform.label,
        secret: matchedPlatform.secret,
        period: matchedPlatform.period,
        algorithm: matchedPlatform.algorithm,
      });

      const timeRemaining =
        matchedPlatform.period -
        (Math.floor(Date.now() / 1000) % matchedPlatform.period);

      if (timeRemaining < 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const token = totp.generate();

      console.log("public key (PEM): ", publicKeyPem);

      const encryptedData = encryptData(token, publicKeyPem); // Pass the PEM formatted key

      console.log("encrypted data: ", encryptedData);

      console.log("sending fetch request to: ", QrRelayData.relayUrl);

      const status = await fetch(QrRelayData.relayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          code: encryptedData,
          roomId: QrRelayData.websocketId,
        }),
      });
      if (!status.ok) {
        throw status.statusText;
      }
      console.log("Fetch status: ", status.status);
      setCameraState(false);
    } catch (err) {
      console.error(err);
    }
  }
};
