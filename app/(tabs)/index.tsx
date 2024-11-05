import { Image, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Fabox from "../components/modules/Fabox";

interface Platform {
  name: string;
  icon: {
    name: string;
    color?: string;
  };
  hash: string;
}

const examplePlatforms: Platform[] = [
  {
    name: "google",
    icon: {
      name: "logo-google",
    },
    hash: "213",
  },
  {
    name: "google 2",
    icon: {
      name: "logo-google",
    },
    hash: "2",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 justify-start items-center bg-bg">
      {examplePlatforms.map((platform) => (
        <>
          <Fabox key={platform.hash} {...platform} />
        </>
      ))}
    </SafeAreaView>
  );
}
