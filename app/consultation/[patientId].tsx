import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { FileText, Activity, Syringe } from 'lucide-react-native';
import {
  getPatientById,
  getConsultationsByPatientId,
  type PatientProfile,
} from '@/utils/storage';

const ConsultationChoiceScreen = () => {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasInitialConsultation, setHasInitialConsultation] = useState(false);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const patientData = await getPatientById(patientId);
      setPatient(patientData);

      const consultations = await getConsultationsByPatientId(patientId);
      const initialConsult = consultations.find(c => c.consultation_type === 'initial');
      setHasInitialConsultation(!!initialConsult);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialConsultation = () => {
    if (hasInitialConsultation) {
      Alert.alert(
        'Consultation initiale existante',
        'Ce patient a déjà une consultation initiale. Voulez-vous créer une nouvelle consultation initiale?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Continuer',
            onPress: () => router.push(`/(tabs)/consultations` as any),
          },
        ]
      );
    } else {
      router.push(`/(tabs)/consultations` as any);
    }
  };

  const handleFollowUp = () => {
    router.push(`/follow-up/${patientId}` as any);
  };

  const handleVaccination = () => {
    router.push(`/vaccination/${patientId}` as any);
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
          title: 'Type de consultation',
          headerStyle: { backgroundColor: '#dc3545' },
          headerTintColor: '#fff',
        }}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choisir le type de consultation</Text>
          <Text style={styles.subtitle}>
            Patient: {patient.nom} {patient.prenom}
          </Text>
          <Text style={styles.patientInfo}>
            {patient.age} ans • {patient.type_de_drepanocytose}
          </Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              { backgroundColor: '#dc3545' },
              hasInitialConsultation && styles.optionCardDisabled,
            ]}
            onPress={handleInitialConsultation}
          >
            <FileText size={48} color="white" />
            <Text style={styles.optionTitle}>Consultation Initiale</Text>
            <Text style={styles.optionDescription}>
              {hasInitialConsultation 
                ? 'Déjà effectuée pour ce patient'
                : 'Première consultation complète avec tous les antécédents'}
            </Text>
            {hasInitialConsultation && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ Complété</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: '#28a745' }]}
            onPress={handleFollowUp}
          >
            <Activity size={48} color="white" />
            <Text style={styles.optionTitle}>Consultation de Suivi</Text>
            <Text style={styles.optionDescription}>
              Suivi trimestriel (tous les 3 mois) pour évaluer l'évolution
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: '#ffc107' }]}
            onPress={handleVaccination}
          >
            <Syringe size={48} color="white" />
            <Text style={styles.optionTitle}>Calendrier Vaccinal</Text>
            <Text style={styles.optionDescription}>
              Gestion et suivi du calendrier de vaccination du patient
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>⬅️ Retour au profil</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#dc3545',
    fontWeight: '600',
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 14,
    color: '#6c757d',
  },
  options: {
    gap: 20,
    marginBottom: 32,
  },
  optionCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    minHeight: 200,
    justifyContent: 'center',
  },
  optionCardDisabled: {
    opacity: 0.7,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ConsultationChoiceScreen;
