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
import { ConsultationProvider, useConsultation } from '../../../utils/consultationContext';
import { getPatientById, type PatientProfile, saveConsultation } from '../../../utils/storage';
import { generateConsultationDocument } from '../../../utils/documentGenerator';
import { Share } from 'react-native';
import Step1 from '../../../components/consultation/steps/Step1';
import Step2 from '../../../components/consultation/steps/Step2';
import Step3 from '../../../components/consultation/steps/Step3';
import Step4 from '../../../components/consultation/steps/Step4';
import Step5 from '../../../components/consultation/steps/Step5';
import Step6 from '../../../components/consultation/steps/Step6';
import Step7 from '../../../components/consultation/steps/Step7';
import Step8 from '../../../components/consultation/steps/Step8';
import Step9 from '../../../components/consultation/steps/Step9';

const { width } = Dimensions.get('window');

const ConsultationWizard = () => {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { formData, updateFormData, resetForm } = useConsultation();

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const patientData = await getPatientById(patientId);
      setPatient(patientData);

      // Pre-fill consultation form with patient data to reduce redundancy
      updateFormData('full_name', `${patientData.nom} ${patientData.prenom}`);
      updateFormData('sex', patientData.sexe);
      updateFormData('sickle_type', patientData.type_de_drepanocytose);
      updateFormData('diagnosis_age', patientData.age_diagnostic);
      updateFormData('diagnosis_circumstance', patientData.circonstances_du_diagnostic);
      updateFormData('family_history', patientData.antecedent_familiaux);
      updateFormData('rang_fratrie', patientData.rang_dans_fratrie);
      updateFormData('nombre_drepanocytaire_fratrie', patientData.nombre_de_drepanocytaires_dans_fratrie);
      updateFormData('diagnostic_date', patientData.date_diagnostic || '');
      updateFormData('gs_rh', patientData.groupe_sanguin_rhesus);
      updateFormData('age', patientData.age);
      updateFormData('birth_date', patientData.date_naissance || '');
      updateFormData('quartier', patientData.quartier);
      updateFormData('lieu_dit', patientData.lieu_dit);
      updateFormData('emergency_contact_name', patientData.contact_urgence_nom);
      updateFormData('emergency_contact_phone', patientData.contact_urgence_telephone);
      updateFormData('emergency_contact_relation', patientData.contact_urgence_relation);
      updateFormData('patient_phone_number', patientData.telephone_patient);
      updateFormData('vit_avec_patient', patientData.vit_avec_le_patient ? 'Oui' : 'Non');
      updateFormData('lien_avec_patient', patientData.lien_avec_patient);
      updateFormData('insurance', patientData.assurance);
      updateFormData('appartient_groupe', patientData.appartient_a_groupe ? 'Oui' : 'Non');
      updateFormData('nom_groupe_association', patientData.nom_du_groupe);
      updateFormData('region', patientData.region);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    let valid = true;
    let error = '';

    switch (currentStep) {
      case 1:
        if (!formData.fosa || !formData.region || !formData.district) {
          error = 'Veuillez remplir tous les champs requis (FOSA, Région, District).';
          valid = false;
        }
        break;
      case 2:
        if (!formData.full_name || !formData.sex) {
          error = 'Veuillez remplir tous les champs requis (Nom complet, Sexe).';
          valid = false;
        }
        break;
      case 3:
        if (!formData.sickle_type) {
          error = 'Veuillez sélectionner le type de drépanocytose.';
          valid = false;
        }
        break;
      default:
        break;
    }

    if (!valid) {
      Alert.alert('Erreur de validation', error);
    }

    return valid;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    if (validateStep()) {
      try {
        const timestamp = new Date().toISOString();
        const consultationData = {
          ...formData,
          created_at: timestamp,
          updated_at: timestamp,
        };

        await saveConsultation(consultationData);

        // Generate and share document
        try {
          const documentContent = generateConsultationDocument(consultationData);
          await Share.share({
            message: documentContent,
            title: `Consultation - ${formData.full_name}`,
          });
        } catch (shareError) {
          console.log('Share cancelled or failed');
        }

        Alert.alert(
          'Succès',
          'Consultation sauvegardée avec succès!',
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
        Alert.alert('Erreur', error.message || 'Impossible de sauvegarder la consultation');
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      case 6: return <Step6 />;
      case 7: return <Step7 />;
      case 8: return <Step8 />;
      case 9: return <Step9 />;
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
          title: `Étape ${currentStep} sur ${totalSteps}`,
          headerStyle: { backgroundColor: '#dc3545' },
          headerTintColor: '#fff',
        }}
      />

      <View style={styles.header}>
        <Text style={styles.patientName}>{patient.nom} {patient.prenom}</Text>
        <Text style={styles.patientInfo}>
          {patient.age} ans • {patient.type_de_drepanocytose}
        </Text>
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
            <Text style={styles.buttonText}>💾 Sauvegarder</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const InitialConsultationScreen = () => {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();

  return (
    <ConsultationProvider initialPatientId={patientId}>
      <ConsultationWizard />
    </ConsultationProvider>
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
  header: {
    backgroundColor: '#dc3545',
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
    backgroundColor: '#dc3545',
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
    backgroundColor: '#dc3545',
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

export default InitialConsultationScreen;
