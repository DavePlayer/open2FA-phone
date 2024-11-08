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

import { RootSiblingParent } from "react-native-root-siblings";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";

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
    <Provider store={store}>
      <RootSiblingParent>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Slot />
        </ThemeProvider>
      </RootSiblingParent>
    </Provider>
  );
}
