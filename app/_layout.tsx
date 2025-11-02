import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { isOnboardingComplete } from "../utils/storage";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const [isReady, setIsReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await isOnboardingComplete();
      setHasCompletedOnboarding(completed);
      setIsReady(true);
      await SplashScreen.hideAsync();
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'onboarding';

    if (!hasCompletedOnboarding && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (hasCompletedOnboarding && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isReady, hasCompletedOnboarding, segments]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create-patient" options={{ title: "Nouveau Patient", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="patient/[id]" options={{ title: "Profil Patient", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="consultation/[patientId]" options={{ title: "Consultation", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="follow-up/[patientId]" options={{ title: "Suivi Trimestriel", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="vaccination/[patientId]" options={{ title: "Vaccination", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
