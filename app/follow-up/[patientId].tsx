import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { FollowUpProvider, useFollowUp } from '@/utils/followUpContext';
import { getPatientById, getFollowUpsByPatientId, type PatientProfile, saveFollowUp } from '@/utils/storage';
import { generateFollowUpDocument } from '@/utils/documentGenerator';
import { Share } from 'react-native';
import FollowUpStep1 from '@/components/followup/steps/FollowUpStep1';
import FollowUpStep2 from '@/components/followup/steps/FollowUpStep2';
import FollowUpStep3 from '@/components/followup/steps/FollowUpStep3';
import FollowUpStep4 from '@/components/followup/steps/FollowUpStep4';
import FollowUpStep5 from '@/components/followup/steps/FollowUpStep5';

const { width } = Dimensions.get('window');

const FollowUpWizard = () => {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followUpNumber, setFollowUpNumber] = useState(1);
  const { formData, updateFormData, resetForm } = useFollowUp();

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const patientData = await getPatientById(patientId);
      setPatient(patientData);

      // Get existing follow-ups to determine the next number
      const existingFollowUps = await getFollowUpsByPatientId(patientId);
      const nextNumber = existingFollowUps.length + 1;
      setFollowUpNumber(nextNumber);
      updateFormData('follow_up_number', nextNumber);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    try {
      const timestamp = new Date().toISOString();
      const followUpData = {
        ...formData,
        created_at: timestamp,
        updated_at: timestamp,
      };

      await saveFollowUp(followUpData);

      // Generate and share document
      try {
        const documentContent = generateFollowUpDocument(followUpData);
        await Share.share({
          message: documentContent,
          title: `Suivi N°${followUpNumber} - ${patient?.nom} ${patient?.prenom}`,
        });
      } catch (shareError) {
        console.log('Share cancelled or failed');
      }

      Alert.alert(
        'Succès',
        'Consultation de suivi sauvegardée avec succès!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm(patientId);
              router.replace(`/patient/${patientId}` as any);
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de sauvegarder la consultation de suivi');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <FollowUpStep1 />;
      case 2: return <FollowUpStep2 />;
      case 3: return <FollowUpStep3 />;
      case 4: return <FollowUpStep4 />;
      case 5: return <FollowUpStep5 />;
      default: return null;
    }
  };

  if (loading || !patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Suivi N°${followUpNumber}`,
          headerStyle: { backgroundColor: '#28a745' },
          headerTintColor: '#fff',
        }}
      />

      <View style={styles.patientHeader}>
        <Text style={styles.patientName}>{patient.nom} {patient.prenom}</Text>
        <Text style={styles.patientInfo}>
          {patient.age} ans • {patient.type_de_drepanocytose}
        </Text>
        <Text style={styles.followUpBadge}>Suivi Trimestriel N°{followUpNumber}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressBar, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Étape {currentStep} sur {totalSteps}</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContainer}>
          {renderCurrentStep()}
        </View>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            currentStep === 1 && styles.disabledButton
          ]}
          onPress={prevStep}
          disabled={currentStep === 1}
        >
          <Text style={[styles.buttonText, currentStep === 1 && styles.disabledButtonText]}>
            ⬅️ Précédent
          </Text>
        </TouchableOpacity>

        {currentStep < totalSteps ? (
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={nextStep}>
            <Text style={styles.buttonText}>Suivant ➡️</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.successButton]} onPress={submitForm}>
            <Text style={styles.buttonText}>💾 Sauvegarder Suivi</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const FollowUpConsultationScreen = () => {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();

  return (
    <FollowUpProvider initialPatientId={patientId}>
      <FollowUpWizard />
    </FollowUpProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  patientHeader: {
    backgroundColor: '#28a745',
    padding: 20,
    alignItems: 'center',
  },
  patientName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  patientInfo: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  followUpBadge: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  scrollContainer: {
    flex: 1,
  },
  stepContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: width * 0.4,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#28a745',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  disabledButton: {
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#adb5bd',
  },
});

export default FollowUpConsultationScreen;
