import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import {
  getPatientById,
  getVaccinationRecordByPatientId,
  saveVaccinationRecord,
  type PatientProfile,
  type VaccinationRecord,
} from '@/utils/storage';
import { shareDocument, exportVaccinationAsFile } from '@/utils/documentGenerator';

const vaccinationSchedule = [
  { period: 'Naissance', vaccine: 'BCG' },
  { period: '6 Semaines', vaccine: 'DTC-Hep B+Hib 1' },
  { period: '6 Semaines', vaccine: 'Pneumo 13-1' },
  { period: '6 Semaines', vaccine: 'VPO-1' },
  { period: '6 Semaines', vaccine: 'ROTA-1' },
  { period: '10 Semaines', vaccine: 'DTC-Hep B+Hib 2' },
  { period: '10 Semaines', vaccine: 'Pneumo 13-2' },
  { period: '10 Semaines', vaccine: 'VPO-2' },
  { period: '10 Semaines', vaccine: 'ROTA-2' },
  { period: '14 Semaines', vaccine: 'DTC-Hep B+Hib 3' },
  { period: '14 Semaines', vaccine: 'Pneumo 13-3' },
  { period: '14 Semaines', vaccine: 'VPO-3' },
  { period: '14 Semaines', vaccine: 'ROTA-3' },
  { period: '9 Mois', vaccine: 'Vit A' },
  { period: '9 Mois', vaccine: 'VAR' },
  { period: '9 Mois', vaccine: 'VAA' },
];

const PatientVaccinationScreen = () => {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [vaccinationData, setVaccinationData] = useState<VaccinationRecord>({
    id: '',
    patient_id: patientId || '',
    patient_name: '',
    patient_age: '',
    vaccinations: {},
    updated_at: '',
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const patientData = await getPatientById(patientId);
      setPatient(patientData);

      if (patientData) {
        let record = await getVaccinationRecordByPatientId(patientId);
        if (!record) {
          record = {
            id: patientId,
            patient_id: patientId,
            patient_name: `${patientData.nom} ${patientData.prenom}`,
            patient_age: patientData.age,
            vaccinations: {},
            updated_at: new Date().toISOString(),
          };
        }
        setVaccinationData(record);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const updateVaccination = (vaccine: string, received: boolean) => {
    setVaccinationData(prev => ({
      ...prev,
      vaccinations: {
        ...prev.vaccinations,
        [vaccine]: received,
      },
      updated_at: new Date().toISOString(),
    }));
  };

  const handleSave = async () => {
    try {
      await saveVaccinationRecord(vaccinationData);
      Alert.alert(
        'Succès',
        'Calendrier vaccinal sauvegardé!',
        [
          {
            text: 'Retour au profil',
            onPress: () => router.replace(`/patient/${patientId}` as any),
          },
          {
            text: 'Rester ici',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le calendrier');
    }
  };

  const handleExport = async () => {
    try {
      await exportVaccinationAsFile(vaccinationData);
      Alert.alert('Succès', 'Calendrier vaccinal exporté avec succès!');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter le calendrier');
    }
  };

  const getCompletionPercentage = () => {
    const completedVaccinations = vaccinationSchedule.filter(item => 
      vaccinationData.vaccinations[item.vaccine]
    ).length;
    return Math.round((completedVaccinations / vaccinationSchedule.length) * 100);
  };

  if (loading || !patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const completionPercentage = getCompletionPercentage();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Calendrier Vaccinal',
          headerStyle: { backgroundColor: '#ffc107' },
          headerTintColor: '#fff',
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ffc107']}
            tintColor="#ffc107"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.patientName}>
            {patient.nom} {patient.prenom}
          </Text>
          <Text style={styles.patientAge}>Âge: {patient.age} ans</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Complété à {completionPercentage}%
            </Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Période</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Vaccin</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Reçu</Text>
          </View>

          {vaccinationSchedule.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.period}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.vaccine}</Text>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Switch
                  value={vaccinationData.vaccinations[item.vaccine] || false}
                  onValueChange={(value) => updateVaccination(item.vaccine, value)}
                  trackColor={{ false: '#e9ecef', true: '#28a745' }}
                  thumbColor={vaccinationData.vaccinations[item.vaccine] ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Résumé</Text>
          <Text style={styles.summaryText}>
            Vaccinations reçues: {vaccinationSchedule.filter(item => vaccinationData.vaccinations[item.vaccine]).length}/{vaccinationSchedule.length}
          </Text>
          <Text style={styles.summaryText}>
            Taux de complétion: {completionPercentage}%
          </Text>
          <Text style={styles.summaryText}>
            Dernière mise à jour: {new Date(vaccinationData.updated_at).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>💾 Enregistrer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.exportButton]}
            onPress={handleExport}
          >
            <Text style={styles.buttonText}>📄 Exporter (DOC)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>⬅️ Retour au profil</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    backgroundColor: '#ffc107',
    padding: 24,
    alignItems: 'center',
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  patientAge: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
    fontWeight: 'bold',
    color: 'white',
  },
  tableContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffc107',
    padding: 12,
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableCell: {
    fontSize: 14,
    color: '#495057',
  },
  summaryCard: {
    backgroundColor: '#fff3cd',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  actionButtons: {
    padding: 20,
    gap: 12,
    paddingBottom: 32,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  exportButton: {
    backgroundColor: '#007bff',
  },
  backButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PatientVaccinationScreen;
