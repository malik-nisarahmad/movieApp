import { BlurView } from 'expo-blur';
import React, { ReactNode } from 'react';
import { Platform } from 'react-native';

export default function GlassCard({ children }: { children: ReactNode }) {
  return (
    <BlurView
      intensity={Platform.OS === 'ios' ? 110 : 140}
      tint="dark"
      className="bg-black/20 rounded-3xl p-8 w-11/12 max-w-sm border border-white/10"
    >
      {children}
    </BlurView>
  );
}