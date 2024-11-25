import { View, Text, TouchableOpacity } from "react-native";
import React, { ReactElement } from "react";

interface Props {
  handlePress?: () => void;
  title?: string;
  className?: string;
  children?: string;
}

const Button = ({ handlePress, title, className, children }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => handlePress && handlePress()}
      className={`bg-secondary rounded-xl p-4 my-4 ${
        className ? className : ""
      }`}
    >
      <Text className="text-text text-xl text-center">
        {title ? title : children}{" "}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
