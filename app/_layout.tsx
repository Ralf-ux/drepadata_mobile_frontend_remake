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
    const [isReduxAuthReady, setIsReduxAuthReady] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            console.log("RootLayoutNav: Initializing...");
            await hydrateAuthFromStorage();
            setIsAuthReady(true);
            const completed = await isOnboardingComplete();
            setHasCompletedOnboarding(completed);
            setIsReady(true);

            // Set isReduxAuthReady to true after a short delay to allow Redux to update
            setTimeout(() => {
                setIsReduxAuthReady(true);
            }, 50);
            await SplashScreen.hideAsync();
            console.log("RootLayoutNav: Initialization complete.");
        };
        initialize();
    }, []);

    useEffect(() => {
        if (!isReady || !isAuthReady || !isReduxAuthReady) {
            console.log("RootLayoutNav: Not ready or auth not ready. Skipping redirect.");
            return;
        }

        const inOnboardingGroup = segments[0] === "onboarding";
        const inAuthGroup = segments[0] === "(auth)";
        const currentPath = segments.join('/');

        console.log("RootLayoutNav: isAuthenticated:", isAuthenticated, "hasCompletedOnboarding:", hasCompletedOnboarding, "inOnboardingGroup:", inOnboardingGroup, "inAuthGroup:", inAuthGroup, "segments:", segments, "currentPath:", currentPath);

        // Rule 1: If user is authenticated, redirect to tabs, unless in auth group
        if (isAuthenticated && !inAuthGroup) {
            console.log("RootLayoutNav: Authenticated, redirecting to tabs.");
            router.replace("/(tabs)");
            return;
        }

        // Rule 2: If onboarding is NOT complete, always go to the onboarding screen.
        if (!hasCompletedOnboarding) {
            if (!inOnboardingGroup) {
                console.log("RootLayoutNav: Onboarding not complete, not on onboarding screen. Redirecting to /onboarding.");
                router.replace("/onboarding");
            }
            return; // Stay on onboarding until it's complete
        }

        // Rule 3: If onboarding IS complete, and we are currently on the onboarding screen,
        // then redirect based on authentication status.
        if (hasCompletedOnboarding && inOnboardingGroup) {
            if (isAuthenticated) {
                console.log("RootLayoutNav: Onboarding complete, authenticated. Redirecting from /onboarding to /(tabs).");
                router.replace("/(tabs)");
            } else {
                console.log("RootLayoutNav: Onboarding complete, not authenticated. Redirecting from /onboarding to /(auth)/login.");
                router.replace("/(auth)/login");
            }
            return;
        }

        // Rule 4: If onboarding IS complete, and we are NOT on the onboarding screen.
        // Handle authentication redirects.
        if (hasCompletedOnboarding && !inOnboardingGroup) {
            if (!isAuthenticated && !inAuthGroup) {
                console.log("RootLayoutNav: Onboarding complete, not authenticated, not in auth group. Redirecting to /(auth)/login.");
                router.replace("/(auth)/login");
                return;
            }

            if (isAuthenticated && inAuthGroup) {
                console.log("RootLayoutNav: Onboarding complete, authenticated and in auth group. Redirecting to /(tabs).");
                router.replace("/(tabs)");
                return;
            }
        }

    }, [isReady, isAuthReady, isAuthenticated, hasCompletedOnboarding, segments, router]);

    if (!isReady || !isAuthReady || !isReduxAuthReady) {
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
