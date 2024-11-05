import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { Text, View, StyleSheet } from "react-native";
import { Link, Slot } from "expo-router";
import "./../assets/styles.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLodaded, fontsError] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsError) throw fontsError;

    if (fontsLodaded) SplashScreen.hideAsync();
  }, [fontsError, fontsLodaded]);

  if (!fontsLodaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
    </ThemeProvider>
  );
}
