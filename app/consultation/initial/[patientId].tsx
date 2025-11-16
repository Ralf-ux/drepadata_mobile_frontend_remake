import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import {
  saveConsultation,
  getPatientById,
  getConsultationsByPatientId,
  type ConsultationData,
  type PatientProfile,
} from '@/utils/storage';

const InitialConsultationScreen = () => {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState({ field: '', visible: false });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState<ConsultationData>({
    id: uuidv4(),
    patient_id: patientId || '',
    consultation_type: 'initial',
    consultation_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    // Initialize optional fields to undefined or appropriate defaults
    cvo_3_derniers_mois: undefined,
    hospitalisations_3_derniers_mois: undefined,
    hospitalization_cause: undefined,
    longest_hospitalization: undefined, // Assuming this should be a string as per interface
    taux_hemoglobine_recent: undefined,
    taux_hbf_recent: undefined,
    taux_hbs_recent: undefined,
    reticulocytes: undefined,
    nfs_gb: undefined,
    nfs_pqts: undefined,
    hydroxyurea: undefined,
    tolerance: undefined,
    posologie_hydroxyurea: undefined,
    hydroxyurea_reasons: undefined,
    folic_acid: undefined,
    antibio_prophylaxie: undefined,
    regular_transfusion: undefined,
    type_transfusion_sanguine: undefined,
    frequence_transfusion_3mois: undefined,
    last_transfusion_date: undefined,
    autres_traitements_specifiques: undefined,
    observance: undefined, // Assuming string as per interface
    impact_scolaire: undefined,
    participation_causeries: undefined,
    suivie_psychologique: undefined,
    education_therapeutique: undefined,
    visite_domicile: undefined,
    soutien_social: undefined,
    evolution: undefined,
    date_prochaine_consultation_plan: undefined,
    examens_avant_consultation: undefined, // Assuming any[] as per interface
    commentaires: undefined,
  });

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const patientData = await getPatientById(patientId);
      setPatient(patientData);

      if (patientData) {
        // No need to populate static fields from patient profile anymore
        // They are now stored in the patient profile itself
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Rest of the component - form implementation would go here
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Consultation Initiale',
          headerStyle: { backgroundColor: '#dc3545' },
          headerTintColor: '#fff',
        }}
      />
      <ScrollView style={styles.content}>
        <Text style={styles.stepTitle}>Étape {currentStep} sur {totalSteps}</Text>
        {/* Form steps would be implemented here */}
        <Text>Formulaire de consultation initiale en cours d'implémentation</Text>
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    color: '#dc3545',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default InitialConsultationScreen;
