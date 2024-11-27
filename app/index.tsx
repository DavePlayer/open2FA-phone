import { Text, View } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState, useTransition } from "react";
import Button from "@/app/components/MainButton";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import Toast from "react-native-root-toast";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "./redux/store";
import { Picker } from "@react-native-picker/picker";
import { setLanguage } from "./redux/slices/settingsSlice/settingsSlice";

const index = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const settings = useSelector((root: RootState) => root.settings);
  const dispatch = useAppDispatch();
  const pickerRef = useRef<any>();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

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

  const { t, i18n } = useTranslation();
  useEffect(() => {
    const handleLanguage = async () => {
      const language = SecureStore.getItem("language");
      i18n.changeLanguage(settings.language);
    };

    handleLanguage();
  }, [settings.language]);

  useEffect(() => {
    const language = SecureStore.getItem("language");
    if (language) dispatch(setLanguage(language));
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {settings.language ? (
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
      ) : (
        <View className="flex-1 justify-center p-5 items-center bg-bg">
          <Text className="color-text text-2xl mb-5">{t("setLanguage")}</Text>
          <View
            style={{
              width: "100%",
              borderWidth: 3,
              borderColor: "#9146FF",
              borderRadius: 10,
              backgroundColor: "transparent",
              overflow: "hidden", // Ensures the borderRadius is applied correctly
            }}
          >
            <Picker
              ref={pickerRef}
              dropdownIconColor="white"
              style={{
                color: "white",
                width: "100%",
              }}
              selectedValue={settings.language}
              onValueChange={(itemValue, _) => dispatch(setLanguage(itemValue))}
            >
              <Picker.Item
                enabled={false}
                label="Select Language"
                value={undefined}
              />
              <Picker.Item label="Polski" value="pl" />
              <Picker.Item label="English" value="eng" />
            </Picker>
          </View>
        </View>
      )}
    </ThemeProvider>
  );
};

export default index;
