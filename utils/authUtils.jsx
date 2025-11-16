import { setCredentials, clearCredentials } from '@/redux/authSlice';
import { store } from '@/redux/store';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        
        const mydata = {
            token: token,
            user: decodedToken
        };
        await AsyncStorage.setItem('token', mydata.token);
        console.log("handleToken: Token stored in AsyncStorage");
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
    console.log("hydrateAuthFromStorage: Retrieved token from AsyncStorage", token);

    if (token) {
        try {
            const user = jwtDecode(token);
            console.log("hydrateAuthFromStorage: Decoded user from token", user);
            store.dispatch(setCredentials({ token, user }));
            console.log("hydrateAuthFromStorage: Credentials set from storage");
        } catch (error) {
            console.error('hydrateAuthFromStorage: Failed to decode stored token:', error);
            await AsyncStorage.removeItem('token'); // Clear invalid token
            store.dispatch(clearCredentials());
            console.log("hydrateAuthFromStorage: Invalid token cleared");
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
    console.log("clearAuthFromStorage: Token removed from AsyncStorage");
};

// New function to check if user has a valid token (more reliable for authentication state)
export const hasValidToken = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log("hasValidToken: Retrieved token from AsyncStorage", token);
    
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
        // Clear invalid token
        await AsyncStorage.removeItem('token');
        return false;
    }
};
