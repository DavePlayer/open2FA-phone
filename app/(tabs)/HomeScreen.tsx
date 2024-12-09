import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Fabox from "../components/modules/Fabox";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useTranslation } from "react-i18next";
import { Buffer } from "buffer";
global.Buffer = Buffer;

export default function HomeScreen() {
  const platforms = useSelector((root: RootState) => root.platforms);

  const { t } = useTranslation();
  return (
    <SafeAreaView className="">
      <ScrollView className="w-full">
        {platforms.platformServices.length === 0 && (
          <Text className="text-text text-3xl mt-10 text-center">
            {t("noPlatformsMessage")}
          </Text>
        )}
        {platforms.platformServices.map((platform) => (
          <Fabox key={`${platform.secret}`} {...platform} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
