import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <View className="flex-row items-center p-4 border-t border-gray-800 bg-primary">
      <TextInput
        className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 mr-2"
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor="#9ca3af"
      />
      <TouchableOpacity onPress={handleSend} className="bg-accent p-3 rounded-full">
        <Ionicons name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;

