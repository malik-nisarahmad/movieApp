import React from "react";
import { FlatList, Text, View } from "react-native";

const MessageItem = ({ item, isCurrentUser }) => {
  const alignment = isCurrentUser ? "items-end" : "items-start";
  const bubbleColor = isCurrentUser ? "bg-accent" : "bg-gray-700";
  const textColor = "text-white";

  return (
    <View className={`my-2 px-4 ${alignment}`}>
      {!isCurrentUser && <Text className="text-xs text-gray-400 mb-1">{item.senderName}</Text>}
      <View className={`p-3 rounded-lg max-w-[80%] ${bubbleColor}`}>
        <Text className={textColor}>{item.content}</Text>
      </View>
    </View>
  );
};

const MessageList = ({ messages, currentUserId }) => {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <MessageItem item={item} isCurrentUser={item.senderId === currentUserId} />
      )}
      className="flex-1"
      inverted
    />
  );
};

export default MessageList;

