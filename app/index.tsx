import { Text, View, StyleSheet } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Link, useRouter } from "expo-router";
import React from "react";
import Button from "@/app/components/MainButton";

const index = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View className="flex-1 justify-center items-center bg-bg">
        <Text className="color-text text-2xl mb-5">Unlock open2FA</Text>
        <Button
          className="min-w-[50%]"
          title="Load File"
          handlePress={() => {
            router.replace("/(tabs)/");
          }}
        />
        <Button
          className="min-w-[50%]"
          title="Create File"
          handlePress={() => {
            router.replace("/(tabs)/");
          }}
        />
      </View>
    </ThemeProvider>
  );
};

export default index;
