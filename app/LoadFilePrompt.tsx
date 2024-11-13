import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import Button from "./components/MainButton";
import Toast from "react-native-root-toast";
import { useAppDispatch } from "./redux/store";
import { createFile } from "./redux/globalThunks/createFile";
import { loadFile } from "./redux/globalThunks/loadFile";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function LoadFilePrompt() {
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri: string }>();

  const handleLoadFile = async () => {
    console.log("handling file decryption with: ", uri, password);
    if (password.length > 0) {
      try {
        await dispatch(loadFile({ uri, password })).unwrap();

        // Navigation should only occur if decryption is successful
        router.replace("/(tabs)/");
      } catch (error) {
        const err = error as Error;
        // Display an error message if decryption fails
        Toast.show("invalid password");
        console.error("Error in file loading:", err.message);
      }
    } else {
      Toast.show("Password can't be empty", {});
    }
  };

  return (
    <SafeAreaView className="bg-bg flex-1 justify-center items-center p-5">
      <Text className="text-text mb-5 text-3xl">
        Give password to decrypt file
      </Text>
      <View className="mt-5 flex w-full">
        <TextInput
          className="w-full text-center mb-5 border-secondary border rounded-xl text-lg p-2 text-text placeholder:text-[#aaa]"
          placeholder="Password"
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Button
          className="mt-5"
          title="Load file"
          handlePress={() => handleLoadFile()}
        />
      </View>
    </SafeAreaView>
  );
}
