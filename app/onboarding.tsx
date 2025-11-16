// app/onboarding.tsx
import { FileText, Heart, Stethoscope, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setOnboardingComplete } from '../utils/storage';
import { setCredentials } from '@/redux/authSlice';
import { store } from '@/redux/store';

const OnboardingScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Heart,
      title: 'Suivi des patients',
      description:
        'Application mobile dédiée au suivi en temps réel des patients atteints de drépanocytose',
      color: '#dc3545',
    },
    {
      icon: Stethoscope,
      title: 'Consultations complètes',
      description:
        'Enregistrez les consultations initiales et les suivis trimestriels de manière structurée',
      color: '#28a745',
    },
    {
      icon: Users,
      title: 'Gestion centralisée',
      description:
        'Créez des profils patients détaillés et suivez leur évolution sur plusieurs années',
      color: '#007bff',
    },
    {
      icon: FileText,
      title: 'Documents & Rapports',
      description:
        'Générez et partagez des rapports médicaux complets en quelques clics',
      color: '#ffc107',
    },
  ];

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await setOnboardingComplete();
      await AsyncStorage.clear();
      store.dispatch(setCredentials({ token: null, user: null }));
      // tiny delay guarantees storage flush before navigation
      setTimeout(() => router.replace('/(auth)/login'), 50);
    }
  };

  const handleSkip = async () => {
    await setOnboardingComplete();
    store.dispatch(setCredentials({ token: null, user: null }));
    setTimeout(() => router.replace('/(auth)/login'), 50);
  };

  const { icon: Icon, title, description, color } = slides[currentSlide];

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: color }]}>
            <Icon size={80} color="white" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color }]}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentSlide && styles.paginationDotActive,
                index === currentSlide && { backgroundColor: color },
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Passer</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentSlide < slides.length - 1 ? 'Suivant' : 'Commencer'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: { marginTop: 60, marginBottom: 48 },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  content: { alignItems: 'center', paddingHorizontal: 24 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 26,
  },
  pagination: { flexDirection: 'row', marginTop: 48, gap: 8 },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  paginationDotActive: { width: 32 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 48,
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  skipButtonText: { fontSize: 16, color: '#6B7280', fontWeight: '600' },
  nextButton: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;