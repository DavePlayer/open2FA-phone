import { Text, View, StyleSheet, ToastAndroid, Alert } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Link, useRouter } from "expo-router";
import React from "react";
import Button from "@/app/components/MainButton";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";

const index = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleLoadFile = async () => {
    let options = { encoding: FileSystem.EncodingType.Base64 };

    try {
      const document = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (document.assets && document.assets.length && !document.canceled) {
        const [asset] = document.assets;
        const uri = asset.uri;

        // Read the file content
        const fileText = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        console.log("File text:", fileText); // works, YAY

        router.replace("/(tabs)/");
      } else {
        console.log(document.assets, document.canceled);
        throw new Error("file either canceled or sth is wrong");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error(err);
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  const handleCreateFile = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status == "granted") {
        console.log("file access granted");
        ToastAndroid.show("File access Granted", ToastAndroid.TOP);

        let fileUri = FileSystem.documentDirectory + "test.txt";

        console.log("in theory created a temp file at ", fileUri);

        Alert.alert(
          "Before you continue",
          'After confirming a share module will appeear in which you can click to "save as" to save it on internal phone storage or to share it onto clod drive. Yes i know, very intuitive',
          [
            {
              text: "Save",
              onPress: () => {
                shareAsync(fileUri);
              },
            },
            {
              text: "cancel",
            },
          ]
        );
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error(err);
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View className="flex-1 justify-center items-center bg-bg">
        <Text className="color-text text-2xl mb-5">Unlock open2FA</Text>
        <Button
          className="min-w-[50%]"
          title="Load File"
          handlePress={() => handleLoadFile()}
        />
        <Button
          className="min-w-[50%]"
          title="Create File"
          handlePress={() => handleCreateFile()}
        />
      </View>
    </ThemeProvider>
  );
};

export default index;
