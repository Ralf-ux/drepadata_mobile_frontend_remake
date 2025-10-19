import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllConsultations, ConsultationData, PatientIdentity, getPatientIdentities, savePatientIdentity } from '../../utils/storage';

const { width } = Dimensions.get('window');

export default function Patient() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [patients, setPatients] = useState<PatientIdentity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientIdentity | null>(null);

  // Patient creation form state
  const [patientForm, setPatientForm] = useState<PatientIdentity>({
    id: '',
    nom: '',
    prenom: '',
    sexe: '',
    date_diagnostic: '',
    age_diagnostic: 0,
    circonstances_diagnostic: '',
    numero_identification_unique: '',
    rang_fratrie: 0,
    nb_enfants_drepanocytaires: 0,
    type_drepanocytose: '',
    antecedents_personnels: '',
    antecedents_familiaux: '',
    groupe_sanguin_rhesus: '',
    vaccins_naissance: '',
    created_at: '',
    updated_at: '',
  });

  const loadData = async () => {
    try {
      const [consultationsData, patientsData] = await Promise.all([
        getAllConsultations(),
        getPatientIdentities()
      ]);
      setConsultations(consultationsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCreatePatient = async () => {
    // Validate required fields
    if (!patientForm.nom || !patientForm.prenom || !patientForm.sexe ||
        !patientForm.date_diagnostic || !patientForm.numero_identification_unique ||
        !patientForm.type_drepanocytose || !patientForm.groupe_sanguin_rhesus) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
      return;
    }

    try {
      const newPatient: PatientIdentity = {
        ...patientForm,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      };

      await savePatientIdentity(newPatient);

      // Reset form
      setPatientForm({
        id: '',
        nom: '',
        prenom: '',
        sexe: '',
        date_diagnostic: '',
        age_diagnostic: 0,
        circonstances_diagnostic: '',
        numero_identification_unique: '',
        rang_fratrie: 0,
        nb_enfants_drepanocytaires: 0,
        type_drepanocytose: '',
        antecedents_personnels: '',
        antecedents_familiaux: '',
        groupe_sanguin_rhesus: '',
        vaccins_naissance: '',
        created_at: '',
        updated_at: '',
      });

      setShowCreateForm(false);
      loadData(); // Refresh data

      Alert.alert('Succès', 'Profil patient créé avec succès');
    } catch (error) {
      console.error('Error creating patient:', error);
      Alert.alert('Erreur', 'Impossible de créer le profil patient');
    }
  };

  const handleStartConsultation = (patient: PatientIdentity) => {
    // Navigate to consultation with patient data
    router.push({
      pathname: '/consultation',
      params: { patientId: patient.id }
    });
  };

  const getPatientConsultations = (patientId: string) => {
    return consultations.filter(c => c.patient_id === patientId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (showCreateForm) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#dc2626', '#b91c1c']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Créer un profil patient</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCreateForm(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                value={patientForm.nom}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, nom: value }))}
                placeholder="Nom du patient"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                value={patientForm.prenom}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, prenom: value }))}
                placeholder="Prénom du patient"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sexe *</Text>
              <View style={styles.pickerContainer}>
                {['M', 'F'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.pickerOption,
                      patientForm.sexe === option && styles.pickerOptionSelected
                    ]}
                    onPress={() => setPatientForm(prev => ({ ...prev, sexe: option }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      patientForm.sexe === option && styles.pickerOptionTextSelected
                    ]}>
                      {option === 'M' ? 'Masculin' : 'Féminin'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations médicales</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date de diagnostic *</Text>
              <TextInput
                style={styles.input}
                value={patientForm.date_diagnostic}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, date_diagnostic: value }))}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Âge au diagnostic</Text>
              <TextInput
                style={styles.input}
                value={patientForm.age_diagnostic.toString()}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, age_diagnostic: parseInt(value) || 0 }))}
                placeholder="Âge en années"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Circonstances du diagnostic</Text>
              <TextInput
                style={styles.input}
                value={patientForm.circonstances_diagnostic}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, circonstances_diagnostic: value }))}
                placeholder="Comment le diagnostic a été posé"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Numéro d'identification unique *</Text>
              <TextInput
                style={styles.input}
                value={patientForm.numero_identification_unique}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, numero_identification_unique: value }))}
                placeholder="PAT-XXXXX"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type de drépanocytose *</Text>
              <View style={styles.pickerContainer}>
                {['SS', 'SC', 'Sβ⁰', 'Sβ⁺'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.pickerOption,
                      patientForm.type_drepanocytose === option && styles.pickerOptionSelected
                    ]}
                    onPress={() => setPatientForm(prev => ({ ...prev, type_drepanocytose: option }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      patientForm.type_drepanocytose === option && styles.pickerOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Groupe sanguin - Rhésus *</Text>
              <View style={styles.pickerContainer}>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.pickerOption,
                      patientForm.groupe_sanguin_rhesus === option && styles.pickerOptionSelected
                    ]}
                    onPress={() => setPatientForm(prev => ({ ...prev, groupe_sanguin_rhesus: option }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      patientForm.groupe_sanguin_rhesus === option && styles.pickerOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations familiales</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rang dans la fratrie</Text>
              <TextInput
                style={styles.input}
                value={patientForm.rang_fratrie.toString()}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, rang_fratrie: parseInt(value) || 0 }))}
                placeholder="Position dans la fratrie"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre d'enfants drépanocytaires</Text>
              <TextInput
                style={styles.input}
                value={patientForm.nb_enfants_drepanocytaires.toString()}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, nb_enfants_drepanocytaires: parseInt(value) || 0 }))}
                placeholder="Nombre de frères/sœurs atteints"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Antécédents</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Antécédents personnels</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={patientForm.antecedents_personnels}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, antecedents_personnels: value }))}
                placeholder="Historique médical personnel"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Antécédents familiaux</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={patientForm.antecedents_familiaux}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, antecedents_familiaux: value }))}
                placeholder="Historique médical familial"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vaccins à la naissance</Text>
              <TextInput
                style={styles.input}
                value={patientForm.vaccins_naissance}
                onChangeText={(value) => setPatientForm(prev => ({ ...prev, vaccins_naissance: value }))}
                placeholder="BCG, Polio, etc."
              />
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreatePatient}>
            <Text style={styles.createButtonText}>Créer le profil patient</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#dc2626', '#b91c1c']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>👥 Patients</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateForm(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#dc2626"
            colors={['#dc2626']}
          />
        }
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{patients.length}</Text>
            <Text style={styles.statLabel}>Profils</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{consultations.length}</Text>
            <Text style={styles.statLabel}>Consultations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {patients.filter(p => p.type_drepanocytose === 'SS').length}
            </Text>
            <Text style={styles.statLabel}>Type SS</Text>
          </View>
        </View>

        {/* Patients List */}
        <View style={styles.listContainer}>
          {patients.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyTitle}>Aucun profil patient</Text>
              <Text style={styles.emptyDesc}>
                Créez votre premier profil patient pour commencer
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setShowCreateForm(true)}
              >
                <Text style={styles.emptyBtnText}>Créer un profil</Text>
              </TouchableOpacity>
            </View>
          ) : (
            patients.map((patient) => {
              const patientConsultations = getPatientConsultations(patient.id);
              return (
                <View key={patient.id} style={styles.patientCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.patientInfo}>
                      <Text style={styles.patientName}>
                        {patient.nom} {patient.prenom}
                      </Text>
                      <Text style={styles.patientDetails}>
                        {patient.type_drepanocytose} · {patient.groupe_sanguin_rhesus} · {patient.sexe}
                      </Text>
                      <Text style={styles.patientId}>
                        ID: {patient.numero_identification_unique}
                      </Text>
                    </View>
                    <View style={styles.consultationCount}>
                      <Text style={styles.consultationCountText}>
                        {patientConsultations.length}
                      </Text>
                      <Text style={styles.consultationCountLabel}>consultations</Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.consultationBtn}
                      onPress={() => handleStartConsultation(patient)}
                    >
                      <Text style={styles.consultationBtnText}>Nouvelle consultation</Text>
                    </TouchableOpacity>
                  </View>

                  {patientConsultations.length > 0 && (
                    <View style={styles.recentConsultations}>
                      <Text style={styles.recentTitle}>Dernières consultations:</Text>
                      {patientConsultations.slice(0, 2).map((consultation) => (
                        <Text key={consultation.id} style={styles.recentConsultation}>
                          {formatDate(consultation.created_at)} - {consultation.consultation_type === 'initial' ? 'Initiale' : 'Suivi'}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  patientId: {
    fontSize: 12,
    color: '#9ca3af',
  },
  consultationCount: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  consultationCountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
  consultationCountLabel: {
    fontSize: 10,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  cardActions: {
    marginBottom: 12,
  },
  consultationBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  consultationBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recentConsultations: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  recentConsultation: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  pickerOptionSelected: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#dc2626',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});