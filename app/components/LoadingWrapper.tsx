import { View, Text } from "react-native";
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const LoadingWrapper = ({ children }: { children: ReactElement }) => {
  const wrapperState = useSelector((root: RootState) => root.wrapperState);
  return (
    <View className="flex-1">
      {wrapperState && (
        <View className="absolute top-0 left-0 right-0 z-10 bg-bg/80 bottom-0 flex justify-center items-center">
          <Text className="text-white text-3xl">
            File functions in progress.
          </Text>
          <Text className="text-white text-3xl">It may take a few seconds</Text>
        </View>
      )}
      {children}
    </View>
  );
};

export default LoadingWrapper;
