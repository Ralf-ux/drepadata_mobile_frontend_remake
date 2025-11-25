/* PatientVaccinationScreen.tsx – Professional Medical Vaccination */
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
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPatientById } from '@/utils/storage/patientStorage';
import { getVaccinationsByPatientId, saveVaccination } from '@/utils/storage/vaccinationStorage';
import { PatientProfile, VaccinationRecord } from '@/utils/types';
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

/* ------------------------------------------------------------- */
/* DESIGN SYSTEM                                                 */
/* ------------------------------------------------------------- */
const COLORS = {
  bg: '#FFF1F2',
  bgSecondary: '#FFF7ED',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  red: '#DC2626',
  redLight: '#FCA5A5',
  redBg: '#FEE2E2',
  rose: '#F43F5E',
  roseLight: '#FDA4AF',
  roseBg: '#FFE4E6',
  amber: '#F59E0B',
  amberBg: '#FEF3C7',
  emerald: '#10B981',
  emeraldBg: '#D1FAE5',
  border: '#FFE4E6',
  borderLight: '#FFF1F2',
  shadow: 'rgba(220, 38, 38, 0.15)',
};

const SPACING = 8;
const RADIUS = 12;

const Icon = ({ name, size = 20, color = COLORS.textPrimary }: any) => (
  <Ionicons name={name} size={size} color={color} />
);

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
        const records = await getVaccinationsByPatientId(patientId);
        let record = records.length > 0 ? records[0] : null;
        if (!record) {
          record = {
            id: '',
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
      await saveVaccination(vaccinationData);
      Alert.alert(
        'Succès',
        'Calendrier vaccinal sauvegardé!',
        [
          {
            text: 'Retour au profil',
            onPress: () => router.replace(`/patient/${patientId}` as any),
          },
          { text: 'Rester ici', style: 'cancel' },
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
    const completed = vaccinationSchedule.filter(item =>
      vaccinationData.vaccinations[item.vaccine]
    ).length;
    return Math.round((completed / vaccinationSchedule.length) * 100);
  };

  if (loading || !patient) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.amber} />
        <Text style={styles.loadingText}>Chargement du patient...</Text>
      </View>
    );
  }

  const completionPercentage = getCompletionPercentage();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Calendrier Vaccinal',
          headerStyle: { backgroundColor: COLORS.amber },
          headerTintColor: '#fff',
        }}
      />

      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.amber}
            colors={[COLORS.amber]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.patientName}>
              {patient.nom} {patient.prenom}
            </Text>
            <Text style={styles.patientAge}>Âge: {patient.age} ans</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Complété à {completionPercentage}%
            </Text>
          </View>
        </View>

        {/* Vaccination Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Période</Text>
            <Text style={[styles.headerText, { flex: 3 }]}>Vaccin</Text>
            <Text style={[styles.headerText, { flex: 2, textAlign: 'center' }]}>Reçu</Text>
          </View>

          {vaccinationSchedule.map((item, index) => {
            const isReceived = vaccinationData.vaccinations[item.vaccine] || false;
            return (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowEven,
                ]}
              >
                <Text style={[styles.cell, { flex: 2 }]}>{item.period}</Text>
                <Text style={[styles.cell, { flex: 3 }]}>{item.vaccine}</Text>
                <View style={{ flex: 2, alignItems: 'center' }}>
                  <Switch
                    value={isReceived}
                    onValueChange={(value) => updateVaccination(item.vaccine, value)}
                    trackColor={{ false: COLORS.borderLight, true: COLORS.emerald }}
                    thumbColor={isReceived ? COLORS.white : COLORS.textTertiary}
                    ios_backgroundColor={COLORS.borderLight}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="bar-chart" size={20} color={COLORS.amber} />
            <Text style={styles.summaryTitle}>Résumé du calendrier</Text>
          </View>
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

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Icon name="save" size={18} color={COLORS.white} />
            <Text style={styles.btnText}>Enregistrer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
            <Icon name="document" size={18} color={COLORS.white} />
            <Text style={styles.btnText}>Exporter (DOC)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={18} color={COLORS.white} />
            <Text style={styles.btnText}>Retour au profil</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

/* ------------------------------------------------------------- */
/* STYLES – 100% CONSISTENT WITH HomeScreen.tsx                  */
/* ------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },

  // Loading
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING * 4,
  },
  loadingText: {
    marginTop: SPACING * 2,
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  // Header
  header: {
    backgroundColor: COLORS.amber,
    padding: SPACING * 3,
    alignItems: 'center',
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: SPACING * 2,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING / 2,
  },
  patientAge: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
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
    marginBottom: SPACING,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.emerald,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Table Card
  tableCard: {
    margin: SPACING * 3,
    marginTop: SPACING * 2,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.amberBg,
    padding: SPACING * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tableRowEven: {
    backgroundColor: COLORS.bgSecondary,
  },
  cell: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  // Summary Card
  summaryCard: {
    marginHorizontal: SPACING * 3,
    marginTop: SPACING,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING * 2.5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING,
    marginBottom: SPACING,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING / 2,
  },

  // Actions
  actions: {
    padding: SPACING * 3,
    gap: SPACING * 1.5,
    paddingBottom: SPACING * 5,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.emerald,
    paddingVertical: SPACING * 1.8,
    paddingHorizontal: SPACING * 3,
    borderRadius: RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING,
  },
  exportBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.rose,
    paddingVertical: SPACING * 1.8,
    paddingHorizontal: SPACING * 3,
    borderRadius: RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING,
  },
  backBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.red,
    paddingVertical: SPACING * 1.8,
    paddingHorizontal: SPACING * 3,
    borderRadius: RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default PatientVaccinationScreen;