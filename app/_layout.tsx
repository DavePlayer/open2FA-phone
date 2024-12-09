import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { Text, View, StyleSheet, BackHandler } from "react-native";
import { Link, Slot, useNavigation } from "expo-router";
import "./../assets/styles.css";

import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import LoadingWrapper from "./components/LoadingWrapper";
import "./utils/i18n";
import EditServiceModal from "./components/EditServiceModal";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [toastVisible, setToastVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const handleBackPress = () => {
      // Prevent default back action
      return true;
    };

    // Add event listener for hardware back press
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  const [fontsLodaded, fontsError] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsError) throw fontsError;

    // Delay hiding the splash screen until fonts are loaded
    if (fontsLodaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000); // delay the splash screen hide
    }
  }, [fontsError, fontsLodaded]);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LoadingWrapper>
          <EditServiceModal>
            <Slot />
          </EditServiceModal>
        </LoadingWrapper>
      </ThemeProvider>
      <Toast />
    </Provider>
  );
}
