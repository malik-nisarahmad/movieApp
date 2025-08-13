// app/(tabs)/_layout.tsx
import { icons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
/* ---------- Small helper component ---------- */
const TabItem = ({
  route,
  isFocused,
  onPress,
}: {
  route: { name: string }
  isFocused: boolean
  onPress: () => void
}) => {
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1)
  }, [isFocused,scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const iconMap: Record<string, any> = {
    index: icons.home,
    search: icons.search,
    saved: icons.save,
    profile: icons.person,
    chat: icons.chat
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        className={`flex-row items-center justify-center rounded-full px-3 py-2 ${
          isFocused ? 'bg-accent' : ''
        }`}
      >
        <Image
          source={iconMap[route.name]}
          className="w-5 h-5"
          tintColor={isFocused ? '#151312' : '#A8B5DB'}
        />
        {isFocused && (
          <Text className="text-secondary font-semibold text-xs ml-2">
            {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  )
}

/* ---------- Tab bar renderer ---------- */
const TabButton = ({ state, descriptors, navigation }: any) => (
  <BlurView
    intensity={90}
    tint="dark"
    className="absolute bottom-8 left-6 right-6 h-20 rounded-full overflow-hidden"
  >
    <View className="flex-row justify-around items-center h-full px-2">
      {state.routes.map((route: any, index: number) => (
        <TabItem
          key={route.key}
          route={route}
          isFocused={state.index === index}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            navigation.navigate(route.name)
          }}
        />
      ))}
    </View>
  </BlurView>
)

/* ---------- Tabs ---------- */
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabButton {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"   options={{ title: 'home' }} />
      <Tabs.Screen name="search"  options={{ title: 'search' }} />
      <Tabs.Screen name="saved"   options={{ title: 'saved' }} />
      <Tabs.Screen name="profile" options={{ title: 'profile' }} />
      
      <Tabs.Screen
  name="chat"
  options={{
    title: 'Chat',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="chatbubble-ellipses" size={size} color={color} />
    ),
    headerShown: false,
  }}
/>
    </Tabs>
  )
}