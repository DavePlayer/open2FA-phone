import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import Timer from "./timer";
import { PlatformService } from "@/app/types/services";
import * as OTPAuth from "otpauth";

const Fabox = ({
  issuer,
  digits,
  period,
  algorithm,
  secret,
  label,
}: PlatformService) => {
  const totp = new OTPAuth.TOTP({
    issuer,
    label,
    algorithm,
    digits,
    period,
    secret,
  });

  const generateNewToken = () => {
    return totp.generate();
  };

  const labelMaxLenth = 35;

  const [timeLeft, setTimeLeft] = useState(
    period - (Math.floor(Date.now() / 1000) % period)
  );
  const [token, setToken] = useState(generateNewToken());

  useEffect(() => {
    const id = setInterval(() => {
      // Calculate the time left until the next TOTP period
      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = period - (currentTime % period);

      setTimeLeft(remainingTime);

      // When remainingTime is equal to the period, generate a new token
      if (remainingTime === period) {
        const newToken = generateNewToken();
        setToken(newToken);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(id);
  }, [period, totp]);

  return (
    <View className="w-full p-5 flex flex-row items-center mt-5">
      <TabBarIcon className="" name="logo-google" color="#fff" />
      <View className="grow px-4 flex relative justify-center">
        <Text className="text-text text-sm absolute mb-5 left-4 top-[-25]">
          {issuer}
        </Text>
        <Text className="text-text text-sm absolute mb-5 left-4 bottom-[-30]">
          {label.length > labelMaxLenth
            ? label.substring(0, labelMaxLenth) + "..."
            : label}
        </Text>
        <Text className="text-text text-5xl">
          {token.replace(/.{3}/g, "$& ")}
          {/* Add to token space every 3 characters */}
        </Text>
      </View>
      <Timer time={timeLeft} />
    </View>
  );
};

export default Fabox;
