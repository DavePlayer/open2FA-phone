import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { PlatformServices } from "@/app/types/services";

type StringifiedState = {
  issuer: string;
  secret: string;
  period: string; // Use string here for compatibility
  digits: string; // Use string here for compatibility
  algorithm: string;
  otpType: string;
  label: string;
  icon: string; // Make sure icon is a string
};

const CorrectQrScan = () => {
  const platformData = useLocalSearchParams<StringifiedState>();
  console.log(platformData);
  return (
    <View className="p-5">
      <Text className="text-text text-center text-3xl my-10">
        Confirm Scaned Data
      </Text>

      <Text className="text-text text-lg my-3">
        Issuer: {platformData.issuer}
      </Text>
      <Text className="text-text text-lg my-3">
        Refresh period: {platformData.period}
      </Text>
      <Text className="text-text text-lg my-3">
        Hash algorithm: {platformData.algorithm}
      </Text>
      <Text className="text-text text-lg my-3">
        Label: {platformData.label}
      </Text>
      <Text className="text-text text-lg my-3">
        Generated digits length: {platformData.digits}
      </Text>
    </View>
  );
};

export default CorrectQrScan;
