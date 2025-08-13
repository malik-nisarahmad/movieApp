import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const UserListItem = ({ user, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center p-4 border-b border-gray-800">
      <Image source={{ uri: user.avatarUrl }} className="w-12 h-12 rounded-full mr-4" />
      <Text className="text-white font-bold text-lg">{user.username}</Text>
    </TouchableOpacity>
  );
};

export default UserListItem;