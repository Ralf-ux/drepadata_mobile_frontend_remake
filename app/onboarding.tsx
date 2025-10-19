// app/(tabs)/onboarding.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface OnboardingProps {
  onComplete?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const router = useRouter();

  useEffect(() => {
    // Auto-advance to home after 3 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <LinearGradient
        colors={['#f5f3f3ff', '#fcf5f5ff', '#fcf5f5ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.splashContainer}
      >
        <View style={styles.splashContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/drepa.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>DREPADATA</Text>

          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f39f9fff',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  splashContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#343a40',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6c757d',
    lineHeight: 24,
    marginBottom: 40,
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default Onboarding;