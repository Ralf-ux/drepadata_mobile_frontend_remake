import { register } from '@/api/users';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Briefcase, Building, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('doctor');
  const [facility, setFacility] = useState('Centre Hospitalier Nicolas Barre');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    console.log('handleSubmit called'); // Added log
    try {
      console.log('Attempting registration'); // Added log
      await register({
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        facility,
      });
      console.log('Registration successful'); // Added log
      router.replace('/(auth)/login');
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'You can now log in with your new account!',
      });
    } catch (err) {
      console.error('Registration failed:', err); // Modified log
      setError('Registration failed. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: (err as any).message || 'Please try again.',
      });
      console.error(err);
    } finally {
      setLoading(false);
      console.log('handleSubmit completed'); // Added log
    }
  };

  const roles = ['admin', 'doctor', 'nurse', 'aps', 'lab_technician', 'other'];
  const facilities = [
    'Centre Hospitalier Nicolas Barre',
    'Centre Hospitalier d\'Essos',
    'Hôpital de District de la Cite Verte',
    'Hôpital Gynéco-Obstétrique et pédiatrique de Yaoundé',
    'Hôpital Monseigneur Jean Zoa de Nkoldongo',
    'Hôpital Catholique Sainte Marie des Anges de Nkoabang',
    'Hôpital Laquintinie de Douala',
    'Hôpital Catholique Albert Legrand de Bonaberi',
    'Fondation Padre Pio',
    'Hôpital Ad Lucem de Bonamousadi',
    'Others'
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('@/assets/images/drepa.png')} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.inputContainer}>
        <User color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Mail color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Lock color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff color="gray" /> : <Eye color="gray" />}
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <User color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <User color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Briefcase color="gray" style={styles.icon} />
        <Picker
          selectedValue={role}
          style={styles.input}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          {roles.map(r => <Picker.Item key={r} label={r} value={r} />)}
        </Picker>
      </View>
      
      <View style={styles.inputContainer}>
        <Building color="gray" style={styles.icon} />
        <Picker
          selectedValue={facility}
          style={styles.input}
          onValueChange={(itemValue) => setFacility(itemValue)}
        >
          {facilities.map(f => <Picker.Item key={f} label={f} value={f} />)}
        </Picker>
      </View>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => {
        console.log('Login link pressed'); // Added log
        router.push('/(auth)/login');
      }}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E84855',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    color: '#E84855',
    textAlign: 'center',
    paddingBottom: 20,
  },
});

export default Register;
