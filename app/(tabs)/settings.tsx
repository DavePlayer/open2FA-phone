import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { setLanguage } from "../redux/slices/settingsSlice/settingsSlice";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const settings = useSelector((root: RootState) => root.settings);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);
  return (
    <SafeAreaView className="flex-1 justify-start items-center bg-bg p-5">
      <View className="w-full">
        <Text className="text-text mb-2 ml-2">{t("language")}</Text>
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
            <Picker.Item label="English" value="en" />
          </Picker>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
