import UserListItem from "@/components/UserListItem";
import { getAllUsers, getOrCreateChatRoom } from "@/lib/appwrite";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View } from "react-native";

const ContactsScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const allUsers = await getAllUsers(user.id);
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const results = users.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(results);
  }, [search, users]);

  const handleUserPress = async (otherUser) => {
    if (!user) return;
    const room = await getOrCreateChatRoom(user.id, otherUser.accountId);
    router.push(`/chat/${room.$id}`);
  };

  if (loading) {
    return <ActivityIndicator size="large" className="mt-16" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4">
        <Text className="text-2xl font-bold text-white mb-4">Contacts</Text>
        <TextInput
          className="bg-gray-800 text-white rounded-full px-4 py-2"
          placeholder="Search for users..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <UserListItem user={item} onPress={() => handleUserPress(item)} />}
      />
    </SafeAreaView>
  );
};

export default ContactsScreen;

