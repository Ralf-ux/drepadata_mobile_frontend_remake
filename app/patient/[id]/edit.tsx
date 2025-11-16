import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getPatientById, updatePatient, type PatientProfile } from '@/utils/storage';
import PatientUpdateModal from '@/components/patient-update-modal';

const EditPatientScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    if (!id) {
      console.log('No patient ID provided');
      setLoading(false);
      return;
    }

    console.log('Loading patient data for ID:', id);
    setLoading(true);
    try {
      const patientData = await getPatientById(id);
      console.log('Patient data retrieved:', patientData);
      setPatient(patientData);
    } catch (error) {
      console.error('Error loading patient data:', error);
      setPatient(null);
    } finally {
      console.log('Finished loading, setting loading to false');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatientData();
    setRefreshing(false);
  };

  const handleUpdatePatient = async (updatedPatient: PatientProfile) => {
    if (!id) return;

    try {
      await updatePatient(id, updatedPatient);
      Alert.alert('Succès', 'Les informations du patient ont été mises à jour avec succès!');
      setPatient(updatedPatient);
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating patient:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour les informations du patient');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Patient non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#dc3545']}
            tintColor="#dc3545"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Modifier patient</Text>
          <Text style={styles.subtitle}>
            ID: {patient.numero_identification_unique}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.patientName}>
            {patient.nom} {patient.prenom}
          </Text>
          <Text style={styles.patientInfo}>
            Sexe: {patient.sexe} • Type: {patient.type_de_drepanocytose}
          </Text>
          <Text style={styles.patientInfo}>
            {patient.telephone_patient ? `Téléphone: ${patient.telephone_patient}` : ''}
          </Text>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            Appuyez sur le bouton "Modifier" ci-dessous pour ouvrir le formulaire de modification.
            Vous pourrez mettre à jour toutes les informations du patient.
          </Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Informations disponibles</Text>
            <Text style={styles.actionText}>
              • Coordonnées complètes
            </Text>
            <Text style={styles.actionText}>
              • Informations médicales
            </Text>
            <Text style={styles.actionText}>
              • Contact d'urgence
            </Text>
            <Text style={styles.actionText}>
              • Informations sociales
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PatientUpdateModal
          visible={showUpdateModal}
          patient={patient}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdatePatient}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.buttonSpacer} />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowUpdateModal(true)}
          >
            <Text style={styles.editButtonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
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
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  infoCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  instructions: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actions: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default EditPatientScreen;