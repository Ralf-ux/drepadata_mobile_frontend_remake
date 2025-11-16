import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import {
  saveFollowUp,
  getPatientById,
  getFollowUpsByPatientId,
  type FollowUpData,
  type PatientProfile,
} from '@/utils/storage';

const { width } = Dimensions.get('window');

const FollowUpConsultationScreen = () => {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followUpNumber, setFollowUpNumber] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState({ field: '', visible: false });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState<FollowUpData>({
    id: uuidv4(),
    patient_id: patientId || '',
    follow_up_number: 1,
    follow_up_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    // Initialize optional fields to undefined or appropriate defaults
    poids: undefined,
    taille: undefined,
    cvo_3_derniers_mois: undefined,
    hospitalisations_3_derniers_mois: undefined,
    hospitalization_cause: undefined,
    taux_hemoglobine_recent: undefined,
    taux_hbf_recent: undefined,
    taux_hbs_recent: undefined,
    hydroxyurea: undefined,
    tolerance: undefined,
    posologie_hydroxyurea: undefined,
    folic_acid: undefined,
    antibio_prophylaxie: undefined,
    regular_transfusion: undefined,
    type_transfusion_sanguine: undefined,
    frequence_transfusion_3mois: undefined,
    last_transfusion_date: undefined,
    autres_traitements_specifiques: undefined,
    observance: undefined, // Assuming string as per interface
    nfs_gb: undefined,
    nfs_hb: undefined,
    nfs_pqts: undefined,
    reticulocytes: undefined,
    microalbuminuria: undefined,
    impact_scolaire: undefined,
    participation_causeries: undefined,
    suivie_psychologique: undefined,
    education_therapeutique: undefined,
    visite_domicile: undefined,
    soutien_social: undefined,
    evolution: undefined,
    commentaires: undefined,
    date_prochaine_consultation: undefined,
    priority: undefined,
  });

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      if (!patientId) return;

      const patientData = await getPatientById(patientId);
      setPatient(patientData);

      const existingFollowUps = await getFollowUpsByPatientId(patientId);
      setFollowUpNumber(existingFollowUps.length + 1);
      setFormData(prev => ({ ...prev, follow_up_number: existingFollowUps.length + 1 }));
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: keyof FollowUpData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = (key: keyof FollowUpData, value: string) => {
    const current = (formData[key] as string[]) || [];
    if (current.includes(value)) {
      updateFormData(key, current.filter(v => v !== value));
    } else {
      updateFormData(key, [...current, value]);
    }
  };

  const renderNumericFieldWithQuickOptions = (
    field: keyof FollowUpData,
    label: string,
    options: number[],
    unit = ''
  ) => {
    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.quickOptionsContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.quickOption,
                formData[field] === option.toString() && styles.quickOptionSelected
              ]}
              onPress={() => updateFormData(field, option.toString())}
            >
              <Text style={[
                styles.quickOptionText,
                formData[field] === option.toString() && styles.quickOptionTextSelected
              ]}>
                {option}{unit}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={formData[field] as string}
          onChangeText={value => updateFormData(field, value)}
          placeholder={`Valeur exacte ${unit}`}
          keyboardType="numeric"
        />
      </View>
    );
  };

  const renderDatePicker = (field: keyof FollowUpData, label: string) => {
    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker({ field: field as string, visible: true })}
        >
          <Text style={styles.dateText}>
            {formData[field] ? new Date(formData[field] as string).toLocaleDateString('fr-FR') : 'Sélectionner date'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>📊 Mesures et Complications</Text>

      {renderNumericFieldWithQuickOptions('poids', 'Poids (kg)', [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100], ' kg')}
      {renderNumericFieldWithQuickOptions('taille', 'Taille (cm)', [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190], ' cm')}

      <View style={styles.formGroup}>
        <Text style={styles.label}>CVO au cours des 3 derniers mois</Text>
        <Picker
          selectedValue={formData.cvo_3_derniers_mois}
          onValueChange={value => updateFormData('cvo_3_derniers_mois', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="0" value="0" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="1-2" value="1-2" />
          <Picker.Item label="3-5" value="3-5" />
          <Picker.Item label="Plus de 5" value="Plus de 5" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Hospitalisations lors des 3 derniers mois</Text>
        <Picker
          selectedValue={formData.hospitalisations_3_derniers_mois}
          onValueChange={value => updateFormData('hospitalisations_3_derniers_mois', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="0" value="0" />
          <Picker.Item label="Moins de 2" value="Moins de 2" />
          <Picker.Item label="2-5" value="2-5" />
          <Picker.Item label="6-8" value="6-8" />
          <Picker.Item label="9-10" value="9-10" />
          <Picker.Item label="Plus de 10" value="Plus de 10" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cause principale d'hospitalisation</Text>
        <Picker
          selectedValue={formData.hospitalization_cause}
          onValueChange={value => updateFormData('hospitalization_cause', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="CVO" value="CVO" />
          <Picker.Item label="Ostéomyélite" value="Ostéomyélite" />
          <Picker.Item label="STA" value="STA" />
          <Picker.Item label="Accès Palustre" value="Accès Palustre" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>🔬 Examens de Laboratoire</Text>

      {renderNumericFieldWithQuickOptions('taux_hemoglobine_recent', 'Taux d\'hémoglobine (g/dl)', [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], ' g/dl')}
      {renderNumericFieldWithQuickOptions('taux_hbf_recent', 'Taux HbF (%)', [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], '%')}
      {renderNumericFieldWithQuickOptions('taux_hbs_recent', 'Taux HbS (%)', [50, 60, 70, 80, 90, 95], '%')}
      {renderNumericFieldWithQuickOptions('nfs_gb', 'NFS - GB (x10³/μL)', [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20], ' x10³/μL')}
      {renderNumericFieldWithQuickOptions('nfs_hb', 'NFS - Hb (g/dL)', [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], ' g/dL')}
      {renderNumericFieldWithQuickOptions('nfs_pqts', 'NFS - Plaquettes (x10³/μL)', [150, 200, 250, 300, 350, 400, 450, 500], ' x10³/μL')}
      {renderNumericFieldWithQuickOptions('reticulocytes', 'Réticulocytes (%)', [2, 5, 10, 15, 20, 25, 30], '%')}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Microalbuminurie</Text>
        <Picker
          selectedValue={formData.microalbuminuria}
          onValueChange={value => updateFormData('microalbuminuria', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Positive" value="Positive" />
          <Picker.Item label="Négative" value="Négative" />
          <Picker.Item label="Non fait" value="Non fait" />
        </Picker>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>💊 Traitements Actuels</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Hydroxyurée</Text>
        <Picker
          selectedValue={formData.hydroxyurea}
          onValueChange={value => updateFormData('hydroxyurea', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.hydroxyurea === 'Oui' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tolérance</Text>
            <Picker
              selectedValue={formData.tolerance}
              onValueChange={value => updateFormData('tolerance', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Bonne tolérance" value="Bonne tolérance" />
              <Picker.Item label="Tolérance moyenne" value="Tolérance moyenne" />
              <Picker.Item label="Mauvaise tolérance" value="Mauvaise tolérance" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Posologie de l'hydroxyurée (mg/kg/jour)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.posologie_hydroxyurea}
              onChangeText={value => updateFormData('posologie_hydroxyurea', value)}
              placeholder="Dosage en mg/kg/jour"
            />
          </View>
        </>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Acide folique</Text>
        <Picker
          selectedValue={formData.folic_acid}
          onValueChange={value => updateFormData('folic_acid', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Antibioprophylaxie</Text>
        <Picker
          selectedValue={formData.antibio_prophylaxie}
          onValueChange={value => updateFormData('antibio_prophylaxie', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Transfusion régulière</Text>
        <Picker
          selectedValue={formData.regular_transfusion}
          onValueChange={value => updateFormData('regular_transfusion', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.regular_transfusion === 'Oui' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Type de transfusion sanguine</Text>
            <Picker
              selectedValue={formData.type_transfusion_sanguine}
              onValueChange={value => updateFormData('type_transfusion_sanguine', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Sang Total" value="Sang Total" />
              <Picker.Item label="Culot globulaire" value="Culot globulaire" />
              <Picker.Item label="Sang fractionné" value="Sang fractionné" />
              <Picker.Item label="Plaquettes" value="Plaquettes" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Fréquence de transfusion durant les trois derniers mois</Text>
            <Picker
              selectedValue={formData.frequence_transfusion_3mois}
              onValueChange={value => updateFormData('frequence_transfusion_3mois', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="0-1 poche" value="0-1 poche" />
              <Picker.Item label="2-4 poches" value="2-4 poches" />
              <Picker.Item label="3-5 poches" value="3-5 poches" />
              <Picker.Item label="6-8 poches" value="6-8 poches" />
              <Picker.Item label="Plus de 8 poches" value="Plus de 8 poches" />
            </Picker>
          </View>

          {renderDatePicker('last_transfusion_date', 'Dernière transfusion')}
        </>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Autres traitements spécifiques</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.autres_traitements_specifiques}
          onChangeText={value => updateFormData('autres_traitements_specifiques', value)}
          placeholder="Traitements spécifiques additionnels"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Observance</Text>
        {['Mois 1', 'Mois 2', 'Mois 3'].map(option => (
          <View key={option} style={styles.checkboxItem}>
            <Switch
              value={((formData.observance as string[]) || []).includes(option)}
              onValueChange={() => handleCheckbox('observance', option)}
              trackColor={{ false: '#e9ecef', true: '#dc3545' }}
            />
            <Text style={styles.checkboxLabel}>{option}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>📚 Impact Psychosocial</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Impact scolaire/professionnel</Text>
        <Picker
          selectedValue={formData.impact_scolaire}
          onValueChange={value => updateFormData('impact_scolaire', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Aucun" value="Aucun" />
          <Picker.Item label="Léger" value="Léger" />
          <Picker.Item label="Modéré" value="Modéré" />
          <Picker.Item label="Sévère" value="Sévère" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Participation à des causeries éducatives</Text>
        <Picker
          selectedValue={formData.participation_causeries}
          onValueChange={value => updateFormData('participation_causeries', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Suivi psychologique</Text>
        <Picker
          selectedValue={formData.suivie_psychologique}
          onValueChange={value => updateFormData('suivie_psychologique', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Éducation thérapeutique</Text>
        <Picker
          selectedValue={formData.education_therapeutique}
          onValueChange={value => updateFormData('education_therapeutique', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Visite à domicile</Text>
        <Picker
          selectedValue={formData.visite_domicile}
          onValueChange={value => updateFormData('visite_domicile', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Soutien social</Text>
        <Picker
          selectedValue={formData.soutien_social}
          onValueChange={value => updateFormData('soutien_social', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Text style={styles.stepTitle}>📝 Évolution et Commentaires</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Évolution depuis la dernière consultation</Text>
        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          multiline
          numberOfLines={5}
          value={formData.evolution}
          onChangeText={value => updateFormData('evolution', value)}
          placeholder="Décrivez l'évolution du patient"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Commentaires généraux</Text>
        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          multiline
          numberOfLines={5}
          value={formData.commentaires}
          onChangeText={value => updateFormData('commentaires', value)}
          placeholder="Observations, recommandations..."
        />
      </View>

      {renderDatePicker('date_prochaine_consultation', 'Date de la prochaine consultation')}

      {patient && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Résumé du Suivi</Text>
          <Text style={styles.summaryText}>Patient: {patient.nom} {patient.prenom}</Text>
          <Text style={styles.summaryText}>Type: {patient.type_de_drepanocytose}</Text>
          <Text style={styles.summaryText}>Suivi N°: {followUpNumber}</Text>
          <Text style={styles.summaryText}>Poids: {formData.poids} kg</Text>
          <Text style={styles.summaryText}>Taille: {formData.taille} cm</Text>
          <Text style={styles.summaryText}>Hb: {formData.taux_hemoglobine_recent} g/dl</Text>
          <Text style={styles.summaryText}>Hydroxyurée: {formData.hydroxyurea}</Text>
        </View>
      )}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
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
      await saveFollowUp({ ...formData, created_at: timestamp, updated_at: timestamp });

      Alert.alert(
        'Succès',
        'Consultation de suivi sauvegardée avec succès!',
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
      Alert.alert('Erreur', 'Impossible de sauvegarder la consultation de suivi');
    }
  };

  if (loading) {
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
          headerStyle: { backgroundColor: '#dc3545' },
          headerTintColor: '#fff',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {patient && (
          <View style={styles.patientHeader}>
            <Text style={styles.patientName}>{patient.nom} {patient.prenom}</Text>
            <Text style={styles.patientInfo}>
              {patient.age} ans • {patient.type_de_drepanocytose}
            </Text>
            <Text style={styles.followUpBadge}>Suivi Trimestriel N°{followUpNumber}</Text>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: `${(currentStep / totalSteps) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Étape {currentStep} sur {totalSteps}</Text>
        </View>

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

      {showDatePicker.visible && (
        <DateTimePicker
          value={formData[showDatePicker.field as keyof FollowUpData] ? new Date(formData[showDatePicker.field as keyof FollowUpData] as string) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker({ field: '', visible: false });
            if (selectedDate) updateFormData(showDatePicker.field as keyof FollowUpData, selectedDate.toISOString());
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  patientHeader: {
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
  stepContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    color: '#dc3545',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#495057',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#495057',
  },
  picker: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  dateButton: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 16,
    color: '#495057',
  },
  quickOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  quickOption: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  quickOptionSelected: {
    backgroundColor: '#28a745',
  },
  quickOptionText: {
    fontSize: 14,
    color: '#495057',
  },
  quickOptionTextSelected: {
    color: 'white',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#495057',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#dc3545',
    fontWeight: '600',
  },
});

export default FollowUpConsultationScreen;
