import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { selectIsAuthenticated } from "@/redux/authSlice";
import Toast from 'react-native-toast-message';
import { hydrateAuthFromStorage } from "@/utils/authUtils";
import { isOnboardingComplete } from "../utils/storage";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isReady, setIsReady] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      console.log("RootLayoutNav: Initializing...");
      await hydrateAuthFromStorage();
      setIsAuthReady(true);
      const completed = await isOnboardingComplete();
      setHasCompletedOnboarding(completed);
      setIsReady(true);
      await SplashScreen.hideAsync();
      console.log("RootLayoutNav: Initialization complete.");
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!isReady || !isAuthReady) {
      console.log("RootLayoutNav: Not ready or auth not ready. Skipping redirect.");
      return;
    }

    const inOnboardingGroup = segments[0] === "onboarding";
    const inAuthGroup = segments[0] === "(auth)";
    const currentPath = segments.join('/');

    console.log("RootLayoutNav: isAuthenticated:", isAuthenticated, "hasCompletedOnboarding:", hasCompletedOnboarding, "inOnboardingGroup:", inOnboardingGroup, "inAuthGroup:", inAuthGroup, "segments:", segments, "currentPath:", currentPath);

    // If onboarding is not complete, always redirect to onboarding unless already there
    if (!hasCompletedOnboarding && currentPath !== "onboarding") {
      console.log("RootLayoutNav: Onboarding not complete. Redirecting to /onboarding.");
      router.replace("/onboarding");
      return;
    }

    // If onboarding is complete and we are on the onboarding screen, redirect to tabs
    if (hasCompletedOnboarding && currentPath === "onboarding") {
      console.log("RootLayoutNav: Onboarding complete. Redirecting from /onboarding to /(tabs).");
      router.replace("/(tabs)");
      return;
    }

    // If onboarding is complete, but not authenticated and not in auth group, redirect to register
        if (hasCompletedOnboarding && !isAuthenticated && currentPath !== "(auth)/register" && currentPath !== "(auth)/login") {
          console.log("RootLayoutNav: Onboarding complete, not authenticated. Redirecting to /(auth)/register.");
          router.replace("/(auth)/register");
      return;
    }

    // If onboarding is complete, authenticated, and in auth group, redirect to tabs
    if (hasCompletedOnboarding && isAuthenticated && inAuthGroup) {
      console.log("RootLayoutNav: Onboarding complete, authenticated and in auth group. Redirecting to /(tabs).");
      router.replace("/(tabs)");
      return;
    }
  }, [isReady, isAuthReady, isAuthenticated, hasCompletedOnboarding, segments, router]);

  if (!isReady || !isAuthReady) {
    console.log("RootLayoutNav: Rendering null (not ready or auth not ready).");
    return null;
  }

  console.log("RootLayoutNav: Rendering Stack.");
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create-patient" options={{ title: "Nouveau Patient", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="patient/[id]" options={{ title: "Profil Patient", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="consultation/[patientId]" options={{ title: "Consultation", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="follow-up/[patientId]" options={{ title: "Suivi Trimestriel", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="vaccination/[patientId]" options={{ title: "Vaccination", headerStyle: { backgroundColor: '#dc3545' }, headerTintColor: '#fff' }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
          <Toast />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
}
