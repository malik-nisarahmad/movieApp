import GlassCard from '@/components/GlassCard';
import { images } from '@/constants/images';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function Welcome() {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  const handlePressIn = () => {
    scale.value = 0.95;
  };

  const handlePressOut = () => {
    scale.value = 1;
    router.push('/(auth)/signIn');
  };

  return (
    <ImageBackground
      source={images.bg}
      className="flex-1 justify-center items-center"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/60" />
      <View className="flex-1 justify-center items-center">
        <Animated.View style={animatedStyle}>
          <GlassCard>
            <Text className="text-white font-bold text-4 têxt-center tracking-wide">
              Cinematic Hub
            </Text>
            <Text className="text-gray-300 text-lg mb-8 text-center">
              Discover, Share, and Connect
            </Text>
            <Animated.View style={animatedStyle}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="bg-orange-500 rounded-xl py-4 px-8 items-center shadow-lg"
              >
                <Text className="text-white font-bold text-xl">Get Started</Text>
              </Pressable>
            </Animated.View>
          </GlassCard>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}