import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlatformServiceSchema } from "@/app/types/services";
import Button from "@/app/components/MainButton";
import { RootState, useAppDispatch } from "@/app/redux/store";
import { addService } from "@/app/redux/slices/platformsSlice/platformsSlice";
import { useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { saveToFile } from "@/app/redux/globalThunks/saveToFile";

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
  const { serviceToConfirm } = useSelector((root: RootState) => root.platforms);

  const confirm = async () => {
    if (!serviceToConfirm) {
      Toast.show("No temporary object to add to your platforms list");
      return;
    }
    try {
      console.log(serviceToConfirm);

      dispatch(addService(serviceToConfirm));

      await dispatch(saveToFile());

      router.navigate("/(tabs)");
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
        Confirm Scaned Data
      </Text>

      <Text className="text-text text-lg my-3">
        Issuer: {serviceToConfirm ? serviceToConfirm.issuer : "undefined"}
      </Text>
      <Text className="text-text text-lg my-3">
        Refresh period:{" "}
        {serviceToConfirm ? serviceToConfirm.period : "undefined"}
      </Text>
      <Text className="text-text text-lg my-3">
        Hash algorithm:{" "}
        {serviceToConfirm ? serviceToConfirm.algorithm : "undefined"}
      </Text>
      <Text className="text-text text-lg my-3">
        Label: {serviceToConfirm ? serviceToConfirm.label : "undefined"}
      </Text>
      <Text className="text-text text-lg my-3">
        Generated digits length:{" "}
        {serviceToConfirm ? serviceToConfirm.digits : "undefined"}
      </Text>

      <View className="flex-grow flex justify-end items-center">
        <Button handlePress={() => confirm()} className="mb-5 w-full">
          Confirm
        </Button>
        <Button handlePress={() => cancel()} className="mb-10 w-full">
          Cancel
        </Button>
      </View>
    </View>
  );
};

export default CorrectQrScan;
