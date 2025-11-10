
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
  Share
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { useRouter } from 'expo-router';
import { saveConsultation, ConsultationData, getPatientIdentity, PatientIdentity } from '../../utils/storage';
// import { generateConsultationDocument } from '../../utils/documentGenerator';

// Simple ID generation function to replace uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const { width } = Dimensions.get('window');

const ConsultationForm = () => {
   // const router = useRouter();
   const [currentStep, setCurrentStep] = useState(1);
   const totalSteps = 9;
   const [selectedPatient, setSelectedPatient] = useState<PatientIdentity | null>(null);
   const [showPatientForm, setShowPatientForm] = useState(true);

  const [formData, setFormData] = useState<ConsultationData>({
    id: generateId(),
    patient_id: generateId(), // Generate patient ID
    consultation_type: 'initial',
    // Step 1
    fosa: '',
    fosa_other: '',
    region: '',
    district: '',
    diagnostic_date: '',
    ipp: '',
    personnel: '',
    personnel_remplissant: '',
    poids: '',
    taille: '',
    referred: '',
    referred_from: '',
    referred_from_other: '',
    referred_for: '',

    // Step 2
    full_name: '',
    age: '',
    birth_date: '',
    sex: '',
    quartier: '',
    lieu_dit: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_relation: '',
    emergency_contact_phone: '',
    patient_phone: '',
    patient_phone_number: '',
    lives_with: '',
    vit_avec_patient: '',
    lien_avec_patient: '',
    insurance: '',
    insurance_other: '',
    support_group: '',
    group_name: '',
    appartient_groupe: '',
    nom_groupe_association: '',
    parents: '',
    sibling_rank: '',
    rang_fratrie: '',
    nombre_drepanocytaire_fratrie: '',

    // Step 3
    sickle_type: '',
    diagnosis_age: '',
    diagnosis_circumstance: '',
    family_history: '',
    other_medical_history: '',
    autres_antecedents_medicaux: '',
    other_medical_history_details: '',
    previous_surgeries: '',
    interventions_chirurgicales_anterieures: '',
    date_derniere_intervention: '',
    cause_derniere_intervention: '',
    acide_folique_step3: '',
    nombre_crises_vaso: '',
    allergies: '',
    allergies_details: '',

    // Step 4
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

    // Step 5
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

    // Step 6
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

    // Step 7
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

    // Step 8
    examens_avant_consultation: [''],
    evolution: '',
    education_therapeutique_step8: '',
    date_prochaine_consultation_plan: '',

    // Step 9
    commentaires: '',

    created_at: '',
    updated_at: '',
  });

  const [showDatePicker, setShowDatePicker] = useState({ field: '', visible: false });
  const [error, setError] = useState('');

  // Patient form state for consultation
  const [patientFormData, setPatientFormData] = useState({
    quartier: '',
    lieu_dit: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    patient_phone: '',
    vit_avec_patient: '',
    lien_avec_patient: '',
    referred: '',
    referred_from: '',
    referred_for: '',
    appartient_groupe: '',
    nom_groupe_association: '',
    rang_fratrie: '',
    nombre_drepanocytaire_fratrie: '',
    insurance: '',
    type_drepanocytose: '',
    diagnosis_age: '',
    diagnosis_circumstance: '',
    region: '',
    family_history: '',
    autres_antecedents_medicaux: '',
    allergies: '',
    allergies_details: '',
    groupe_sanguin_rhesus: '',
  });

  // Auto-calculate age and birth date
  // useEffect(() => {
  //   if (formData.age && !isNaN(Number(formData.age))) {
  //     const currentYear = new Date().getFullYear();
  //     const birthYear = currentYear - parseInt(formData.age);
  //     const newBirthDate = new Date(birthYear, 0, 1);
  //     setFormData(prev => ({ ...prev, birth_date: newBirthDate.toISOString() }));
  //   }
  // }, [formData.age]);

  // useEffect(() => {
  //   if (formData.birth_date && typeof formData.birth_date === 'string') {
  //     const currentDate = new Date();
  //     const birthDate = new Date(formData.birth_date);
  //     const ageInYears = Math.floor((currentDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  //     if (ageInYears !== parseInt(formData.age)) {
  //       setFormData(prev => ({ ...prev, age: ageInYears.toString() }));
  //     }
  //   }
  // }, [formData.birth_date]);

  useEffect(() => {
    const parts: string[] = [];
    if (formData.quartier) parts.push(formData.quartier);
    if (formData.lieu_dit) parts.push(formData.lieu_dit);
    setFormData(prev => ({ ...prev, address: parts.join(', ') }));
  }, [formData.quartier, formData.lieu_dit]);

  const updateFormData = (key: keyof ConsultationData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updatePatientFormData = (key: string, value: any) => {
    setPatientFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = (key: keyof ConsultationData, value: string) => {
    const current = (formData[key] as string[]) || [];
    if (current.includes(value)) {
      updateFormData(key, current.filter(v => v !== value));
    } else {
      updateFormData(key, [...current, value]);
    }
  };

  const validatePatientForm = () => {
    const requiredFields = [
      'quartier', 'emergency_contact_name', 'emergency_contact_phone',
      'emergency_contact_relation', 'patient_phone', 'vit_avec_patient',
      'lien_avec_patient', 'type_drepanocytose', 'region', 'groupe_sanguin_rhesus'
    ];

    for (const field of requiredFields) {
      if (!patientFormData[field as keyof typeof patientFormData]) {
        setError(`Veuillez remplir le champ: ${field.replace(/_/g, ' ')}`);
        return false;
      }
    }
    return true;
  };

  const validateStep = () => {
    let valid = true;
    setError('');

    switch (currentStep) {
      case 1:
        if (!formData.fosa || !formData.region || !formData.district) {
          setError('Veuillez remplir tous les champs requis (FOSA, Région, District).');
          valid = false;
        }
        break;
      case 2:
        if (!formData.full_name || !formData.sex) {
          setError('Veuillez remplir tous les champs requis (Nom complet, Sexe).');
          valid = false;
        }
        break;
      case 3:
        if (!formData.sickle_type) {
          setError('Veuillez sélectionner le type de drépanocytose.');
          valid = false;
        }
        break;
      default:
        break;
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

  const submitPatientForm = () => {
    if (validatePatientForm()) {
      // Copy patient form data to consultation form
      setFormData(prev => ({
        ...prev,
        quartier: patientFormData.quartier,
        lieu_dit: patientFormData.lieu_dit,
        emergency_contact_name: patientFormData.emergency_contact_name,
        emergency_contact_phone: patientFormData.emergency_contact_phone,
        emergency_contact_relation: patientFormData.emergency_contact_relation,
        patient_phone_number: patientFormData.patient_phone,
        vit_avec_patient: patientFormData.vit_avec_patient,
        lien_avec_patient: patientFormData.lien_avec_patient,
        referred: patientFormData.referred,
        referred_from: patientFormData.referred_from,
        referred_for: patientFormData.referred_for,
        appartient_groupe: patientFormData.appartient_groupe,
        nom_groupe_association: patientFormData.nom_groupe_association,
        rang_fratrie: patientFormData.rang_fratrie,
        nombre_drepanocytaire_fratrie: patientFormData.nombre_drepanocytaire_fratrie,
        insurance: patientFormData.insurance,
        sickle_type: patientFormData.type_drepanocytose,
        diagnosis_age: patientFormData.diagnosis_age,
        diagnosis_circumstance: patientFormData.diagnosis_circumstance,
        region: patientFormData.region,
        family_history: patientFormData.family_history,
        autres_antecedents_medicaux: patientFormData.autres_antecedents_medicaux,
        allergies: patientFormData.allergies,
        allergies_details: patientFormData.allergies_details,
        gs_rh: patientFormData.groupe_sanguin_rhesus,
      }));
      setShowPatientForm(false);
      setCurrentStep(1);
    }
  };

  const submitForm = async () => {
    if (validateStep()) {
      try {
        // Log the consultation submission with metadata
        console.log(`[${new Date().toISOString()}] ACTION: consultation_saved | METHOD: saveConsultation | PATH: localStorage | PATIENT: ${formData.full_name || 'Unknown'} | ID: ${formData.id} | TIMESTAMP: ${new Date().toISOString()}`);

        await saveConsultation(formData);

        // Generate and share document
        // const documentContent = generateConsultationDocument(formData);

        await Share.share({
          message: `Consultation sauvegardée pour ${formData.full_name}`,
          title: `Consultation - ${formData.full_name}`,
        });

        Alert.alert(
          'Succès',
          'Consultation sauvegardée avec succès!',
          [{
            text: 'OK',
            onPress: () => {
              // Reset form and go back to step 1
              setFormData({
                id: generateId(),
                patient_id: generateId(), // Generate patient ID
                consultation_type: 'initial',
                // Step 1
                fosa: '',
                fosa_other: '',
                region: '',
                district: '',
                diagnostic_date: '',
                ipp: '',
                personnel: '',
                personnel_remplissant: '',
                poids: '',
                taille: '',
                referred: '',
                referred_from: '',
                referred_from_other: '',
                referred_for: '',

                // Step 2
                full_name: '',
                age: '',
                birth_date: '',
                sex: '',
                quartier: '',
                lieu_dit: '',
                address: '',
                emergency_contact_name: '',
                emergency_contact_relation: '',
                emergency_contact_phone: '',
                patient_phone: '',
                patient_phone_number: '',
                lives_with: '',
                vit_avec_patient: '',
                lien_avec_patient: '',
                insurance: '',
                insurance_other: '',
                support_group: '',
                group_name: '',
                appartient_groupe: '',
                nom_groupe_association: '',
                parents: '',
                sibling_rank: '',
                rang_fratrie: '',
                nombre_drepanocytaire_fratrie: '',

                // Step 3
                sickle_type: '',
                diagnosis_age: '',
                diagnosis_circumstance: '',
                family_history: '',
                other_medical_history: '',
                autres_antecedents_medicaux: '',
                other_medical_history_details: '',
                previous_surgeries: '',
                interventions_chirurgicales_anterieures: '',
                date_derniere_intervention: '',
                cause_derniere_intervention: '',
                acide_folique_step3: '',
                nombre_crises_vaso: '',
                allergies: '',
                allergies_details: '',

                // Step 4
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

                // Step 5
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

                // Step 6
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

                // Step 7
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

                // Step 8
                examens_avant_consultation: [''],
                evolution: '',
                education_therapeutique_step8: '',
                date_prochaine_consultation_plan: '',

                // Step 9
                commentaires: '',

                created_at: '',
                updated_at: '',
              });
              setPatientFormData({
                quartier: '',
                lieu_dit: '',
                emergency_contact_name: '',
                emergency_contact_phone: '',
                emergency_contact_relation: '',
                patient_phone: '',
                vit_avec_patient: '',
                lien_avec_patient: '',
                referred: '',
                referred_from: '',
                referred_for: '',
                appartient_groupe: '',
                nom_groupe_association: '',
                rang_fratrie: '',
                nombre_drepanocytaire_fratrie: '',
                insurance: '',
                type_drepanocytose: '',
                diagnosis_age: '',
                diagnosis_circumstance: '',
                region: '',
                family_history: '',
                autres_antecedents_medicaux: '',
                allergies: '',
                allergies_details: '',
                groupe_sanguin_rhesus: '',
              });
              setCurrentStep(1);
              setShowPatientForm(true);
            }
          }]
        );
      } catch (error) {
        console.error('Error saving consultation:', error);
        Alert.alert('Erreur', 'Impossible de sauvegarder la consultation');
      }
    }
  };

  const addExamen = () => {
    updateFormData('examens_avant_consultation', [...formData.examens_avant_consultation, '']);
  };

  const updateExamen = (index: number, value: string) => {
    const updated = [...formData.examens_avant_consultation];
    updated[index] = value;
    updateFormData('examens_avant_consultation', updated);
  };

  const removeExamen = (index: number) => {
    if (formData.examens_avant_consultation.length > 1) {
      const updated = formData.examens_avant_consultation.filter((_, i) => i !== index);
      updateFormData('examens_avant_consultation', updated);
    }
  };

  const renderDatePicker = (field: keyof ConsultationData, label: string, required = false) => {
    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker({ field: field as string, visible: true })}
        >
          <Text style={styles.dateText}>
            {formData[field] ? new Date(formData[field] as string).toLocaleDateString() : 'Sélectionner date'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCheckboxGroup = (key: keyof ConsultationData, options: string[], label: string) => {
    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        {options.map(option => (
          <View key={option} style={styles.checkboxItem}>
            <Switch
              value={((formData[key] as string[]) || []).includes(option)}
              onValueChange={() => handleCheckbox(key, option)}
            />
            <Text style={styles.checkboxLabel}>{option}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderNumericFieldWithQuickOptions = (field: keyof ConsultationData, label: string, options: number[], unit = '') => {
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

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>📋 Informations administratives</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Structure de santé partenaire <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.fosa}
          onValueChange={value => updateFormData('fosa', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Centre Hospitalier Nicolas Barre" value="Centre Hospitalier Nicolas Barre" />
          <Picker.Item label="Centre Hospitalier d'Essos" value="Centre Hospitalier d'Essos" />
          <Picker.Item label="Hôpital de District de la Cite Verte" value="Hôpital de District de la Cite Verte" />
          <Picker.Item label="Hôpital Gynéco-Obstétrique et pédiatrique de Yaoundé" value="Hôpital Gynéco-Obstétrique et pédiatrique de Yaoundé" />
          <Picker.Item label="Hôpital Monseigneur Jean Zoa de Nkoldongo" value="Hôpital Monseigneur Jean Zoa de Nkoldongo" />
          <Picker.Item label="Hôpital Catholique Sainte Marie des Anges de Nkoabang" value="Hôpital Catholique Sainte Marie des Anges de Nkoabang" />
          <Picker.Item label="Hôpital Laquintinie de Douala" value="Hôpital Laquintinie de Douala" />
          <Picker.Item label="Hôpital Catholique Albert Legrand de Bonaberi" value="Hôpital Catholique Albert Legrand de Bonaberi" />
          <Picker.Item label="Fondation Padre Pio" value="Fondation Padre Pio"/>
          <Picker.Item label="Hôpital Ad Lucem de Bonaberi" value="Hôpital Ad Lucem de Bonaberi" />
          <Picker.Item label="Autres" value="Autres" />
        </Picker>
        {formData.fosa === 'Autres' && (
          <TextInput
            style={styles.input}
            placeholder="Veuillez préciser"
            value={formData.fosa_other}
            onChangeText={value => updateFormData('fosa_other', value)}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Personnel remplissant le formulaire</Text>
        <Picker
          selectedValue={formData.personnel_remplissant}
          onValueChange={value => updateFormData('personnel_remplissant', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Médecin" value="Medecin" />
          <Picker.Item label="Infirmier" value="Infirmier" />
          <Picker.Item label="APS (Accompagnateur Psychosocial)" value="APS" />
          <Picker.Item label="Laborantin" value="Laborantin" />
          <Picker.Item label="Autres" value="Autres" />
        </Picker>
      </View>

      {renderNumericFieldWithQuickOptions('poids', 'Poids (kg)', [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], ' kg')}

      {renderNumericFieldWithQuickOptions('taille', 'Taille (cm)', [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200], ' cm')}

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Région <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.region}
          onValueChange={value => updateFormData('region', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Centre" value="Centre" />
          <Picker.Item label="Littoral" value="Littoral" />
          <Picker.Item label="Ouest" value="Ouest" />
          <Picker.Item label="Nord-Ouest" value="Nord-Ouest" />
          <Picker.Item label="Sud-Ouest" value="Sud-Ouest" />
          <Picker.Item label="Est" value="Est" />
          <Picker.Item label="Nord" value="Nord" />
          <Picker.Item label="Adamaoua" value="Adamaoua" />
          <Picker.Item label="Extrême-Nord" value="Extrême-Nord" />
          <Picker.Item label="Sud" value="Sud" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          District <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.district}
          onChangeText={value => updateFormData('district', value)}
          placeholder="Entrer le district"
        />
      </View>

      {renderDatePicker('diagnostic_date', 'Date de diagnostic', true)}

      <View style={styles.formGroup}>
        <Text style={styles.label}>IPP</Text>
        <TextInput
          style={styles.input}
          value={formData.ipp}
          onChangeText={value => updateFormData('ipp', value)}
          placeholder="Numéro IPP"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Personnel médical</Text>
        <TextInput
          style={styles.input}
          value={formData.personnel}
          onChangeText={value => updateFormData('personnel', value)}
          placeholder="Nom du personnel médical"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Patient référé</Text>
        <Picker
          selectedValue={formData.referred}
          onValueChange={value => updateFormData('referred', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.referred === 'Oui' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Référé de</Text>
            <Picker
              selectedValue={formData.referred_from}
              onValueChange={value => updateFormData('referred_from', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Hôpital district" value="Hôpital district" />
              <Picker.Item label="Centre de santé" value="Centre de santé" />
              <Picker.Item label="Médecin privé" value="Médecin privé" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
            {formData.referred_from === 'Autres' && (
              <TextInput
                style={styles.input}
                placeholder="Veuillez préciser"
                value={formData.referred_from_other}
                onChangeText={value => updateFormData('referred_from_other', value)}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Référé pour</Text>
            <Picker
              selectedValue={formData.referred_for}
              onValueChange={value => updateFormData('referred_for', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Meilleure prise en charge" value="Meilleure prise en charge" />
              <Picker.Item label="Suivi trimestriel" value="Suivi trimestriel" />
              <Picker.Item label="Urgence" value="Urgence" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
          </View>
        </>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>👤 Données démographiques</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Nom et Prénom <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.full_name}
          onChangeText={value => updateFormData('full_name', value)}
          placeholder="Nom complet du patient"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Âge</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.age}
          onChangeText={value => updateFormData('age', value)}
          placeholder="Âge en années"
        />
      </View>

      {renderDatePicker('birth_date', 'Date de naissance')}

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Sexe <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.sex}
          onValueChange={value => updateFormData('sex', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Masculin" value="Masculin" />
          <Picker.Item label="Féminin" value="Féminin" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Lien avec le patient</Text>
        <Picker
          selectedValue={formData.lien_avec_patient}
          onValueChange={value => updateFormData('lien_avec_patient', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Père" value="Père" />
          <Picker.Item label="Mère" value="Mère" />
          <Picker.Item label="Grand-mère" value="Grand-mère" />
          <Picker.Item label="Grand-père" value="Grand-père" />
          <Picker.Item label="Frère" value="Frère" />
          <Picker.Item label="Sœur" value="Sœur" />
          <Picker.Item label="Oncle" value="Oncle" />
          <Picker.Item label="Tante" value="Tante" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Quartier</Text>
        <TextInput
          style={styles.input}
          value={formData.quartier}
          onChangeText={value => updateFormData('quartier', value)}
          placeholder="Nom du quartier"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Lieu-dit</Text>
        <TextInput
          style={styles.input}
          value={formData.lieu_dit}
          onChangeText={value => updateFormData('lieu_dit', value)}
          placeholder="Lieu-dit ou précision d'adresse"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact d'urgence - Nom</Text>
        <TextInput
          style={styles.input}
          value={formData.emergency_contact_name}
          onChangeText={value => updateFormData('emergency_contact_name', value)}
          placeholder="Nom du contact d'urgence"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact d\'urgence - Relation</Text>
        <TextInput
          style={styles.input}
          value={formData.emergency_contact_relation}
          onChangeText={value => updateFormData('emergency_contact_relation', value)}
          placeholder="Relation (parent, ami, etc.)"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact d'urgence - Téléphone</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={formData.emergency_contact_phone}
          onChangeText={value => updateFormData('emergency_contact_phone', value)}
          placeholder="Numéro de téléphone"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Téléphone du patient</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={formData.patient_phone_number}
          onChangeText={value => updateFormData('patient_phone_number', value)}
          placeholder="Numéro de téléphone du patient"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Vit avec le patient</Text>
        <Picker
          selectedValue={formData.vit_avec_patient}
          onValueChange={value => updateFormData('vit_avec_patient', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Appartient à un groupe/Association</Text>
        <Picker
          selectedValue={formData.appartient_groupe}
          onValueChange={value => updateFormData('appartient_groupe', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.appartient_groupe === 'Oui' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom du groupe/Association</Text>
          <TextInput
            style={styles.input}
            value={formData.nom_groupe_association}
            onChangeText={value => updateFormData('nom_groupe_association', value)}
            placeholder="Nom du groupe ou association"
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Rang dans la fratrie</Text>
        <Picker
          selectedValue={formData.rang_fratrie}
          onValueChange={value => updateFormData('rang_fratrie', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6" value="6" />
          <Picker.Item label="7" value="7" />
          <Picker.Item label="8" value="8" />
          <Picker.Item label="9" value="9" />
          <Picker.Item label="10" value="10" />
          <Picker.Item label="11" value="11" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre de drépanocytaires dans la fratrie</Text>
        <Picker
          selectedValue={formData.nombre_drepanocytaire_fratrie}
          onValueChange={value => updateFormData('nombre_drepanocytaire_fratrie', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="0" value="0" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6+" value="6+" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Assurance</Text>
        <Picker
          selectedValue={formData.insurance}
          onValueChange={value => updateFormData('insurance', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="CNPS" value="CNPS" />
          <Picker.Item label="CNAS" value="CNAS" />
          <Picker.Item label="Privée" value="Privée" />
          <Picker.Item label="Aucune" value="Aucune" />
          <Picker.Item label="Autres" value="Autres" />
        </Picker>
        {formData.insurance === 'Autres' && (
          <TextInput
            style={styles.input}
            placeholder="Préciser l'assurance"
            value={formData.insurance_other}
            onChangeText={value => updateFormData('insurance_other', value)}
          />
        )}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>🩺 Antécédents médicaux</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Type de drépanocytose <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.sickle_type}
          onValueChange={value => updateFormData('sickle_type', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="SS" value="SS" />
          <Picker.Item label="SC" value="SC" />
          <Picker.Item label="Sβ⁰" value="Sβ⁰" />
          <Picker.Item label="Sβ⁺" value="Sβ⁺" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Âge au diagnostic</Text>
        <Picker
          selectedValue={formData.diagnosis_age}
          onValueChange={value => updateFormData('diagnosis_age', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="À la naissance" value="À la naissance" />
          <Picker.Item label="0-3 mois" value="0-3 mois" />
          <Picker.Item label="4-6 mois" value="4-6 mois" />
          <Picker.Item label="7-12 mois" value="7-12 mois" />
          <Picker.Item label="2-3 ans" value="2-3 ans" />
          <Picker.Item label="4-5 ans" value="4-5 ans" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Circonstances du diagnostic</Text>
        <Picker
          selectedValue={formData.diagnosis_circumstance}
          onValueChange={value => updateFormData('diagnosis_circumstance', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Diagnostic néonatal" value="Diagnostic néonatal" />
          <Picker.Item label="Diagnostic à partir de la fratrie" value="Diagnostic à partir de la fratrie" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>CVO au cours des 3 derniers mois</Text>
        <Picker
          selectedValue={formData.nombre_crises_vaso}
          onValueChange={value => updateFormData('nombre_crises_vaso', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Aucune" value="Aucune" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="1-2" value="1-2" />
          <Picker.Item label="3-5" value="3-5" />
          <Picker.Item label="Plus de 5" value="Plus de 5" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Antécédents familiaux</Text>
        <Picker
          selectedValue={formData.family_history}
          onValueChange={value => updateFormData('family_history', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Inconnu" value="Inconnu" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Autres antécédents médicaux</Text>
        <Picker
          selectedValue={formData.autres_antecedents_medicaux}
          onValueChange={value => updateFormData('autres_antecedents_medicaux', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Néphropathie" value="Néphropathie" />
          <Picker.Item label="Cardiopathie" value="Cardiopathie" />
          <Picker.Item label="Méningite" value="Méningite" />
          <Picker.Item label="Autres" value="Autres" />
          <Picker.Item label="Aucun" value="Aucun" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Interventions chirurgicales antérieures</Text>
        <Picker
          selectedValue={formData.interventions_chirurgicales_anterieures}
          onValueChange={value => updateFormData('interventions_chirurgicales_anterieures', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.interventions_chirurgicales_anterieures === 'Oui' && (
        <>
          {renderDatePicker('date_derniere_intervention', 'Date de la dernière intervention chirurgicale')}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cause de la dernière intervention chirurgicale</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={2}
              value={formData.cause_derniere_intervention}
              onChangeText={value => updateFormData('cause_derniere_intervention', value)}
              placeholder="Motif de l'intervention"
            />
          </View>
        </>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Acide folique</Text>
        <Picker
          selectedValue={formData.acide_folique_step3}
          onValueChange={value => updateFormData('acide_folique_step3', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>🏥 Complications et traitements</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Hospitalisations au cours des 3 derniers mois</Text>
        <Picker
          selectedValue={formData.hospitalisations_3_derniers_mois}
          onValueChange={value => updateFormData('hospitalisations_3_derniers_mois', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.hospitalisations_3_derniers_mois === 'Oui' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre d'hospitalisations</Text>
            <Picker
              selectedValue={formData.nombre_hospitalisations_3mois}
              onValueChange={value => updateFormData('nombre_hospitalisations_3mois', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6+" value="6+" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cause de l'hospitalisation</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={2}
              value={formData.hospitalization_cause}
              onChangeText={value => updateFormData('hospitalization_cause', value)}
              placeholder="Cause de l'hospitalisation"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Durée de la plus longue hospitalisation (jours)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.longest_hospitalization}
              onChangeText={value => updateFormData('longest_hospitalization', value)}
              placeholder="Nombre de jours"
            />
          </View>
        </>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Réaction transfusionnelle</Text>
        <Picker
          selectedValue={formData.transfusion_reaction}
          onValueChange={value => updateFormData('transfusion_reaction', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.transfusion_reaction === 'Oui' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Types de réaction</Text>
            {renderCheckboxGroup('reaction_types', ['Fièvre', 'Frissons', 'Rash cutané', 'Dyspnée', 'Hypotension', 'Autres'], 'Types de réaction')}
          </View>

          {formData.reaction_types.includes('Autres') && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Autre réaction</Text>
              <TextInput
                style={styles.input}
                value={formData.reaction_type_other}
                onChangeText={value => updateFormData('reaction_type_other', value)}
                placeholder="Préciser"
              />
            </View>
          )}
        </>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Allo-immunisation</Text>
        <Picker
          selectedValue={formData.allo_immunization}
          onValueChange={value => updateFormData('allo_immunization', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Hyperviscosité</Text>
        <Picker
          selectedValue={formData.hyperviscosity}
          onValueChange={value => updateFormData('hyperviscosity', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Syndrome thoracique aigu</Text>
        <Picker
          selectedValue={formData.acute_chest_syndrome}
          onValueChange={value => updateFormData('acute_chest_syndrome', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Événement aigu</Text>
        <Picker
          selectedValue={formData.acute_event}
          onValueChange={value => updateFormData('acute_event', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.acute_event === 'Oui' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Détails de l'événement aigu</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={2}
            value={formData.acute_event_details}
            onChangeText={value => updateFormData('acute_event_details', value)}
            placeholder="Détails"
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>AVC</Text>
        <Picker
          selectedValue={formData.stroke}
          onValueChange={value => updateFormData('stroke', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Priapisme</Text>
        <Picker
          selectedValue={formData.priapism}
          onValueChange={value => updateFormData('priapism', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ulcère de jambe</Text>
        <Picker
          selectedValue={formData.leg_ulcer}
          onValueChange={value => updateFormData('leg_ulcer', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cholécystectomie</Text>
        <Picker
          selectedValue={formData.cholecystectomy}
          onValueChange={value => updateFormData('cholecystectomy', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Asplénie</Text>
        <Picker
          selectedValue={formData.asplenia}
          onValueChange={value => updateFormData('asplenia', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Vaccins recommandés</Text>
        {renderCheckboxGroup('recommended_vaccines', ['Pneumocoque', 'Méningocoque', 'Haemophilus influenzae', 'Hépatite B', 'Autres'], 'Vaccins recommandés')}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Effets secondaires des médicaments</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.drug_side_effects}
          onChangeText={value => updateFormData('drug_side_effects', value)}
          placeholder="Effets secondaires"
        />
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Text style={styles.stepTitle}>💊 Traitements</Text>

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
              <Picker.Item label="Bonne" value="Bonne" />
              <Picker.Item label="Moyenne" value="Moyenne" />
              <Picker.Item label="Mauvaise" value="Mauvaise" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Raisons de l'arrêt</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={2}
              value={formData.hydroxyurea_reasons}
              onChangeText={value => updateFormData('hydroxyurea_reasons', value)}
              placeholder="Raisons"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Posologie hydroxyurée</Text>
            <TextInput
              style={styles.input}
              value={formData.posologie_hydroxyurea}
              onChangeText={value => updateFormData('posologie_hydroxyurea', value)}
              placeholder="Posologie"
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
        <Text style={styles.label}>Transfusion sanguine régulière</Text>
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
              <Picker.Item label="Culot globulaire" value="Culot globulaire" />
              <Picker.Item label="Culot plaquettaire" value="Culot plaquettaire" />
              <Picker.Item label="Plasma frais congelé" value="Plasma frais congelé" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Fréquence de transfusion (3 derniers mois)</Text>
            <Picker
              selectedValue={formData.frequence_transfusion_3mois}
              onValueChange={value => updateFormData('frequence_transfusion_3mois', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Hebdomadaire" value="Hebdomadaire" />
              <Picker.Item label="Bihebdomadaire" value="Bihebdomadaire" />
              <Picker.Item label="Mensuel" value="Mensuel" />
              <Picker.Item label="Trimestriel" value="Trimestriel" />
              <Picker.Item label="Autre" value="Autre" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date de la dernière transfusion</Text>
            {renderDatePicker('last_transfusion_date', 'Date de la dernière transfusion')}
          </View>
        </>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Autres traitements spécifiques</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.autres_traitements_specifiques}
          onChangeText={value => updateFormData('autres_traitements_specifiques', value)}
          placeholder="Autres traitements"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Observance</Text>
        {renderCheckboxGroup('observance', ['Bonne', 'Moyenne', 'Mauvaise', 'Non évaluable'], 'Observance')}
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View>
      <Text style={styles.stepTitle}>🔬 Examens biologiques</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>NFS - GB</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.nfs_gb}
          onChangeText={value => updateFormData('nfs_gb', value)}
          placeholder="GB"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>NFS - Hémoglobine</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.nfs_hb}
          onChangeText={value => updateFormData('nfs_hb', value)}
          placeholder="Hémoglobine"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>NFS - Plaquettes</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.nfs_pqts}
          onChangeText={value => updateFormData('nfs_pqts', value)}
          placeholder="Plaquettes"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Rétículocytes</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.reticulocytes}
          onChangeText={value => updateFormData('reticulocytes', value)}
          placeholder="Rétículocytes"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Microalbuminurie</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.microalbuminuria}
          onChangeText={value => updateFormData('microalbuminuria', value)}
          placeholder="Microalbuminurie"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Hémolyse</Text>
        <Picker
          selectedValue={formData.hemolysis}
          onValueChange={value => updateFormData('hemolysis', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Groupe sanguin/Rhésus</Text>
        <TextInput
          style={styles.input}
          value={formData.gs_rh}
          onChangeText={value => updateFormData('gs_rh', value)}
          placeholder="Groupe sanguin/Rhésus"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Imagerie médicale</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.imagerie_medical}
          onChangeText={value => updateFormData('imagerie_medical', value)}
          placeholder="Imagerie médicale"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ophtalmologie</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.ophtalmologie}
          onChangeText={value => updateFormData('ophtalmologie', value)}
          placeholder="Ophtalmologie"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Consultations spécialisées</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.consultations_specialisees}
          onChangeText={value => updateFormData('consultations_specialisees', value)}
          placeholder="Consultations spécialisées"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Examen du jour</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.examen_du_jour}
          onChangeText={value => updateFormData('examen_du_jour', value)}
          placeholder="Examen du jour"
        />
      </View>
    </View>
  );

  const renderStep7 = () => (
    <View>
      <Text style={styles.stepTitle}>👨‍👩‍👧‍👦 Aspects sociaux et éducatifs</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Impact scolaire</Text>
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
        <Text style={styles.label}>Participation aux causeries</Text>
        <Picker
          selectedValue={formData.participation_causeries}
          onValueChange={value => updateFormData('participation_causeries', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Régulière" value="Régulière" />
          <Picker.Item label="Occasionnelle" value="Occasionnelle" />
          <Picker.Item label="Rare" value="Rare" />
          <Picker.Item label="Jamais" value="Jamais" />
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
        <Text style={styles.label}>Consultation psychologique</Text>
        <Picker
          selectedValue={formData.consultation_psychologique}
          onValueChange={value => updateFormData('consultation_psychologique', value)}
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

      {formData.soutien_social === 'Oui' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Options de soutien social</Text>
          {renderCheckboxGroup('soutien_social_options', ['Aide financière', 'Aide alimentaire', 'Aide vestimentaire', 'Aide scolaire', 'Autres'], 'Options de soutien social')}
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Impact social</Text>
        <Picker
          selectedValue={formData.impact_social}
          onValueChange={value => updateFormData('impact_social', value)}
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
        <Text style={styles.label}>Accompagnement spécial</Text>
        <Picker
          selectedValue={formData.accompagnement_special}
          onValueChange={value => updateFormData('accompagnement_special', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Famille informée</Text>
        <Picker
          selectedValue={formData.famille_informee}
          onValueChange={value => updateFormData('famille_informee', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Plan de suivi personnalisé</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.plan_suivi_personnalise}
          onChangeText={value => updateFormData('plan_suivi_personnalise', value)}
          placeholder="Plan de suivi personnalisé"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date de la prochaine consultation</Text>
        {renderDatePicker('date_prochaine_consultation', 'Date de la prochaine consultation')}
      </View>
    </View>
  );

  const renderStep8 = () => (
    <View>
      <Text style={styles.stepTitle}>📋 Évolution et plan de suivi</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Examens avant consultation</Text>
        {formData.examens_avant_consultation.map((examen, index) => (
          <View key={index} style={styles.examenItem}>
            <TextInput
              style={styles.input}
              value={examen}
              onChangeText={value => updateExamen(index, value)}
              placeholder={`Examen ${index + 1}`}
            />
            {formData.examens_avant_consultation.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeExamen(index)}
              >
                <Text style={styles.removeButtonText}>Supprimer</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addExamen}>
          <Text style={styles.addButtonText}>Ajouter un examen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Évolution</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.evolution}
          onChangeText={value => updateFormData('evolution', value)}
          placeholder="Évolution"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Éducation thérapeutique</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.education_therapeutique_step8}
          onChangeText={value => updateFormData('education_therapeutique_step8', value)}
          placeholder="Éducation thérapeutique"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date de la prochaine consultation (plan)</Text>
        {renderDatePicker('date_prochaine_consultation_plan', 'Date de la prochaine consultation (plan)')}
      </View>
    </View>
  );

  const renderStep9 = () => (
    <View>
      <Text style={styles.stepTitle}>📝 Commentaires</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Commentaires</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={5}
          value={formData.commentaires}
          onChangeText={value => updateFormData('commentaires', value)}
          placeholder="Commentaires supplémentaires"
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      case 7:
        return renderStep7();
      case 8:
        return renderStep8();
      case 9:
        return renderStep9();
      default:
        return renderStep1();
    }
  };

  const renderNavigation = () => (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={[styles.navButton, currentStep === 1 && styles.navButtonDisabled]}
        onPress={prevStep}
        disabled={currentStep === 1}
      >
        <Text style={[styles.navButtonText, currentStep === 1 && styles.navButtonTextDisabled]}>Précédent</Text>
      </TouchableOpacity>

      <Text style={styles.stepIndicator}>Étape {currentStep} sur {totalSteps}</Text>

      {currentStep < totalSteps ? (
        <TouchableOpacity style={styles.navButton} onPress={nextStep}>
          <Text style={styles.navButtonText}>Suivant</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
          <Text style={styles.submitButtonText}>Soumettre</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {showPatientForm ? (
        <View style={styles.patientFormContainer}>
          <Text style={styles.title}>Informations du patient</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Quartier *</Text>
            <TextInput
              style={styles.input}
              value={patientFormData.quartier}
              onChangeText={value => updatePatientFormData('quartier', value)}
              placeholder="Quartier"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Lieu-dit</Text>
            <TextInput
              style={styles.input}
              value={patientFormData.lieu_dit}
              onChangeText={value => updatePatientFormData('lieu_dit', value)}
              placeholder="Lieu-dit"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact d'urgence - Nom *</Text>
            <TextInput
              style={styles.input}
              value={patientFormData.emergency_contact_name}
              onChangeText={value => updatePatientFormData('emergency_contact_name', value)}
              placeholder="Nom du contact d'urgence"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact d'urgence - Téléphone *</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={patientFormData.emergency_contact_phone}
              onChangeText={value => updatePatientFormData('emergency_contact_phone', value)}
              placeholder="Téléphone du contact d'urgence"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact d'urgence - Relation *</Text>
            <TextInput
              style={styles.input}
              value={patientFormData.emergency_contact_relation}
              onChangeText={value => updatePatientFormData('emergency_contact_relation', value)}
              placeholder="Relation"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Téléphone du patient *</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={patientFormData.patient_phone}
              onChangeText={value => updatePatientFormData('patient_phone', value)}
              placeholder="Téléphone du patient"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Vit avec le patient *</Text>
            <Picker
              selectedValue={patientFormData.vit_avec_patient}
              onValueChange={value => updatePatientFormData('vit_avec_patient', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Oui" value="Oui" />
              <Picker.Item label="Non" value="Non" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Lien avec le patient *</Text>
            <Picker
              selectedValue={patientFormData.lien_avec_patient}
              onValueChange={value => updatePatientFormData('lien_avec_patient', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Père" value="Père" />
              <Picker.Item label="Mère" value="Mère" />
              <Picker.Item label="Grand-mère" value="Grand-mère" />
              <Picker.Item label="Grand-père" value="Grand-père" />
              <Picker.Item label="Frère" value="Frère" />
              <Picker.Item label="Sœur" value="Sœur" />
              <Picker.Item label="Oncle" value="Oncle" />
              <Picker.Item label="Tante" value="Tante" />
              <Picker.Item label="Autre" value="Autre" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Patient référé</Text>
            <Picker
              selectedValue={patientFormData.referred}
              onValueChange={value => updatePatientFormData('referred', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Oui" value="Oui" />
              <Picker.Item label="Non" value="Non" />
            </Picker>
          </View>

          {patientFormData.referred === 'Oui' && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Référé de</Text>
                <Picker
                  selectedValue={patientFormData.referred_from}
                  onValueChange={value => updatePatientFormData('referred_from', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="--Sélectionner--" value="" />
                  <Picker.Item label="Hôpital district" value="Hôpital district" />
                  <Picker.Item label="Centre de santé" value="Centre de santé" />
                  <Picker.Item label="Médecin privé" value="Médecin privé" />
                  <Picker.Item label="Autres" value="Autres" />
                </Picker>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Référé pour</Text>
                <Picker
                  selectedValue={patientFormData.referred_for}
                  onValueChange={value => updatePatientFormData('referred_for', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="--Sélectionner--" value="" />
                  <Picker.Item label="Meilleure prise en charge" value="Meilleure prise en charge" />
                  <Picker.Item label="Suivi trimestriel" value="Suivi trimestriel" />
                  <Picker.Item label="Urgence" value="Urgence" />
                  <Picker.Item label="Autres" value="Autres" />
                </Picker>
              </View>
            </>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Appartient à un groupe/Association</Text>
            <Picker
              selectedValue={patientFormData.appartient_groupe}
              onValueChange={value => updatePatientFormData('appartient_groupe', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Oui" value="Oui" />
              <Picker.Item label="Non" value="Non" />
            </Picker>
          </View>

          {patientFormData.appartient_groupe === 'Oui' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom du groupe/Association</Text>
              <TextInput
                style={styles.input}
                value={patientFormData.nom_groupe_association}
                onChangeText={value => updatePatientFormData('nom_groupe_association', value)}
                placeholder="Nom du groupe ou association"
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Rang dans la fratrie</Text>
            <Picker
              selectedValue={patientFormData.rang_fratrie}
              onValueChange={value => updatePatientFormData('rang_fratrie', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="11" value="11" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre de drépanocytaires dans la fratrie</Text>
            <Picker
              selectedValue={patientFormData.nombre_drepanocytaire_fratrie}
              onValueChange={value => updatePatientFormData('nombre_drepanocytaire_fratrie', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="0" value="0" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6+" value="6+" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Assurance</Text>
            <Picker
              selectedValue={patientFormData.insurance}
              onValueChange={value => updatePatientFormData('insurance', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="CNPS" value="CNPS" />
              <Picker.Item label="CNAS" value="CNAS" />
              <Picker.Item label="Privée" value="Privée" />
              <Picker.Item label="Aucune" value="Aucune" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Type de drépanocytose *</Text>
            <Picker
              selectedValue={patientFormData.type_drepanocytose}
              onValueChange={value => updatePatientFormData('type_drepanocytose', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="SS" value="SS" />
              <Picker.Item label="SC" value="SC" />
              <Picker.Item label="Sβ⁰" value="Sβ⁰" />
              <Picker.Item label="Sβ⁺" value="Sβ⁺" />
              <Picker.Item label="Autre" value="Autre" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Âge au diagnostic</Text>
            <Picker
              selectedValue={patientFormData.diagnosis_age}
              onValueChange={value => updatePatientFormData('diagnosis_age', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="À la naissance" value="À la naissance" />
              <Picker.Item label="0-3 mois" value="0-3 mois" />
              <Picker.Item label="4-6 mois" value="4-6 mois" />
              <Picker.Item label="7-12 mois" value="7-12 mois" />
              <Picker.Item label="2-3 ans" value="2-3 ans" />
              <Picker.Item label="4-5 ans" value="4-5 ans" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Circonstances du diagnostic</Text>
            <Picker
              selectedValue={patientFormData.diagnosis_circumstance}
              onValueChange={value => updatePatientFormData('diagnosis_circumstance', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Diagnostic néonatal" value="Diagnostic néonatal" />
              <Picker.Item label="Diagnostic à partir de la fratrie" value="Diagnostic à partir de la fratrie" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Région *</Text>
            <Picker
              selectedValue={patientFormData.region}
              onValueChange={value => updatePatientFormData('region', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Centre" value="Centre" />
              <Picker.Item label="Littoral" value="Littoral" />
              <Picker.Item label="Ouest" value="Ouest" />
              <Picker.Item label="Nord-Ouest" value="Nord-Ouest" />
              <Picker.Item label="Sud-Ouest" value="Sud-Ouest" />
              <Picker.Item label="Est" value="Est" />
              <Picker.Item label="Nord" value="Nord" />
              <Picker.Item label="Adamaoua" value="Adamaoua" />
              <Picker.Item label="Extrême-Nord" value="Extrême-Nord" />
              <Picker.Item label="Sud" value="Sud" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Antécédents familiaux</Text>
            <Picker
              selectedValue={patientFormData.family_history}
              onValueChange={value => updatePatientFormData('family_history', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Oui" value="Oui" />
              <Picker.Item label="Non" value="Non" />
              <Picker.Item label="Inconnu" value="Inconnu" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Autres antécédents médicaux</Text>
            <Picker
              selectedValue={patientFormData.autres_antecedents_medicaux}
              onValueChange={value => updatePatientFormData('autres_antecedents_medicaux', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Néphropathie" value="Néphropathie" />
              <Picker.Item label="Cardiopathie" value="Cardiopathie" />
              <Picker.Item label="Méningite" value="Méningite" />
              <Picker.Item label="Autres" value="Autres" />
              <Picker.Item label="Aucun" value="Aucun" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Allergies</Text>
            <Picker
              selectedValue={patientFormData.allergies}
              onValueChange={value => updatePatientFormData('allergies', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Oui" value="Oui" />
              <Picker.Item label="Non" value="Non" />
            </Picker>
          </View>

          {patientFormData.allergies === 'Oui' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Détails des allergies</Text>
              <TextInput
                style={styles.input}
                value={patientFormData.allergies_details}
                onChangeText={value => updatePatientFormData('allergies_details', value)}
                placeholder="Détails des allergies"
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Groupe sanguin/Rhésus *</Text>
            <TextInput
              style={styles.input}
              value={patientFormData.groupe_sanguin_rhesus}
              onChangeText={value => updatePatientFormData('groupe_sanguin_rhesus', value)}
              placeholder="Groupe sanguin/Rhésus"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={submitPatientForm}>
            <Text style={styles.submitButtonText}>Continuer vers la consultation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {renderCurrentStep()}
          </ScrollView>
          {renderNavigation()}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  patientFormContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  quickOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  quickOption: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  quickOptionSelected: {
    backgroundColor: '#007bff',
  },
  quickOptionText: {
    fontSize: 14,
    color: '#333',
  },
  quickOptionTextSelected: {
    color: '#fff',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  examenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ConsultationForm;