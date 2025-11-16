import { useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { clearCredentials } from '@/redux/authSlice';
import { store } from '@/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearAuthFromStorage } from '@/utils/authUtils';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    console.log("logout: Clearing credentials and AsyncStorage");
    store.dispatch(clearCredentials());
    // Add a small delay to ensure Redux state updates
    await new Promise(resolve => setTimeout(resolve, 100));
    await AsyncStorage.clear();
    await clearAuthFromStorage();
    router.replace('/(auth)/login');
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;