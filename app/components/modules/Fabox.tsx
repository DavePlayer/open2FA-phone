import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import Timer from "./timer";
import { PlatformService } from "@/app/types/services";
import * as OTPAuth from "otpauth";
import Toast from "react-native-root-toast";
import { router } from "expo-router";
import { useAppDispatch } from "@/app/redux/store";
import { showModal } from "@/app/redux/slices/modalSlice/modalSlice";
import * as Haptics from "expo-haptics";

const Fabox = (state: PlatformService) => {
  const dispatch = useAppDispatch();
  const { issuer, digits, period, algorithm, secret, label } = state;
  const totp = new OTPAuth.TOTP({
    issuer,
    label,
    algorithm,
    digits,
    period,
    secret,
  });

  const labelMaxLength = 35;

  const calculateTimeLeft = () =>
    period - (Math.floor(Date.now() / 1000) % period);
  const generateNewToken = () => totp.generate();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [token, setToken] = useState(generateNewToken());

  useEffect(() => {
    // for some weird reason without this line being here codes seem to not match for first generated period
    // times jumps long distances at the start
    // this useEffect seems to fix everything after either period or totp change
    setToken(generateNewToken());

    const id = setInterval(() => {
      const remainingTime = calculateTimeLeft();
      setTimeLeft(remainingTime);

      // Generate a new token when the period resets
      if (remainingTime === period) {
        setToken(generateNewToken());
      }
    }, 1000);

    return () => clearInterval(id);
  }, [period, totp]);

  return (
    <TouchableOpacity
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        dispatch(showModal(state));
      }}
    >
      <View className="w-full p-5 flex flex-row items-center mt-5">
        <TabBarIcon className="" name="logo-google" color="#fff" />
        <View className="grow px-4 flex relative justify-center">
          <Text className="text-text text-sm absolute mb-5 left-4 top-[-25]">
            {issuer}
          </Text>
          <Text className="text-text text-sm absolute mb-5 left-4 bottom-[-30]">
            {label.length > labelMaxLength
              ? label.substring(0, labelMaxLength) + "..."
              : label}
          </Text>
          <Text className="text-text text-5xl">
            {token.replace(/.{3}/g, "$& ")}
          </Text>
        </View>
        <Timer time={timeLeft} />
      </View>
    </TouchableOpacity>
  );
};

export default Fabox;
