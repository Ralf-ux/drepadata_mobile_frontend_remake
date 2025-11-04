import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  User,
  FileText,
  Activity,
  Syringe,
  Download,
  Edit,
} from 'lucide-react-native';
import {
  getPatientById,
  getConsultationsByPatientId,
  getFollowUpsByPatientId,
  getVaccinationRecordByPatientId,
  type PatientProfile,
  type ConsultationData,
  type FollowUpData,
  type VaccinationRecord,
} from '@/utils/storage';
import {
  generateCompletePatientDocument,
  generateFormattedHTMLDocument,
  shareDocument,
  exportCompletePatientAsFile,
} from '@/utils/documentGenerator';

const PatientProfileScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpData[]>([]);
  const [vaccination, setVaccination] = useState<VaccinationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      if (patientData) {
        console.log('Loading additional data for patient:', patientData.nom, patientData.prenom);
        // Load additional data in parallel for better performance
        const [consultationsData, followUpsData, vaccinationData] = await Promise.all([
          getConsultationsByPatientId(id),
          getFollowUpsByPatientId(id),
          getVaccinationRecordByPatientId(id)
        ]);

        console.log('Additional data loaded:', {
          consultations: consultationsData.length,
          followUps: followUpsData.length,
          vaccination: vaccinationData ? 'exists' : 'none'
        });

        setConsultations(consultationsData);
        setFollowUps(followUpsData);
        setVaccination(vaccinationData);
      } else {
        console.log('No patient found with ID:', id);
      }
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

  const handleExportDocument = async () => {
    if (!patient) return;

    try {
      await exportCompletePatientAsFile(
        patient,
        consultations,
        followUps,
        vaccination,
        'rtf'
      );
      Alert.alert('Succès', 'Dossier exporté avec succès!');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter le document');
    }
  };

  const calculateProgress = (): number => {
    const totalMonths = 5 * 12;
    const expectedFollowUps = Math.floor(totalMonths / 3);
    const completedFollowUps = followUps.length;
    return Math.min((completedFollowUps / expectedFollowUps) * 100, 100);
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

  const progress = calculateProgress();

  return (
    <ScrollView
      style={styles.container}
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
        <View style={styles.patientIcon}>
          <User size={48} color="white" />
        </View>
        <Text style={styles.patientName}>
          {patient.nom} {patient.prenom}
        </Text>
        <Text style={styles.patientId}>ID: {patient.numero_identification_unique}</Text>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Suivi du traitement</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {followUps.length} suivis effectués • {Math.round(progress)}% complété
        </Text>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <FileText size={24} color="#007bff" />
          <Text style={styles.statValue}>{consultations.length}</Text>
          <Text style={styles.statLabel}>Consultations</Text>
        </View>
        <View style={styles.statItem}>
          <Activity size={24} color="#28a745" />
          <Text style={styles.statValue}>{followUps.length}</Text>
          <Text style={styles.statLabel}>Suivis</Text>
        </View>
        <View style={styles.statItem}>
          <Syringe size={24} color="#ffc107" />
          <Text style={styles.statValue}>{vaccination ? '1' : '0'}</Text>
          <Text style={styles.statLabel}>Vaccinations</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sexe</Text>
            <Text style={styles.infoValue}>{patient.sexe}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Âge</Text>
            <Text style={styles.infoValue}>{patient.age} ans</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{patient.type_de_drepanocytose}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Groupe sanguin</Text>
            <Text style={styles.infoValue}>{patient.groupe_sanguin_rhesus || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.infoText}>Téléphone: {patient.telephone_patient || 'N/A'}</Text>
        <Text style={styles.infoText}>
          Adresse: {patient.quartier || 'N/A'}, {patient.lieu_dit || 'N/A'}
        </Text>
        <Text style={styles.infoText}>Région: {patient.region || 'N/A'}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact d\'urgence</Text>
        <Text style={styles.infoText}>{patient.contact_urgence_nom || 'N/A'}</Text>
        <Text style={styles.infoText}>
          {patient.contact_urgence_relation || 'N/A'} • {patient.contact_urgence_telephone || 'N/A'}
        </Text>
      </View>

      {patient.patient_refere && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations de référencement</Text>
          <Text style={styles.infoText}>Référé de: {patient.patient_refere_de || 'N/A'}</Text>
          <Text style={styles.infoText}>Référé pour: {patient.patient_refere_pour || 'N/A'}</Text>
        </View>
      )}

      {patient.appartient_a_groupe && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations sociales</Text>
          <Text style={styles.infoText}>Groupe: {patient.nom_du_groupe || 'N/A'}</Text>
          <Text style={styles.infoText}>Rang dans la fratrie: {patient.rang_dans_fratrie || 'N/A'}</Text>
          <Text style={styles.infoText}>Drépanocytaires dans la fratrie: {patient.nombre_de_drepanocytaires_dans_fratrie || 'N/A'}</Text>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations médicales</Text>
        <Text style={styles.infoText}>Âge au diagnostic: {patient.age_diagnostic || 'N/A'}</Text>
        <Text style={styles.infoText}>Circonstances du diagnostic: {patient.circonstances_du_diagnostic || 'N/A'}</Text>
        <Text style={styles.infoText}>Antécédents familiaux: {patient.antecedent_familiaux || 'N/A'}</Text>
        <Text style={styles.infoText}>Autres antécédents: {patient.autres_antecedents_medicaux || 'N/A'}</Text>
        {patient.allergies_connues && (
          <Text style={styles.infoText}>Allergies: {patient.details_allergies || 'Oui'}</Text>
        )}
        <Text style={styles.infoText}>Assurance: {patient.assurance || 'N/A'}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
          onPress={() => router.push(`/consultation/${id}` as any)}
        >
          <FileText size={20} color="white" />
          <Text style={styles.actionButtonText}>Nouvelle consultation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#28a745' }]}
          onPress={() => router.push(`/follow-up/${id}` as any)}
        >
          <Activity size={20} color="white" />
          <Text style={styles.actionButtonText}>Suivi trimestriel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ffc107' }]}
          onPress={() => router.push(`/vaccination/${id}` as any)}
        >
          <Syringe size={20} color="white" />
          <Text style={styles.actionButtonText}>Calendrier vaccinal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007bff' }]}
          onPress={handleExportDocument}
        >
          <Download size={20} color="white" />
          <Text style={styles.actionButtonText}>Exporter dossier (Word)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    padding: 24,
    alignItems: 'center',
  },
  patientIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  patientId: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  progressSection: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#6c757d',
  },
  quickStats: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  infoText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  actions: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default PatientProfileScreen;
