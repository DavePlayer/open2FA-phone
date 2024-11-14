import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import Timer from "./timer";
import { PlatformServices } from "@/app/types/services";

const Fabox = ({ issuer }: PlatformServices) => {
  const [timer, setTimer] = useState(60);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [hashCode, setHashCode] = useState("534 711");

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setHashCode("533 111");
          return 60; // Reset the timer
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
        <Text className="text-text text-5xl">{hashCode}</Text>
      </View>
      <Timer time={timer} />
    </View>
  );
};

export default Fabox;
