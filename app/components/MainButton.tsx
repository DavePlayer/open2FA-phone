import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface Props {
  handlePress: () => void;
  title: string;
  className?: string;
}

const Button = ({ handlePress, title, className }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => handlePress()}
      className={`bg-secondary rounded-xl p-4 my-4 ${
        className ? className : ""
      }`}
    >
      <Text className="text-text text-xl text-center">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
