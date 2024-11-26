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
import {
  hideWrapper,
  showWrapper,
} from "./redux/slices/wrapperSlice/wrapperSlice";
import { useTranslation } from "react-i18next";

export default function LoadFilePrompt() {
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { uri, fileName } = useLocalSearchParams<{
    uri: string;
    fileName: string;
  }>();

  const handleLoadFile = async () => {
    console.log("handling file decryption with: ", uri, password);
    if (password.length > 0) {
      try {
        await dispatch(loadFile({ uri, password, fileName })).unwrap();

        // Navigation should only occur if decryption is successful
        router.navigate("/(tabs)");
      } catch (error) {
        const err = error as Error;
        // Display an error message if decryption fails
        Toast.show("invalid password");
        console.error("Error in file loading:", err.message);
      } finally {
        await dispatch(hideWrapper());
      }
    } else {
      Toast.show("Password can't be empty", {});
    }
  };

  const { t } = useTranslation();
  return (
    <SafeAreaView className="bg-bg flex-1 justify-center items-center p-5">
      <Text className="text-text mb-5 text-3xl text-center">
        {t("loadFileTitle")}
      </Text>
      <View className="mt-5 flex w-full">
        <TextInput
          className="w-full text-center mb-5 border-secondary border rounded-xl text-lg p-2 text-text placeholder:text-[#aaa]"
          placeholder={t("password")}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Button
          className="mt-5"
          title={t("loadFile")}
          handlePress={() => handleLoadFile()}
        />
        <Button
          className="mt-10"
          title={t("goBack")}
          handlePress={() => router.navigate("/")}
        />
      </View>
    </SafeAreaView>
  );
}
