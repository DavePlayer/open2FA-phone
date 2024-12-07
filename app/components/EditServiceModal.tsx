import { View, Text, Pressable } from "react-native";
import React, { ReactElement, useTransition } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { useTranslation } from "react-i18next";
import Button from "./MainButton";
import { hideModal } from "../redux/slices/modalSlice/modalSlice";
import { deleteService } from "../redux/slices/platformsSlice/platformsSlice";
import { saveToFile } from "../redux/globalThunks/saveToFile";

const EditServiceModal = ({ children }: { children: ReactElement }) => {
  const modalState = useSelector((root: RootState) => root.modalState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const serviceLabel = modalState.platformEdited.label.includes(
    modalState.platformEdited.issuer
  )
    ? modalState.platformEdited.label.split(":")[1]
    : modalState.platformEdited.label;

  const confirmDelete = async () => {
    try {
      dispatch(deleteService(modalState.platformEdited));
      dispatch(hideModal());

      await dispatch(saveToFile());
    } catch (error) {
      const err = error as Error;
      console.error(err);
    }
  };
  return (
    <View className="flex-1">
      {modalState.showState && (
        <Pressable
          onPress={() => dispatch(hideModal())}
          className="absolute top-0 left-0 right-0 z-10 bg-bg/95 bottom-0 flex justify-center items-center p-5"
        >
          <View className="w-full h-full relative">
            <View className=" absolute top-1/2 -translate-y-1/2 w-full flex justify-center items-center border border-secondary rounded-xl p-3">
              <Text className="text-text text-2xl text-center">
                {t("deleteQuestion")}
              </Text>
              <Text className="text-text mt-5 mb-5 text-center">
                {modalState.platformEdited.issuer}
              </Text>
              <Text className="text-text mt-5 mb-5 text-center">
                {serviceLabel}
              </Text>
              <View className="w-full flex flex-row gap-3 justify-around items-center">
                <Button
                  handlePress={() => confirmDelete()}
                  className="w-1/3 bg-red-500"
                >
                  {t("yes")}
                </Button>
                <Button
                  className="w-1/3 bg-transparent border border-secondary"
                  handlePress={() => dispatch(hideModal())}
                >
                  {t("no")}
                </Button>
              </View>
            </View>
          </View>
        </Pressable>
      )}
      {children}
    </View>
  );
};

export default EditServiceModal;
