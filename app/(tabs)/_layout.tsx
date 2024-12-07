import { Slot, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { t } = useTranslation();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="HomeScreen"
          options={{
            title: t("home"),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="QrScan"
          options={{
            title: t("qrScan"),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "qr-code" : "qr-code-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t("settings"),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "settings" : "settings-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="SubPage/CorrectQrScan"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
