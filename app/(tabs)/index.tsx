import { Image, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Fabox from "../components/modules/Fabox";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function HomeScreen() {
  const platforms = useSelector((root: RootState) => root.platforms);
  return (
    <SafeAreaView className="flex-1 justify-start items-center bg-bg">
      {platforms.platformServices.length === 0 && (
        <Text className="text-text text-3xl mt-10">
          No platforms registered
        </Text>
      )}
      {platforms.platformServices.map((platform) => (
        <Fabox key={`${platform.secret}`} {...platform} />
      ))}
    </SafeAreaView>
  );
}
