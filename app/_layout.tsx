import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { selectIsAuthenticated } from "@/redux/authSlice";
import Toast from 'react-native-toast-message';
import { hydrateAuthFromStorage, hasValidToken } from "@/utils/authUtils";
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

    // Startup logic - only runs once on app initialization
    useEffect(() => {
        const handleStartup = async () => {
            if (!isReady || !isAuthReady || !isReduxAuthReady) {
                console.log("RootLayoutNav: Not ready or auth not ready. Skipping startup logic.");
                return;
            }

            const inOnboardingGroup = segments[0] === "onboarding";
            const inAuthGroup = segments[0] === "(auth)";
            const currentPath = segments.join('/');

            console.log("RootLayoutNav: Startup - isAuthenticated:", isAuthenticated, "hasCompletedOnboarding:", hasCompletedOnboarding, "inOnboardingGroup:", inOnboardingGroup, "inAuthGroup:", inAuthGroup, "segments:", segments, "currentPath:", currentPath);

            // Only run startup redirect logic if we're on the root screen (no segments or minimal segments)
            if (segments.length <= 1) {
                const hasValid = await hasValidToken();
                console.log("RootLayoutNav: Startup - hasValidToken:", hasValid);

                // If user has valid token and onboarding is complete, redirect to tabs
                if (hasValid && hasCompletedOnboarding) {
                    console.log("RootLayoutNav: Startup - Has valid token and completed onboarding, redirecting to /(tabs).");
                    router.replace("/(tabs)");
                    return;
                }

                // If onboarding is not complete, redirect to onboarding
                if (!hasCompletedOnboarding) {
                    console.log("RootLayoutNav: Startup - Onboarding not complete, redirecting to /onboarding.");
                    router.replace("/onboarding");
                    return;
                }

                // If onboarding is complete but no valid token, redirect to login
                if (hasCompletedOnboarding && !hasValid) {
                    console.log("RootLayoutNav: Startup - Onboarding complete but no valid token, redirecting to /(auth)/login.");
                    router.replace("/(auth)/login");
                    return;
                }
            }
        };

        handleStartup();
    }, [isReady, isAuthReady, isAuthenticated, hasCompletedOnboarding]);

    // Navigation logic - runs on every navigation change (except startup)
    useEffect(() => {
        if (!isReady || !isAuthReady || !isReduxAuthReady) {
            console.log("RootLayoutNav: Not ready or auth not ready. Skipping navigation logic.");
            return;
        }

        const inOnboardingGroup = segments[0] === "onboarding";
        const inAuthGroup = segments[0] === "(auth)";
        const currentPath = segments.join('/');

        console.log("RootLayoutNav: Navigation - segments:", segments, "currentPath:", currentPath);

        // Allow all navigation within auth group
        if (inAuthGroup) {
            console.log("RootLayoutNav: Navigation - In auth group, allowing navigation.");
            return;
        }

        // Allow all navigation within onboarding group
        if (inOnboardingGroup) {
            console.log("RootLayoutNav: Navigation - In onboarding group, allowing navigation.");
            return;
        }

        // Allow navigation to specific functional screens
        if (currentPath.startsWith('create-patient') || currentPath.startsWith('patient/') ||
            currentPath.startsWith('consultation/') || currentPath.startsWith('follow-up/') ||
            currentPath.startsWith('vaccination/')) {
            console.log("RootLayoutNav: Navigation - Accessing functional screen, allowing navigation.");
            return;
        }

        // For tab navigation, check if user has valid token
        const hasValid = hasValidToken(); // Don't await here for performance
        console.log("RootLayoutNav: Navigation - Checking valid token for tab navigation.");

        // If trying to access tabs but no valid token, redirect to login
        if (!hasValid && currentPath.startsWith('/(tabs)')) {
            console.log("RootLayoutNav: Navigation - No valid token for tabs, redirecting to /(auth)/login.");
            router.replace("/(auth)/login");
            return;
        }

    }, [segments, router, isReady, isAuthReady, isReduxAuthReady]);

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
