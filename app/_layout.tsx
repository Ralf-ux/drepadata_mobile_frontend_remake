import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getItem, setItem } from '../utils/storage';
import Onboarding from './onboarding';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        // Show onboarding for first-time users
        setShowOnboarding(true);
      } else {
        // For returning users, show onboarding briefly then go to home
        setShowOnboarding(true);
        setTimeout(() => {
          setShowOnboarding(false);
        }, 3000); // Show for 3 seconds
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowOnboarding(true);
    }
  };

  const completeOnboarding = async () => {
    await setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding === null) {
    return null; // Or a loading screen
  }

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
         <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
