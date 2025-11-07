import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> cd25b5d (not yet done)
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
=======
>>>>>>> cd25b5d (not yet done)
import { savePatient, type PatientProfile } from '@/utils/storage';

const CreatePatientScreen = () => {
  const router = useRouter();

  /* ---------- 12 MANDATORY FIELDS ---------- */
  const [formData, setFormData] = useState({
=======
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<PatientProfile>({
>>>>>>> cd25b5d (not yet done)
    id: uuidv4(),
    numero_identification_unique: `P${Date.now()}`,
    nom: '',
    prenom: '',
    sexe: '',
    date_diagnostic: '',
    age_diagnostic: '',
    circonstances_du_diagnostic: '',
    rang_dans_fratrie: '',
    nombre_de_drepanocytaires_dans_fratrie: '',
    type_de_drepanocytose: '',
    antecedent_familiaux: '',
    groupe_sanguin_rhesus: '',
    vaccins_naissance: {} as Record<string, boolean>,
=======
    date_naissance: '',
    age: '',
    sexe: '',
    quartier: '',
    lieu_dit: '',
    contact_urgence_nom: '',
    contact_urgence_telephone: '',
    contact_urgence_relation: '',
    telephone_patient: '',
    vit_avec_le_patient: false,
    lien_avec_patient: '',
    patient_refere: false,
    patient_refere_de: '',
    patient_refere_pour: '',
    appartient_a_groupe: false,
    nom_du_groupe: '',
    rang_dans_fratrie: '',
    nombre_de_drepanocytaires_dans_fratrie: '',
    assurance: '',
    type_de_drepanocytose: '',
    age_diagnostic: '',
    circonstances_du_diagnostic: '',
    region: '',
    antecedent_familiaux: '',
    autres_antecedents_medicaux: '',
    allergies_connues: false,
    details_allergies: '',
    groupe_sanguin_rhesus: '',

    // Static consultation fields
    fosa: '',
    fosa_other: '',
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
    address: '',
    patient_phone_number: '',
    lives_with: '',
    insurance_other: '',
    support_group: '',
    group_name: '',
    appartient_groupe: '',
    nom_groupe_association: '',
    parents: '',
    sibling_rank: '',
    sickle_type: '',
    diagnosis_age: '',
    diagnosis_circumstance: '',
    family_history: '',
    other_medical_history: '',
    other_medical_history_details: '',
    previous_surgeries: '',
    interventions_chirurgicales_anterieures: '',
    date_derniere_intervention: '',
    cause_derniere_intervention: '',
    acide_folique_step3: '',
    nombre_crises_vaso: '',
    allergies: '',
    allergies_details: '',

>>>>>>> cd25b5d (not yet done)
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  /* ------------- handlers ------------- */
  const update = (key: string, value: any) => {
=======
  // Auto-calculate age and birth date
  useEffect(() => {
    if (formData.age && !isNaN(Number(formData.age))) {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - parseInt(formData.age);
      const newBirthDate = new Date(birthYear, 0, 1);
      setFormData(prev => ({ ...prev, date_naissance: newBirthDate.toISOString() }));
    }
  }, [formData.age]);

  useEffect(() => {
    if (formData.date_naissance && typeof formData.date_naissance === 'string') {
      const currentDate = new Date();
      const birthDate = new Date(formData.date_naissance);
      const ageInYears = Math.floor((currentDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (ageInYears !== parseInt(formData.age)) {
        setFormData(prev => ({ ...prev, age: ageInYears.toString() }));
      }
    }
  }, [formData.date_naissance]);

  useEffect(() => {
    const parts: string[] = [];
    if (formData.quartier) parts.push(formData.quartier);
    if (formData.lieu_dit) parts.push(formData.lieu_dit);
    setFormData(prev => ({ ...prev, address: parts.join(', ') }));
  }, [formData.quartier, formData.lieu_dit]);

  const updateFormData = <K extends keyof PatientProfile>(
    key: K,
    value: PatientProfile[K]
  ) => {
>>>>>>> cd25b5d (not yet done)
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const required: (keyof typeof formData)[] = [
      'nom',
      'prenom',
      'sexe',
      'date_diagnostic',
      'age_diagnostic',
      'circonstances_du_diagnostic',
      'type_de_drepanocytose',
      'groupe_sanguin_rhesus',
    ];
    const missing = required.filter(k => !formData[k]);
    if (missing.length) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
=======
    // Permanent fields validation
    if (!formData.nom || !formData.prenom || !formData.sexe || !formData.date_naissance ||
        !formData.type_de_drepanocytose || !formData.age_diagnostic ||
        !formData.circonstances_du_diagnostic || !formData.numero_identification_unique ||
        !formData.rang_dans_fratrie || !formData.nombre_de_drepanocytaires_dans_fratrie ||
        !formData.antecedent_familiaux || !formData.autres_antecedents_medicaux ||
        !formData.groupe_sanguin_rhesus) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (informations permanentes)');
>>>>>>> cd25b5d (not yet done)
      return;
    }

    try {
      await savePatient(formData as unknown as PatientProfile);
=======
      await savePatient(formData);
>>>>>>> cd25b5d (not yet done)
      Alert.alert(
        'Succès',
        'Profil patient créé avec succès',
        [
          {
            text: 'Créer la consultation initiale',
=======
            text: 'Créer une consultation',
>>>>>>> cd25b5d (not yet done)
            onPress: () => router.replace(`/consultation/${formData.id}` as any),
          },
          {
            text: 'Retour à l\'accueil',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le profil');
    }
  };

  /* -------------- UI ---------------- */
  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informations d'identification</Text>

        <Label required>Nom</Label>
        <TextInput style={styles.input} value={formData.nom} onChangeText={v => update('nom', v)} placeholder="Nom de famille" />

        <Label required>Prénom</Label>
        <TextInput style={styles.input} value={formData.prenom} onChangeText={v => update('prenom', v)} placeholder="Prénom" />

        <Label required>Sexe</Label>
        <Picker selectedValue={formData.sexe} onValueChange={v => update('sexe', v)} style={styles.picker}>
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Masculin" value="Masculin" />
          <Picker.Item label="Féminin" value="Féminin" />
        </Picker>

        <Label required>Date du diagnostic</Label>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateTxt}>
            {formData.date_diagnostic ? new Date(formData.date_diagnostic).toLocaleDateString('fr-FR') : 'Sélectionner la date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.date_diagnostic ? new Date(formData.date_diagnostic) : new Date()}
=======
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le profil patient');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations d'identification (Permanentes)</Text>

        <Text style={styles.label}>
          Numéro d'identification unique <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.numero_identification_unique}
          onChangeText={value => updateFormData('numero_identification_unique', value)}
          placeholder="Numéro unique du patient"
        />

        <Text style={styles.label}>
          Nom <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.nom}
          onChangeText={value => updateFormData('nom', value)}
          placeholder="Nom de famille"
        />

        <Text style={styles.label}>
          Prénom <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.prenom}
          onChangeText={value => updateFormData('prenom', value)}
          placeholder="Prénom"
        />

        <Text style={styles.label}>
          Date de naissance <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formData.date_naissance
              ? new Date(formData.date_naissance).toLocaleDateString('fr-FR')
              : 'Sélectionner la date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.date_naissance ? new Date(formData.date_naissance) : new Date()}
>>>>>>> cd25b5d (not yet done)
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) update('date_diagnostic', selectedDate.toISOString());
=======
              if (selectedDate) {
                updateFormData('date_naissance', selectedDate.toISOString());
                const age = Math.floor(
                  (new Date().getTime() - selectedDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
                );
                updateFormData('age', age.toString());
              }
>>>>>>> cd25b5d (not yet done)
            }}
          />
        )}

        <Label required>Âge au diagnostic</Label>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.age_diagnostic}
          onChangeText={v => update('age_diagnostic', v)}
          placeholder="ex. 3"
        />

        <Label required>Circonstances du diagnostic</Label>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.circonstances_du_diagnostic}
          onChangeText={v => update('circonstances_du_diagnostic', v)}
          placeholder="Décrire les circonstances"
        />

        <Label required>Type de drépanocytose</Label>
        <Picker selectedValue={formData.type_de_drepanocytose} onValueChange={v => update('type_de_drepanocytose', v)} style={styles.picker}>
=======
        <Text style={styles.label}>Âge</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={value => updateFormData('age', value)}
          placeholder="Âge en années"
          keyboardType="numeric"
        />

        <Text style={styles.label}>
          Sexe <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.sexe}
          onValueChange={value => updateFormData('sexe', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Masculin" value="Masculin" />
          <Picker.Item label="Féminin" value="Féminin" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coordonnées</Text>

        <Text style={styles.label}>Quartier</Text>
        <TextInput
          style={styles.input}
          value={formData.quartier}
          onChangeText={value => updateFormData('quartier', value)}
          placeholder="Nom du quartier"
        />

        <Text style={styles.label}>Lieu-dit</Text>
        <TextInput
          style={styles.input}
          value={formData.lieu_dit}
          onChangeText={value => updateFormData('lieu_dit', value)}
          placeholder="Lieu-dit ou précision d'adresse"
        />

        <Text style={styles.label}>Téléphone du patient</Text>
        <TextInput
          style={styles.input}
          value={formData.telephone_patient}
          onChangeText={value => updateFormData('telephone_patient', value)}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact d'urgence</Text>

        <Text style={styles.label}>Nom du contact</Text>
        <TextInput
          style={styles.input}
          value={formData.contact_urgence_nom}
          onChangeText={value => updateFormData('contact_urgence_nom', value)}
          placeholder="Nom complet"
        />

        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={formData.contact_urgence_telephone}
          onChangeText={value => updateFormData('contact_urgence_telephone', value)}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Relation avec le patient</Text>
        <Picker
          selectedValue={formData.contact_urgence_relation}
          onValueChange={value => updateFormData('contact_urgence_relation', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Père" value="Père" />
          <Picker.Item label="Mère" value="Mère" />
          <Picker.Item label="Frère" value="Frère" />
          <Picker.Item label="Sœur" value="Sœur" />
          <Picker.Item label="Conjoint(e)" value="Conjoint(e)" />
          <Picker.Item label="Ami(e)" value="Ami(e)" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>

        <Text style={styles.label}>Vit avec le patient</Text>
        <Picker
          selectedValue={formData.vit_avec_le_patient ? 'Oui' : 'Non'}
          onValueChange={value => updateFormData('vit_avec_le_patient', value === 'Oui')}
          style={styles.picker}
        >
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>

        <Text style={styles.label}>Lien avec le patient</Text>
        <TextInput
          style={styles.input}
          value={formData.lien_avec_patient}
          onChangeText={value => updateFormData('lien_avec_patient', value)}
          placeholder="Préciser le lien"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations médicales</Text>

        <Text style={styles.label}>
          Type de drépanocytose <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.type_de_drepanocytose}
          onValueChange={value => updateFormData('type_de_drepanocytose', value)}
          style={styles.picker}
        >
>>>>>>> cd25b5d (not yet done)
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="SS" value="SS" />
          <Picker.Item label="SC" value="SC" />
          <Picker.Item label="Sβ⁰" value="Sβ⁰" />
          <Picker.Item label="Sβ⁺" value="Sβ⁺" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>

        <Label>Antécédents familiaux</Label>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.antecedent_familiaux}
          onChangeText={v => update('antecedent_familiaux', v)}
          placeholder="Antécédents familiaux de drépanocytose"
        />

        <Label required>Groupe sanguin / Rhésus</Label>
        <Picker selectedValue={formData.groupe_sanguin_rhesus} onValueChange={v => update('groupe_sanguin_rhesus', v)} style={styles.picker}>
          <Picker.Item label="--Sélectionner--" value="" />
          {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => (
            <Picker.Item key={g} label={g} value={g} />
          ))}
        </Picker>

        <Label>Rang dans la fratrie</Label>
        <Picker selectedValue={formData.rang_dans_fratrie} onValueChange={v => update('rang_dans_fratrie', v)} style={styles.picker}>
          <Picker.Item label="--Sélectionner--" value="" />
          {[...Array(12)].map((_, i) => (
            <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
          ))}
        </Picker>

        <Label>Nombre de drépanocytaires dans la fratrie</Label>
        <Picker
          selectedValue={formData.nombre_de_drepanocytaires_dans_fratrie}
          onValueChange={v => update('nombre_de_drepanocytaires_dans_fratrie', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          {['0', '1', '2', '3', '4', '5', '6+'].map(n => (
            <Picker.Item key={n} label={n} value={n} />
          ))}
        </Picker>

        <Label>Vaccins reçus à la naissance</Label>
        {['BCG', 'Hépatite B', 'Polio (VPO 0)', 'Pneumo 13'].map(v => (
          <TouchableOpacity
            key={v}
            style={styles.checkRow}
            onPress={() =>
              update('vaccins_naissance', {
                ...formData.vaccins_naissance,
                [v]: !formData.vaccins_naissance[v],
              })
            }
          >
            <Text style={styles.checkTxt}>{v}</Text>
            <View style={[styles.box, formData.vaccins_naissance[v] && styles.boxChecked]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnTxt}>Créer le profil patient</Text>
=======
        <Text style={styles.label}>Âge au diagnostic</Text>
        <TextInput
          style={styles.input}
          value={formData.age_diagnostic}
          onChangeText={value => updateFormData('age_diagnostic', value)}
          placeholder="Âge lors du diagnostic"
        />

        <Text style={styles.label}>Circonstances du diagnostic</Text>
        <TextInput
          style={styles.input}
          value={formData.circonstances_du_diagnostic}
          onChangeText={value => updateFormData('circonstances_du_diagnostic', value)}
          placeholder="Comment le diagnostic a été établi"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Région</Text>
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

        <Text style={styles.label}>Groupe sanguin/Rhésus</Text>
        <Picker
          selectedValue={formData.groupe_sanguin_rhesus}
          onValueChange={value => updateFormData('groupe_sanguin_rhesus', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="O+" value="O+" />
          <Picker.Item label="O-" value="O-" />
          <Picker.Item label="A+" value="A+" />
          <Picker.Item label="A-" value="A-" />
          <Picker.Item label="B+" value="B+" />
          <Picker.Item label="B-" value="B-" />
          <Picker.Item label="AB+" value="AB+" />
          <Picker.Item label="AB-" value="AB-" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Antécédents</Text>

        <Text style={styles.label}>Antécédents familiaux</Text>
        <TextInput
          style={styles.input}
          value={formData.antecedent_familiaux}
          onChangeText={value => updateFormData('antecedent_familiaux', value)}
          placeholder="Antécédents familiaux de drépanocytose"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Autres antécédents médicaux</Text>
        <TextInput
          style={styles.input}
          value={formData.autres_antecedents_medicaux}
          onChangeText={value => updateFormData('autres_antecedents_medicaux', value)}
          placeholder="Autres problèmes de santé"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Allergies connues</Text>
        <Picker
          selectedValue={formData.allergies_connues ? 'Oui' : 'Non'}
          onValueChange={value => updateFormData('allergies_connues', value === 'Oui')}
          style={styles.picker}
        >
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Oui" value="Oui" />
        </Picker>

        {formData.allergies_connues && (
          <>
            <Text style={styles.label}>Détails des allergies</Text>
            <TextInput
              style={styles.input}
              value={formData.details_allergies}
              onChangeText={value => updateFormData('details_allergies', value)}
              placeholder="Préciser les allergies"
              multiline
              numberOfLines={3}
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations sociales</Text>

        <Text style={styles.label}>Patient référé</Text>
        <Picker
          selectedValue={formData.patient_refere ? 'Oui' : 'Non'}
          onValueChange={value => updateFormData('patient_refere', value === 'Oui')}
          style={styles.picker}
        >
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Oui" value="Oui" />
        </Picker>

        {formData.patient_refere && (
          <>
            <Text style={styles.label}>Référé de</Text>
            <TextInput
              style={styles.input}
              value={formData.patient_refere_de}
              onChangeText={value => updateFormData('patient_refere_de', value)}
              placeholder="Structure de provenance"
            />

            <Text style={styles.label}>Référé pour</Text>
            <TextInput
              style={styles.input}
              value={formData.patient_refere_pour}
              onChangeText={value => updateFormData('patient_refere_pour', value)}
              placeholder="Raison du référencement"
            />
          </>
        )}

        <Text style={styles.label}>Appartient à un groupe</Text>
        <Picker
          selectedValue={formData.appartient_a_groupe ? 'Oui' : 'Non'}
          onValueChange={value => updateFormData('appartient_a_groupe', value === 'Oui')}
          style={styles.picker}
        >
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Oui" value="Oui" />
        </Picker>

        {formData.appartient_a_groupe && (
          <>
            <Text style={styles.label}>Nom du groupe</Text>
            <TextInput
              style={styles.input}
              value={formData.nom_du_groupe}
              onChangeText={value => updateFormData('nom_du_groupe', value)}
              placeholder="Nom du groupe ou association"
            />
          </>
        )}

        <Text style={styles.label}>Rang dans la fratrie</Text>
        <TextInput
          style={styles.input}
          value={formData.rang_dans_fratrie}
          onChangeText={value => updateFormData('rang_dans_fratrie', value)}
          placeholder="Position dans la fratrie"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nombre de drépanocytaires dans la fratrie</Text>
        <TextInput
          style={styles.input}
          value={formData.nombre_de_drepanocytaires_dans_fratrie}
          onChangeText={value => updateFormData('nombre_de_drepanocytaires_dans_fratrie', value)}
          placeholder="Nombre"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Assurance</Text>
        <Picker
          selectedValue={formData.assurance}
          onValueChange={value => updateFormData('assurance', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="CNPS" value="CNPS" />
          <Picker.Item label="CNAS" value="CNAS" />
          <Picker.Item label="Privée" value="Privée" />
          <Picker.Item label="Aucune" value="Aucune" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations de consultation (optionnelles)</Text>

        <Text style={styles.label}>FOSA (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.fosa}
           onChangeText={value => updateFormData('fosa', value)}
           placeholder="FOSA"
         />

         <Text style={styles.label}>Autre FOSA (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.fosa_other}
           onChangeText={value => updateFormData('fosa_other', value)}
           placeholder="Préciser autre FOSA"
         />

         <Text style={styles.label}>District (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.district}
           onChangeText={value => updateFormData('district', value)}
           placeholder="District"
         />

         <Text style={styles.label}>Date du diagnostic (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.diagnostic_date}
           onChangeText={value => updateFormData('diagnostic_date', value)}
           placeholder="Date du diagnostic"
         />

         <Text style={styles.label}>IPP (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.ipp}
           onChangeText={value => updateFormData('ipp', value)}
           placeholder="IPP"
         />

         <Text style={styles.label}>Personnel (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.personnel}
           onChangeText={value => updateFormData('personnel', value)}
           placeholder="Personnel"
         />

         <Text style={styles.label}>Personnel remplissant (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.personnel_remplissant}
           onChangeText={value => updateFormData('personnel_remplissant', value)}
           placeholder="Personnel remplissant"
         />

         <Text style={styles.label}>Poids (kg - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.poids}
           onChangeText={value => updateFormData('poids', value)}
           placeholder="Poids en kg"
           keyboardType="numeric"
         />

         <Text style={styles.label}>Taille (cm - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.taille}
           onChangeText={value => updateFormData('taille', value)}
           placeholder="Taille en cm"
           keyboardType="numeric"
         />

         <Text style={styles.label}>Référé (optionnel)</Text>
         <Picker
           selectedValue={formData.referred}
           onValueChange={value => updateFormData('referred', value)}
           style={styles.picker}
         >
           <Picker.Item label="--Sélectionner--" value="" />
           <Picker.Item label="Oui" value="Oui" />
           <Picker.Item label="Non" value="Non" />
         </Picker>

         <Text style={styles.label}>Référé de (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.referred_from}
           onChangeText={value => updateFormData('referred_from', value)}
           placeholder="Structure de provenance"
         />

         <Text style={styles.label}>Autre référé de (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.referred_from_other}
           onChangeText={value => updateFormData('referred_from_other', value)}
           placeholder="Autre structure de provenance"
         />

         <Text style={styles.label}>Référé pour (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.referred_for}
           onChangeText={value => updateFormData('referred_for', value)}
           placeholder="Raison du référencement"
         />

         <Text style={styles.label}>Adresse (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.address}
           onChangeText={value => updateFormData('address', value)}
           placeholder="Adresse complète"
         />

        <Text style={styles.label}>Téléphone du patient (consultation - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.patient_phone_number}
           onChangeText={value => updateFormData('patient_phone_number', value)}
           placeholder="Numéro de téléphone"
           keyboardType="phone-pad"
         />

         <Text style={styles.label}>Vit avec (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.lives_with}
           onChangeText={value => updateFormData('lives_with', value)}
           placeholder="Personnes avec qui vit le patient"
         />

         <Text style={styles.label}>Autre assurance (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.insurance_other}
           onChangeText={value => updateFormData('insurance_other', value)}
           placeholder="Préciser autre assurance"
         />

         <Text style={styles.label}>Groupe de soutien (optionnel)</Text>
         <Picker
           selectedValue={formData.support_group}
           onValueChange={value => updateFormData('support_group', value)}
           style={styles.picker}
         >
           <Picker.Item label="--Sélectionner--" value="" />
           <Picker.Item label="Oui" value="Oui" />
           <Picker.Item label="Non" value="Non" />
         </Picker>

         <Text style={styles.label}>Nom du groupe (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.group_name}
           onChangeText={value => updateFormData('group_name', value)}
           placeholder="Nom du groupe de soutien"
         />

         <Text style={styles.label}>Appartient à un groupe (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.appartient_groupe}
           onChangeText={value => updateFormData('appartient_groupe', value)}
           placeholder="Appartenance à un groupe"
         />

         <Text style={styles.label}>Nom du groupe association (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.nom_groupe_association}
           onChangeText={value => updateFormData('nom_groupe_association', value)}
           placeholder="Nom du groupe ou association"
         />

         <Text style={styles.label}>Parents (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.parents}
           onChangeText={value => updateFormData('parents', value)}
           placeholder="Informations sur les parents"
         />

        <Text style={styles.label}>Rang dans la fratrie (consultation)</Text>
         <TextInput
           style={styles.input}
           value={formData.sibling_rank}
           onChangeText={value => updateFormData('sibling_rank', value)}
           placeholder="Rang dans la fratrie"
           keyboardType="numeric"
         />

        <Text style={styles.label}>Type de drépanocytose (consultation - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.sickle_type}
           onChangeText={value => updateFormData('sickle_type', value)}
           placeholder="Type de drépanocytose"
         />

        <Text style={styles.label}>Âge au diagnostic (consultation - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.diagnosis_age}
           onChangeText={value => updateFormData('diagnosis_age', value)}
           placeholder="Âge au diagnostic"
         />

         <Text style={styles.label}>Circonstances du diagnostic (consultation - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.diagnosis_circumstance}
           onChangeText={value => updateFormData('diagnosis_circumstance', value)}
           placeholder="Circonstances du diagnostic"
           multiline
           numberOfLines={3}
         />

         <Text style={styles.label}>Antécédents familiaux (consultation - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.family_history}
           onChangeText={value => updateFormData('family_history', value)}
           placeholder="Antécédents familiaux"
           multiline
           numberOfLines={3}
         />

         <Text style={styles.label}>Autres antécédents médicaux (consultation - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.other_medical_history}
           onChangeText={value => updateFormData('other_medical_history', value)}
           placeholder="Autres antécédents médicaux"
           multiline
           numberOfLines={3}
         />

         <Text style={styles.label}>Détails autres antécédents médicaux (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.other_medical_history_details}
           onChangeText={value => updateFormData('other_medical_history_details', value)}
           placeholder="Détails des autres antécédents médicaux"
           multiline
           numberOfLines={3}
         />

         <Text style={styles.label}>Interventions chirurgicales antérieures (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.previous_surgeries}
           onChangeText={value => updateFormData('previous_surgeries', value)}
           placeholder="Interventions chirurgicales antérieures"
           multiline
           numberOfLines={3}
         />

         <Text style={styles.label}>Interventions chirurgicales antérieures (détails - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.interventions_chirurgicales_anterieures}
           onChangeText={value => updateFormData('interventions_chirurgicales_anterieures', value)}
           placeholder="Détails des interventions chirurgicales antérieures"
           multiline
           numberOfLines={3}
         />

         <Text style={styles.label}>Date dernière intervention (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.date_derniere_intervention}
           onChangeText={value => updateFormData('date_derniere_intervention', value)}
           placeholder="Date de la dernière intervention"
         />

         <Text style={styles.label}>Cause dernière intervention (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.cause_derniere_intervention}
           onChangeText={value => updateFormData('cause_derniere_intervention', value)}
           placeholder="Cause de la dernière intervention"
         />

         <Text style={styles.label}>Acide folique (étape 3 - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.acide_folique_step3}
           onChangeText={value => updateFormData('acide_folique_step3', value)}
           placeholder="Acide folique étape 3"
         />

         <Text style={styles.label}>Nombre de crises vaso-occlusives (optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.nombre_crises_vaso}
           onChangeText={value => updateFormData('nombre_crises_vaso', value)}
           placeholder="Nombre de crises vaso-occlusives"
           keyboardType="numeric"
         />

         <Text style={styles.label}>Allergies (consultation - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.allergies}
           onChangeText={value => updateFormData('allergies', value)}
           placeholder="Allergies"
           multiline
           numberOfLines={3}
         />

         <Text style={styles.label}>Détails allergies (consultation - optionnel)</Text>
         <TextInput
           style={styles.input}
           value={formData.allergies_details}
           onChangeText={value => updateFormData('allergies_details', value)}
           placeholder="Détails des allergies"
           multiline
           numberOfLines={3}
         />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Créer le profil patient</Text>
>>>>>>> cd25b5d (not yet done)
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#dc3545', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8, padding: 12, fontSize: 16, color: '#495057', backgroundColor: '#fff' },
  picker: { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8, backgroundColor: '#fff' },
  dateBtn: { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  dateTxt: { fontSize: 16, color: '#495057' },
  checkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  checkTxt: { fontSize: 16, color: '#495057' },
  box: { width: 20, height: 20, borderWidth: 2, borderColor: '#ced4da', borderRadius: 4 },
  boxChecked: { backgroundColor: '#dc3545', borderColor: '#dc3545' },
  footer: { padding: 16, paddingBottom: 32 },
  submitBtn: { backgroundColor: '#dc3545', padding: 16, borderRadius: 12, alignItems: 'center' },
  submitBtnTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

const Label: React.FC<{ required?: boolean; children: string }> = ({ required, children }) => (
  <Text style={{ fontSize: 16, fontWeight: '600', color: '#495057', marginBottom: 8 }}>
    {children}
    {required && <Text style={{ color: '#dc3545' }}> *</Text>}
  </Text>
);

=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    marginTop: 12,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#495057',
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#495057',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

>>>>>>> cd25b5d (not yet done)
export default CreatePatientScreen;
