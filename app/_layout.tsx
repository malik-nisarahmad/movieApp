import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import "./globals.css";
const publishablekey=process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if(!publishablekey){
  throw new Error("Missing Publishable Key")

}
export default function RootLayoutNav() {
  return (
    <ClerkProvider publishableKey={publishablekey}>
      <ClerkLoaded>
        <Slot />
      </ClerkLoaded>
    </ClerkProvider>
  )
 } 