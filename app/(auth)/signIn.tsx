import { useSignIn } from '@clerk/clerk-expo';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput
} from 'react-native';

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const scaleAnim = useState(new Animated.Value(1))[0];

  const [fontsLoaded] = useFonts({
    Orbitron: require('../../assets/fonts/Orbitron-Bold.ttf'),
  });

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;
    try {
      const res = await signIn.create({ identifier: emailAddress, password });
      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#000000', '#0f0f0f', '#050505']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center items-center"
      >
        <BlurView
          intensity={80}
          tint="dark"
          className="rounded-2xl w-11/12 max-w-lg p-8"
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,255,200,0.4)',
            shadowColor: '#00fff0',
            shadowOpacity: 0.4,
            shadowRadius: 20,
          }}
        >
          <Text
            style={{
              fontFamily: 'Orbitron',
              fontSize: 32,
              color: '#00fff0',
              textAlign: 'center',
              marginBottom: 20,
              textShadowColor: '#00fff0',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            Welcome Back
          </Text>

          <TextInput
            placeholder="Email"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholderTextColor="#8af9ff"
            className="rounded-xl px-4 py-3 text-white mb-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: '#00fff0',
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#8af9ff"
            secureTextEntry
            className="rounded-xl px-4 py-3 text-white mb-6"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: '#00fff0',
            }}
          />

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={onSignInPress}
              style={{
                backgroundColor: '#00fff0',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                shadowColor: '#00fff0',
                shadowOpacity: 0.8,
                shadowRadius: 20,
              }}
            >
              <Text style={{ fontFamily: 'Orbitron', fontSize: 18, color: '#000' }}>
                Sign In
              </Text>
            </Pressable>
          </Animated.View>

          <Pressable onPress={() => router.push('/signUp')} className="mt-4">
            <Text style={{ textAlign: 'center', color: '#8af9ff' }}>
              Don’t have an account?{' '}
              <Text style={{ color: '#00fff0' }}>Sign Up</Text>
            </Text>
          </Pressable>
        </BlurView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
