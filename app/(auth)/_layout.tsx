import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    <Redirect href={"/"} />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn" options={{ title: 'Sign In'}} />
      <Stack.Screen name="signUp" options={{ title: 'Sign Up'}} />
      
    </Stack>
  )
}