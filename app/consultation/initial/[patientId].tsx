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

    // Dynamic consultation fields
    vocs: '',
    cvo_3_derniers_mois: '',
    hospitalizations: '',
    hospitalisations_3_derniers_mois: '',
    nombre_hospitalisations_3mois: '',
    hospitalization_cause: '',
    longest_hospitalization: '',
    hb_1: '',
    hb_2: '',
    hb_3: '',
    taux_hemoglobine_recent: '',
    taux_hbf_recent: '',
    taux_hbs_recent: '',
    hbf_1: '',
    hbf_2: '',
    hbf_3: '',
    hbs_1: '',
    hbs_2: '',
    hbs_3: '',
    transfusion_reaction: '',
    reaction_types: [],
    reaction_type_other: '',
    allo_immunization: '',
    hyperviscosity: '',
    acute_chest_syndrome: '',
    acute_event: '',
    acute_event_details: '',
    stroke: '',
    priapism: '',
    leg_ulcer: '',
    cholecystectomy: '',
    asplenia: '',
    recommended_vaccines: [],
    drug_side_effects: '',

    hydroxyurea: '',
    tolerance: '',
    hydroxyurea_reasons: '',
    hydroxyurea_dosage: '',
    posologie_hydroxyurea: '',
    folic_acid: '',
    antibio_prophylaxie: '',
    regular_transfusion: '',
    transfusion_type: '',
    type_transfusion_sanguine: '',
    transfusion_frequency: '',
    frequence_transfusion_3mois: '',
    last_transfusion_date: '',
    autres_traitements_specifiques: '',
    observance: [],

    nfs_gb: '',
    nfs_hb: '',
    nfs_pqts: '',
    reticulocytes: '',
    microalbuminuria: '',
    hemolysis: '',
    gs_rh: '',
    imagerie_medical: '',
    ophtalmologie: '',
    consultations_specialisees: '',
    examen_du_jour: '',

    impact_scolaire: '',
    participation_causeries: '',
    suivie_psychologique: '',
    education_therapeutique: '',
    consultation_psychologique: '',
    visite_domicile: '',
    soutien_social: '',
    soutien_social_options: [],
    impact_social: '',
    accompagnement_special: '',
    famille_informee: '',
    plan_suivi_personnalise: '',
    date_prochaine_consultation: '',

    examens_avant_consultation: [],
    evolution: '',
    education_therapeutique_step8: '',
    date_prochaine_consultation_plan: '',

    commentaires: '',

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
