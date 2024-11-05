import { View, Text } from "react-native";
import React from "react";

interface Props {
  time: number;
}

const Timer = ({ time }: Props) => {
  return (
    <View className="border border-white rounded-full w-10 h-10 flex justify-center items-center">
      <Text className="text-text text-lg">{time}</Text>
    </View>
  );
};

export default Timer;
