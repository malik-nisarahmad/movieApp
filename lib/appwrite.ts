// lib/appwrite.ts
import { Account, Client, Databases, ID, Query } from 'react-native-appwrite';

const ENV = {
  APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
  APPWRITE_PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  USER_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!,
  CHAT_ROOMS_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_CHAT_ROOMS_COLLECTION_ID!,
  MESSAGES_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID!,
};

export const client = new Client()
  .setEndpoint(ENV.APPWRITE_ENDPOINT)
  .setProject(ENV.APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const config = {
  databaseId: ENV.DATABASE_ID,
  userCollectionId: ENV.USER_COLLECTION_ID,
  chatRoomsCollectionId: ENV.CHAT_ROOMS_COLLECTION_ID,
  messagesCollectionId: ENV.MESSAGES_COLLECTION_ID,
};

/* ------------- Chat-room helpers ------------- */
export const getUserChatRooms = async (userId: string) =>
  databases.listDocuments(
    config.databaseId,
    config.chatRoomsCollectionId,
    [Query.contains('participants', userId)]
  );

/* Use the ACTUAL attribute you store for the user id in the users collection */
export const getAllUsers = async (currentUserId: string) =>
  databases.listDocuments(
    config.databaseId,
    config.userCollectionId,
    [Query.notEqual('senderId', currentUserId)]   // <-- change if you named it differently
  );

export const getOrCreateChatRoom = async (userA: string, userB: string) => {
  const idPair = [userA, userB].sort().join('_');
  const { documents } = await databases.listDocuments(
    config.databaseId,
    config.chatRoomsCollectionId,
    [Query.equal('$id', idPair)]
  );
  if (documents.length) return documents[0];
  
  return databases.createDocument(
    config.databaseId,
    config.chatRoomsCollectionId,
    idPair,
    { participants: [userA, userB], lastMessage: '' }
  );
};

/* ------------- Message helpers ------------- */
export const createMessage = (payload: {
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
}) =>
  databases.createDocument(
    config.databaseId,
    config.messagesCollectionId,
    ID.unique(),
    {
      content: payload.content,
      senderId: payload.senderId,      // <-- now matches schema
      senderName: payload.senderName,
      chatRoomId: payload.chatRoomId,  // <-- now matches schema
    }
  );

export const getMessagesForRoom = async (roomId: string) => {
  const { documents } = await databases.listDocuments(
    config.databaseId,
    config.messagesCollectionId,
    [Query.equal('chatRoomId', roomId), Query.orderDesc('$createdAt')] // <-- correct key
  );
  return documents;
};