import { Text, View, StyleSheet, Alert, Platform } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Link, useRouter } from "expo-router";
import React, { useState, useTransition } from "react";
import Button from "@/app/components/MainButton";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import Toast from "react-native-root-toast";
import { useAppDispatch } from "./redux/store";
import { loadFile } from "./redux/globalThunks/loadFile";
import { createFile } from "./redux/globalThunks/createFile";
import { useTranslation } from "react-i18next";

const index = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleLoadFile = async () => {
    let options = { encoding: FileSystem.EncodingType.Base64 };

    try {
      const document = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        multiple: false,
      });
      if (document.assets && document.assets.length && !document.canceled) {
        const [asset] = document.assets;
        const uri = asset.uri;

        // uri is broken when special characters are included
        // no idea why that is
        const fileName = uri.split(/,|%2F|%3A/).pop() as string;
        console.log(`uri: ${uri}\nsplit:${uri.split(/,|%2F|%3A/)}`);
        const newFileUri = FileSystem.documentDirectory + fileName;

        const fileInfo = await FileSystem.getInfoAsync(newFileUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(newFileUri); // Delete the file if it exists
        }

        await FileSystem.copyAsync({
          from: uri,
          to: newFileUri,
        });

        router.navigate(
          `/LoadFilePrompt?uri=${newFileUri}&fileName=${fileName}`
        );
      } else {
        console.log(document.assets, document.canceled);
        throw new Error("file either canceled or sth is wrong");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error(err);
      Toast.show(err.message, {
        duration: Toast.durations.SHORT,
      });
    }
  };

  const handleCreateFile = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status == "granted") {
        console.log("file access granted");

        router.navigate("/CreateFilePrompt");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error(err);
      Toast.show(err.message, {
        duration: Toast.durations.SHORT,
      });
    }
  };

  const { t } = useTranslation();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View className="flex-1 justify-center items-center bg-bg">
        <Text className="color-text text-2xl mb-5">{t("unlockMessage")}</Text>
        <Button
          className="min-w-[50%]"
          title={t("loadFile")}
          handlePress={() => handleLoadFile()}
        />
        <Button
          className="min-w-[50%]"
          title={t("createFile")}
          handlePress={() => handleCreateFile()}
        />
      </View>
    </ThemeProvider>
  );
};

export default index;
