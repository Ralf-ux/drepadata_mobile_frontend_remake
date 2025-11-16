import { setCredentials, clearCredentials } from '@/redux/authSlice';
import { store } from '@/redux/store';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

export const handleToken = async (data) => {
    try {
        console.log("handleToken: Received data", data);
        const token = data.token;
        let decodedToken;

        try {
            decodedToken = jwtDecode(token);
            console.log("handleToken: Decoded token", decodedToken);
        } catch (error) {
            console.error('handleToken: Failed to decode token:', error);
            throw new Error('Invalid token received');
        }
        
        // Generate a simple IV using timestamp and random numbers
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000000).toString();
        const iv = btoa(timestamp + random).substring(0, 24); // Base64 encode and limit to 24 chars
        
        const mydata = {
            token: token,
            iv: iv,
            user: decodedToken
        };
        
        await AsyncStorage.setItem('token', mydata.token);
        await AsyncStorage.setItem('iv', mydata.iv);
        console.log("handleToken: Token and IV stored in AsyncStorage");
        return mydata;
    } catch (error) {
        console.error('handleToken: Failed to handle token:', error);
        throw error;
    }
};


export const isAuthenticated = () => {
    const state = store.getState();
    console.log("isAuthenticated: Current state.auth.token", state.auth.token);
    const isAuthenticated = !!state.auth.token && state.auth.isAuthenticated;
    console.log("isAuthenticated: Returning", isAuthenticated, "token:", !!state.auth.token, "isAuthenticated flag:", state.auth.isAuthenticated);
    return isAuthenticated;
};

export const getToken = () => {
    const state = store.getState();
    return state.auth.token;
};
export const hydrateAuthFromStorage = async () => {
    console.log("hydrateAuthFromStorage: Attempting to hydrate auth from storage");
    const token = await AsyncStorage.getItem('token');
    const iv = await AsyncStorage.getItem('iv');
    console.log("hydrateAuthFromStorage: Retrieved token from AsyncStorage", token);
    console.log("hydrateAuthFromStorage: Retrieved IV from AsyncStorage", iv);

    if (token) {
        try {
            const user = jwtDecode(token);
            console.log("hydrateAuthFromStorage: Decoded user from token", user);
            store.dispatch(setCredentials({ token, iv, user }));
            console.log("hydrateAuthFromStorage: Credentials set from storage");
        } catch (error) {
            console.error('hydrateAuthFromStorage: Failed to decode stored token:', error);
            await AsyncStorage.removeItem('token'); // Clear invalid token
            await AsyncStorage.removeItem('iv'); // Clear IV as well
            store.dispatch(clearCredentials());
            console.log("hydrateAuthFromStorage: Invalid token and IV cleared");
        }
    } else {
        console.log("hydrateAuthFromStorage: No token found in AsyncStorage, ensuring auth state is cleared");
        // Don't set credentials if no token exists to avoid confusion
        // The auth state should remain as it is (likely already cleared from logout)
    }
};

export const clearAuthFromStorage = async () => {
    console.log("clearAuthFromStorage: Clearing auth from storage");
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('iv');
    console.log("clearAuthFromStorage: Token and IV removed from AsyncStorage");
};

// New function to check if user has a valid token (more reliable for authentication state)
export const hasValidToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const iv = await AsyncStorage.getItem('iv');
    console.log("hasValidToken: Retrieved token from AsyncStorage", token);
    console.log("hasValidToken: Retrieved IV from AsyncStorage", iv);
    
    if (!token) {
        console.log("hasValidToken: No token found");
        return false;
    }
    
    try {
        const user = jwtDecode(token);
        console.log("hasValidToken: Token is valid, decoded user:", user);
        return true;
    } catch (error) {
        console.error('hasValidToken: Token is invalid or expired:', error);
        // Clear invalid token and IV
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('iv');
        return false;
    }
};
