import { addServiceToConfirm } from "@/app/redux/slices/platformsSlice/platformsSlice";
import { AppDispatch } from "@/app/redux/store";
import { QrRelaySchema } from "@/app/types/QrRelay";
import { PlatformServiceSchema } from "@/app/types/services";
import { BarcodeScanningResult } from "expo-camera";
import { router } from "expo-router";
import { Dispatch, SetStateAction } from "react";
import Toast from "react-native-root-toast";
import forge from "node-forge";

const encryptData = (data: string, base64PublicKey: string): string => {
  // Decode the base64 public key into an ArrayBuffer
  const publicKeyBuffer = forge.util.decode64(base64PublicKey);

  // Convert the ArrayBuffer to a forge public key object
  const key = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(publicKeyBuffer));
  console.log("Forge Public Key:", key);

  // Encrypt the data using RSA-OAEP
  const encrypted = key.encrypt(data, "RSA-OAEP");
  return forge.util.encode64(encrypted); // Return the encrypted data as base64
};

// Your handleRelayServiceBarcodeData function remains the same:
export const handleRelayServiceBarcodeData = async (
  scanData: BarcodeScanningResult,
  setScanLock: Dispatch<SetStateAction<boolean>>,
  setRelayCameraState: Dispatch<SetStateAction<boolean>>,
  dispatch: AppDispatch
) => {
  let { raw } = scanData;

  if (raw) {
    const parsedObj = JSON.parse(raw);
    console.log("parsed object: ", parsedObj);
    try {
      const QrRelayData = QrRelaySchema.parse(parsedObj);
      const publicKeyPem = QrRelayData.publicKey; // Direct PEM key from the QR data

      console.log("public key (PEM): ", publicKeyPem);

      const encryptedData = encryptData("123456", publicKeyPem); // Pass the PEM formatted key
      console.log("encrypted code: ", encryptedData);
    } catch (err) {
      console.error(err);
    }
  }
};
