import { useSignUp } from '@clerk/clerk-expo';
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

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [code, setCode] = useState('');
  const scaleAnim = useState(new Animated.Value(1))[0];

  const [fontsLoaded] = useFonts({
    Orbitron: require('../../assets/fonts/Orbitron-Bold.ttf'),
  });

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, username, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPending(true);
    } catch (err) {
      console.error(err);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
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
            Create Account
          </Text>

          {pending ? (
            <>
              <Text style={{ color: '#8af9ff', marginBottom: 8, textAlign: 'center' }}>
                Enter the verification code sent to your email
              </Text>
              <TextInput
                placeholder="Verification code"
                value={code}
                onChangeText={setCode}
                placeholderTextColor="#8af9ff"
                className="rounded-xl px-4 py-3 text-white mb-6"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: '#00fff0',
                }}
                keyboardType="number-pad"
              />
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  onPress={onVerifyPress}
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
                    Verify
                  </Text>
                </Pressable>
              </Animated.View>
            </>
          ) : (
            <>
              <TextInput
                placeholder="Email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholderTextColor="#8af9ff"
                className="rounded-xl px-4 py-3 text-white mb-3"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: '#00fff0',
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#8af9ff"
                className="rounded-xl px-4 py-3 text-white mb-3"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: '#00fff0',
                }}
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
                  onPress={onSignUpPress}
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
                    Continue
                  </Text>
                </Pressable>
              </Animated.View>
            </>
          )}
        </BlurView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
