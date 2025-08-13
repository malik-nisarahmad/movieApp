import { config, databases } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ChatRoomItem = ({ room, currentUser }) => {
  const router = useRouter();
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const otherUserId = room.participants.find((p) => p !== currentUser.id);
    if (otherUserId) {
      databases.listDocuments(config.databaseId, config.userCollectionId, [`equal("accountId", "${otherUserId}")`])
        .then(response => {
          if (response.documents.length > 0) {
            setOtherUser(response.documents[0]);
          }
        });
    }
  }, [room, currentUser]);

  if (!otherUser) return null;

  return (
    <TouchableOpacity onPress={() => router.push(`/chat/${room.$id}`)} className="flex-row items-center p-4 border-b border-gray-800">
      <Image source={{ uri: otherUser.avatarUrl }} className="w-12 h-12 rounded-full mr-4" />
      <View>
        <Text className="text-white font-bold text-lg">{otherUser.username}</Text>
        <Text className="text-gray-400">{room.lastMessage || "No messages yet"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRoomItem;

