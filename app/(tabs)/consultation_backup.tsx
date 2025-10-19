
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
        <Text style={styles.label}>Contact d'urgence - Relation</Text>
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
          selectedValue={formData.acide_folique_step3