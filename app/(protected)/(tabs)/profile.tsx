// app/(tabs)/profile.tsx
import CustomButton from '@/components/CustomButton';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Profile = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();

  /* shimmer */
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  /* greeting */
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
  }, []);

  const handleSignOut = useCallback(async () => {
    try { await signOut(); }
    catch { Alert.alert('Sign out failed'); }
  }, [signOut]);

  if (!isSignedIn || !user) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#00fff0" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary items-center justify-center px-6">
      {/* shimmer background */}
      <Animated.View
        style={{
          position: 'absolute',
          width: width * 2,
          height,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            'rgba(0,255,200,0.05)',
            'rgba(0,255,255,0.15)',
            'rgba(255,0,255,0.05)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* glass card */}
      <View className="w-full max-w-sm rounded-3xl bg-black/40 p-8 border border-white/10 shadow-2xl items-center">
        {/* avatar */}
        <Image
          source={{ uri: user.imageUrl }}
          className="w-28 h-28 rounded-full border-2 border-cyan-400"
        />

        {/* greeting */}
        <Text className="text-gray-300 text-sm mt-4">{greeting},</Text>

        {/* name */}
        <Text className="text-white text-2xl font-bold mt-1">
          {user.fullName}
        </Text>

        {/* email */}
        <Text className="text-gray-400 text-base mt-1">
          {user.emailAddresses[0]?.emailAddress}
        </Text>

        {/* joined date */}
        <View className="flex-row items-center mt-3 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-4 py-1">
          <AntDesign name="calendar" size={14} color="#00fff0" />
          <Text className="text-cyan-300 text-sm ml-2">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* sign-out */}
        <View className="w-full mt-8">
          <CustomButton
            title="Sign Out"
            onPress={handleSignOut}
            bgVariant="danger"
            textVariant="secondary"
            className="shadow-lg shadow-red-500/50"
          />
        </View>
      </View>
    </View>
  );
};

export default Profile;