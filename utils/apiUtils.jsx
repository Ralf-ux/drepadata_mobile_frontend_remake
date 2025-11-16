import { store } from '@/redux/store';
import { setCredentials, clearCredentials } from '@/redux/authSlice';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
const SECRET_KEY = 'c4b6d9c150c8e9e09c7d5f4d7548c0a019ccaab7ac4fe76d5574ac3b3de03973';

// Function to decrypt the token
export const decryptToken = (encryptedToken, iv) => {
  try {
    const parsedKey = CryptoJS.enc.Hex.parse(SECRET_KEY);
    const decodedIv = CryptoJS.enc.Base64.parse(iv);

    const decrypted = CryptoJS.AES.decrypt(encryptedToken, parsedKey, {
      iv: decodedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) {
      throw new Error('Decryption resulted in an empty string');
    }
    return decryptedStr;
  } catch (error) {
    throw new Error(`Failed to decrypt token: ${error.message}`);
  }
};

const fetchWithAuth = async (endpoint, options = {}) => {
  const state = store.getState();
  let token = state.auth.token;
  let iv = state.auth.iv;

  if (!token || !iv) {
    token = await AsyncStorage.getItem('token');
    iv = await AsyncStorage.getItem('iv');
  }

  if (token && iv) {
    const decryptedToken = decryptToken(token, iv);
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${decryptedToken}`,
    };
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'An unknown error occurred.';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || JSON.stringify(errorJson);
    } catch (e) {
      errorMessage = errorText;
    }
    Alert.alert('API Error', errorMessage);
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export const get = (endpoint) => fetchWithAuth(endpoint);

export const post = (endpoint, body) => {
  const isFormData = body instanceof FormData;
  return fetchWithAuth(endpoint, {
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body),
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  });
};

export const put = (endpoint, body) => {
  const isFormData = body instanceof FormData;
  return fetchWithAuth(endpoint, {
    method: 'PUT',
    body: isFormData ? body : JSON.stringify(body),
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  });
};

export const del = (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' });
