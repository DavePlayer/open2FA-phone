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
  const generateNewToken = () => {
    const totp = new OTPAuth.TOTP({
      issuer,
      label,
      algorithm,
      digits,
      period,
      secret,
    });
    const token = totp.generate();

    return token;
  };

  const [timer, setTimer] = useState(period);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [token, setToken] = useState(generateNewToken());

  useEffect(() => {
    const id = setInterval(async () => {
      setTimer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          const newToken = generateNewToken();
          // console.log("new code expires at: ", expires);
          setToken(newToken);
          return period; // Reset the timer
        }
      });
    }, 1000);

    setIntervalId(id);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <View className="w-full p-5 flex flex-row items-center mt-5">
      <TabBarIcon className="" name="logo-google" color="#fff" />
      <View className="grow px-4 flex relative justify-center">
        <Text className="text-text text-sm absolute mb-5 left-4 top-[-25]">
          {issuer}
        </Text>
        <Text className="text-text text-5xl">{token}</Text>
      </View>
      <Timer time={timer} />
    </View>
  );
};

export default Fabox;
