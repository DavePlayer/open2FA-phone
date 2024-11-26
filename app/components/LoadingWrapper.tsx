import { View, Text } from "react-native";
import React, { ReactElement, useTransition } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useTranslation } from "react-i18next";

const LoadingWrapper = ({ children }: { children: ReactElement }) => {
  const wrapperState = useSelector((root: RootState) => root.wrapperState);
  const { t } = useTranslation();
  return (
    <View className="flex-1">
      {wrapperState && (
        <View className="absolute top-0 left-0 right-0 z-10 bg-bg/80 bottom-0 flex justify-center items-center">
          <Text className="text-white text-3xl text-center">
            {t("wrapperMessage1")}
          </Text>
          <Text className="text-white text-3xl text-center">
            {t("wrapperMessage2")}
          </Text>
        </View>
      )}
      {children}
    </View>
  );
};

export default LoadingWrapper;
