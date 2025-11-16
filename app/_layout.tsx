import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
<<<<<<< HEAD
=======
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { isOnboardingComplete } from "../utils/storage";
>>>>>>> cd25b5d (not yet done)
=======
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { selectIsAuthenticated } from "@/redux/authSlice";
import Toast from 'react-native-toast-message';
import { hydrateAuthFromStorage } from "@/utils/authUtils";
>>>>>>> f8230bc (Fix: Redirect loop and quick actions navigation)

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isReady, setIsReady] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      console.log("RootLayoutNav: Initializing...");
      await hydrateAuthFromStorage();
      setIsAuthReady(true);
      setIsReady(true);
      await SplashScreen.hideAsync();
      console.log("RootLayoutNav: Initialization complete.");
    };
    initialize();
  }, []);

<<<<<<< HEAD
=======
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

>>>>>>> cd25b5d (not yet done)
  if (!isReady) {
=======
  useEffect(() => {
    if (!isReady || !isAuthReady) {
      console.log("RootLayoutNav: Not ready or auth not ready. Skipping redirect.");
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    console.log("RootLayoutNav: isAuthenticated:", isAuthenticated, "inAuthGroup:", inAuthGroup, "segments:", segments);

    if (isAuthenticated && inAuthGroup) {
      console.log("RootLayoutNav: Authenticated and in auth group. Redirecting to /(tabs).");
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      console.log("RootLayoutNav: Not authenticated and not in auth group. Redirecting to /(auth)/register.");
      router.replace("/(auth)/register");
    }
  }, [isReady, isAuthReady, isAuthenticated, segments]);

  if (!isReady || !isAuthReady) {
    console.log("RootLayoutNav: Rendering null (not ready or auth not ready).");
>>>>>>> f8230bc (Fix: Redirect loop and quick actions navigation)
    return null;
  }

  console.log("RootLayoutNav: Rendering Stack.");
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
<<<<<<< HEAD
=======
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
>>>>>>> cd25b5d (not yet done)
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
