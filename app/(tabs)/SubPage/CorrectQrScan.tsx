import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlatformServiceSchema } from "@/app/types/services";
import Button from "@/app/components/MainButton";
import { RootState, useAppDispatch } from "@/app/redux/store";
import {
  addService,
  clearServiceToConfirm,
} from "@/app/redux/slices/platformsSlice/platformsSlice";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { saveToFile } from "@/app/redux/globalThunks/saveToFile";
import { useTranslation } from "react-i18next";
import i18n from "@/app/utils/i18n";

type StringifiedState = {
  issuer: string;
  secret: string;
  period: string; // Use string here for compatibility
  digits: string; // Use string here for compatibility
  algorithm: string;
  otpType: string;
  label: string;
};

const CorrectQrScan = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { serviceToConfirm, platformServices } = useSelector(
    (root: RootState) => root.platforms
  );

  const { t } = useTranslation();

  const confirm = async () => {
    if (!serviceToConfirm) {
      Toast.show({
        type: "error",
        text1: t("confirmQrScanError"),
        text2: t("confirmQrScanErrorDetail1"),
      });
      return;
    }
    try {
      const existingServiceIndex = platformServices.findIndex(
        (platform) => platform.secret === serviceToConfirm.secret
      );
      if (existingServiceIndex !== -1)
        return Toast.show({
          type: "error",
          text1: i18n.t("serviceAddonError"),
          text2: i18n.t("serviceAddonSecretError"),
        });

      dispatch(addService(serviceToConfirm));

      await dispatch(saveToFile());

      dispatch(clearServiceToConfirm());

      router.navigate("/(tabs)/HomeScreen");
    } catch (error) {
      const err = error as Error;
      console.error(err);
    }
  };

  const cancel = () => {
    router.navigate("/(tabs)/QrScan");
  };

  return (
    <View className="p-5 flex-1 flex-col">
      <Text className="text-text text-center text-3xl my-10">
        {t("ConfirmScanTitle")}
      </Text>

      <Text className="text-text text-lg my-3">
        {t("issuer")}:{" "}
        {serviceToConfirm ? serviceToConfirm.issuer : "undefined"}
      </Text>
      <Text className="text-text text-lg my-3">
        {t("refreshPeriod")}:{" "}
        {serviceToConfirm ? serviceToConfirm.period : "undefined"}
      </Text>
      <Text className="text-text text-lg my-3">
        {t("hashAlgorithm")}:{" "}
        {serviceToConfirm ? serviceToConfirm.algorithm : "undefined"}
      </Text>
      <Text className="text-text text-lg my-3">
        {t("label")}: {serviceToConfirm ? serviceToConfirm.label : "undefined"}
      </Text>
      <Text className="text-text text-lg my-3">
        {t("generatedDigitsLength")}:{" "}
        {serviceToConfirm ? serviceToConfirm.digits : "undefined"}
      </Text>

      <View className="flex-grow flex justify-end items-center">
        <Button handlePress={() => confirm()} className="mb-5 w-full">
          {t("confirm")}
        </Button>
        <Button handlePress={() => cancel()} className="mb-10 w-full">
          {t("cancel")}
        </Button>
      </View>
    </View>
  );
};

export default CorrectQrScan;
