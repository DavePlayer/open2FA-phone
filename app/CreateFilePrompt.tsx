import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import Button from "./components/MainButton";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "./redux/store";
import { createFile } from "./redux/globalThunks/createFile";
import { useRouter } from "expo-router";
import {
  hideWrapper,
  showWrapper,
} from "./redux/slices/wrapperSlice/wrapperSlice";
import { useTranslation } from "react-i18next";

export default function CreateFilePrompt() {
  const [iterations, setIterations] = useState(10000);
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const handleCraeteFile = async () => {
    if (password.length > 0) {
      try {
        // Wrapper state is being set before encryption, but wrapper is not rendered.
        // small delay is needed so wrapper will show when creating a file.
        // that is how convieniently react rendering works.
        dispatch(showWrapper());
        await new Promise((resolve) => setTimeout(resolve, 100));

        await dispatch(createFile({ password, iterations })).unwrap();
        router.navigate("/");
      } catch (err) {
        await dispatch(hideWrapper());
        Toast.show({
          type: "error",
          text1: t("createFileError"),
          text2: `${JSON.stringify(err)}`,
        });
        console.error("Error when creating a file:", err);
      } finally {
        await dispatch(hideWrapper());
      }
    } else {
      Toast.show({
        type: "error",
        text1: t("fieldError"),
        text2: t("fieldErrorDetail1"),
      });
    }
  };

  return (
    <SafeAreaView className="bg-bg flex-1 justify-center items-center p-5">
      <Text className="text-text mb-5">{t("createFileInstruction")}</Text>
      <Text className="text-secondary mb-10">{t("createFileWarning")}</Text>
      <View className="mt-5 flex w-full">
        <TextInput
          className="w-full text-center mb-5 border-secondary border rounded-xl text-lg p-2 text-text placeholder:text-[#aaa]"
          placeholder={t("password")}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Slider
          style={{ alignSelf: "stretch" }}
          value={iterations}
          onValueChange={(val) => {
            console.log(val.toFixed());
            setIterations(parseInt(val.toFixed()));
          }}
          minimumValue={10000}
          maximumValue={60000}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#9146FF"
        />
        <Text className="text-text text-center text-lg mt-2">
          {t("iterations")}: {iterations}
        </Text>
        <Button
          className="mt-10"
          title={t("createFile")}
          handlePress={() => handleCraeteFile()}
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
