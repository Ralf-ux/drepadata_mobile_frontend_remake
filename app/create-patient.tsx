import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/authSlice';
import { createPatient } from '@/api/users';

interface EmergencyContact {
  nom: string;
  relation: string;
  telephone: string;
}

interface PatientProfile {
  id: string;
  numero_identification_unique: string;
  nom: string;
  prenom: string;
  sexe: 'Masculin' | 'Féminin' | '';
  date_naissance: string;
  age: string;
  date_diagnostic?: string;
  age_diagnostic: string;
  circonstances_du_diagnostic: string;
  type_de_drepanocytose: 'SS' | 'SC' | 'Sβ⁰' | 'Sβ⁺' | 'Autre' | '';
  groupe_sanguin_rhesus: string;
  quartier: string;
  lieu_dit: string;
  telephone_patient: string;
  contact_urgence_nom: string;
  contact_urgence_telephone: string;
  contact_urgence_relation: string;
  vit_avec_le_patient: boolean;
  lien_avec_patient: string;
  region: string;
  antecedent_familiaux: string;
  autres_antecedents_medicaux: string;
  allergies_connues: boolean;
  details_allergies: string;
  patient_refere: boolean;
  patient_refere_de: string;
  patient_refere_pour: string;
  appartient_a_groupe: boolean;
  nom_du_groupe: string;
  rang_dans_fratrie: string;
  nombre_de_drepanocytaires_dans_fratrie: string;
  assurance: 'CNPS' | 'CNAS' | 'Privée' | 'Aucune' | 'Autre' | '';
  insurance_other?: string;
  created_at: string;
  updated_at: string;
}

const CreatePatientScreen = () => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState<PatientProfile>({
    id: uuidv4(),
    numero_identification_unique: `P${Date.now()}`,
    nom: '',
    prenom: '',
    sexe: '',
    date_naissance: '',
    age: '',
    age_diagnostic: '',
    circonstances_du_diagnostic: '',
    type_de_drepanocytose: '',
    groupe_sanguin_rhesus: '',
    quartier: '',
    lieu_dit: '',
    telephone_patient: '',
    contact_urgence_nom: '',
    contact_urgence_telephone: '',
    contact_urgence_relation: '',
    vit_avec_le_patient: false,
    lien_avec_patient: '',
    region: '',
    antecedent_familiaux: '',
    autres_antecedents_medicaux: '',
    allergies_connues: false,
    details_allergies: '',
    patient_refere: false,
    patient_refere_de: '',
    patient_refere_pour: '',
    appartient_a_groupe: false,
    nom_du_groupe: '',
    rang_dans_fratrie: '',
    nombre_de_drepanocytaires_dans_fratrie: '',
    assurance: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Auto-calculate age from date_naissance
  useEffect(() => {
    if (formData.date_naissance) {
      const birthDate = new Date(formData.date_naissance);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.date_naissance]);

  const updateFormData = <K extends keyof PatientProfile>(
    key: K,
    value: PatientProfile[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof PatientProfile)[] = [
      'nom',
      'prenom',
      'sexe',
      'date_naissance',
      'type_de_drepanocytose',
      'groupe_sanguin_rhesus',
    ];

    const missing = requiredFields.filter(field => {
      const value = formData[field];
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (missing.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Champs obligatoires',
        text2: `Veuillez remplir : ${missing.join(', ')}`,
      });
      return;
    }

    try {
      const patientData = {
        ...formData,
        rang_dans_fratrie: formData.rang_dans_fratrie ? Number(formData.rang_dans_fratrie) : 0,
        nombre_de_drepanocytaires_dans_fratrie: formData.nombre_de_drepanocytaires_dans_fratrie
          ? Number(formData.nombre_de_drepanocytaires_dans_fratrie)
          : 0,
      };

      await createPatient(patientData);
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Profil patient créé avec succès',
      });
      router.replace(`/consultation/${formData.id}`);
    } catch (error) {
      console.error('Error creating patient:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de créer le profil',
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      {/* Identification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations d'identification</Text>

        <Text style={styles.label}>
          Numéro d'identification unique
        </Text>
        <TextInput
          style={styles.input}
          value={formData.numero_identification_unique}
          editable={false}
        />

        <Text style={styles.label}>
          Nom <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.nom}
          onChangeText={v => updateFormData('nom', v)}
          placeholder="Nom de famille"
        />

        <Text style={styles.label}>
          Prénom <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.prenom}
          onChangeText={v => updateFormData('prenom', v)}
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
            value={
              formData.date_naissance
                ? new Date(formData.date_naissance)
                : new Date()
            }
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                updateFormData('date_naissance', selectedDate.toISOString());
              }
            }}
          />
        )}

        <Text style={styles.label}>Âge</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          editable={false}
          placeholder="Calculé automatiquement"
        />

        <Text style={styles.label}>
          Sexe <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.sexe}
          onValueChange={v => updateFormData('sexe', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Masculin" value="Masculin" />
          <Picker.Item label="Féminin" value="Féminin" />
        </Picker>

        <Text style={styles.label}>Âge au diagnostic</Text>
        <TextInput
          style={styles.input}
          value={formData.age_diagnostic}
          onChangeText={v => updateFormData('age_diagnostic', v)}
          placeholder="Ex: À la naissance, 6 mois..."
        />

        <Text style={styles.label}>Circonstances du diagnostic</Text>
        <TextInput
          style={styles.input}
          value={formData.circonstances_du_diagnostic}
          onChangeText={v => updateFormData('circonstances_du_diagnostic', v)}
          placeholder="Ex: Dépistage néonatal, crise douloureuse..."
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>
          Type de drépanocytose <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.type_de_drepanocytose}
          onValueChange={v => updateFormData('type_de_drepanocytose', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="SS" value="SS" />
          <Picker.Item label="SC" value="SC" />
          <Picker.Item label="Sβ⁰" value="Sβ⁰" />
          <Picker.Item label="Sβ⁺" value="Sβ⁺" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>

        <Text style={styles.label}>
          Groupe sanguin / Rhésus <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.groupe_sanguin_rhesus}
          onValueChange={v => updateFormData('groupe_sanguin_rhesus', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => (
            <Picker.Item key={g} label={g} value={g} />
          ))}
        </Picker>

        <Text style={styles.label}>Région</Text>
        <Picker
          selectedValue={formData.region}
          onValueChange={v => updateFormData('region', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          {[
            'Centre', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest',
            'Est', 'Nord', 'Adamaoua', 'Extrême-Nord', 'Sud'
          ].map(r => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
      </View>

      {/* Coordonnées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coordonnées</Text>

        <Text style={styles.label}>Quartier</Text>
        <TextInput
          style={styles.input}
          value={formData.quartier}
          onChangeText={v => updateFormData('quartier', v)}
          placeholder="Nom du quartier"
        />

        <Text style={styles.label}>Lieu-dit</Text>
        <TextInput
          style={styles.input}
          value={formData.lieu_dit}
          onChangeText={v => updateFormData('lieu_dit', v)}
          placeholder="Précision d'adresse"
        />

        <Text style={styles.label}>Téléphone du patient</Text>
        <TextInput
          style={styles.input}
          value={formData.telephone_patient}
          onChangeText={v => updateFormData('telephone_patient', v)}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
        />
      </View>

      {/* Contact d'urgence */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact d'urgence</Text>

        <Text style={styles.label}>Nom du contact</Text>
        <TextInput
          style={styles.input}
          value={formData.contact_urgence_nom}
          onChangeText={v => updateFormData('contact_urgence_nom', v)}
          placeholder="Nom complet"
        />

        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={formData.contact_urgence_telephone}
          onChangeText={v => updateFormData('contact_urgence_telephone', v)}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Relation avec le patient</Text>
        <Picker
          selectedValue={formData.contact_urgence_relation}
          onValueChange={v => updateFormData('contact_urgence_relation', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          {['Père', 'Mère', 'Frère', 'Sœur', 'Conjoint(e)', 'Ami(e)', 'Autre'].map(r => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>

        <Text style={styles.label}>Vit avec le patient</Text>
        <Picker
          selectedValue={formData.vit_avec_le_patient ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('vit_avec_le_patient', v === 'Oui')}
          style={styles.picker}
        >
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>

        <Text style={styles.label}>Lien avec le patient</Text>
        <TextInput
          style={styles.input}
          value={formData.lien_avec_patient}
          onChangeText={v => updateFormData('lien_avec_patient', v)}
          placeholder="Préciser le lien si différent"
        />
      </View>

      {/* Antécédents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Antécédents</Text>

        <Text style={styles.label}>Antécédents familiaux</Text>
        <TextInput
          style={styles.input}
          value={formData.antecedent_familiaux}
          onChangeText={v => updateFormData('antecedent_familiaux', v)}
          placeholder="Drépanocytose dans la famille..."
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Autres antécédents médicaux</Text>
        <TextInput
          style={styles.input}
          value={formData.autres_antecedents_medicaux}
          onChangeText={v => updateFormData('autres_antecedents_medicaux', v)}
          placeholder="Autres maladies chroniques..."
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Allergies connues</Text>
        <Picker
          selectedValue={formData.allergies_connues ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('allergies_connues', v === 'Oui')}
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
              onChangeText={v => updateFormData('details_allergies', v)}
              placeholder="Médicaments, aliments..."
              multiline
              numberOfLines={3}
            />
          </>
        )}
      </View>

      {/* Informations sociales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations sociales</Text>

        <Text style={styles.label}>Patient référé</Text>
        <Picker
          selectedValue={formData.patient_refere ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('patient_refere', v === 'Oui')}
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
              onChangeText={v => updateFormData('patient_refere_de', v)}
              placeholder="Structure de provenance"
            />

            <Text style={styles.label}>Référé pour</Text>
            <TextInput
              style={styles.input}
              value={formData.patient_refere_pour}
              onChangeText={v => updateFormData('patient_refere_pour', v)}
              placeholder="Raison du référencement"
            />
          </>
        )}

        <Text style={styles.label}>Appartient à un groupe</Text>
        <Picker
          selectedValue={formData.appartient_a_groupe ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('appartient_a_groupe', v === 'Oui')}
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
              onChangeText={v => updateFormData('nom_du_groupe', v)}
              placeholder="Nom du groupe ou association"
            />
          </>
        )}

        <Text style={styles.label}>Rang dans la fratrie</Text>
        <TextInput
          style={styles.input}
          value={formData.rang_dans_fratrie}
          onChangeText={v => updateFormData('rang_dans_fratrie', v)}
          placeholder="Ex: 1, 2, 3..."
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nombre de drépanocytaires dans la fratrie</Text>
        <TextInput
          style={styles.input}
          value={formData.nombre_de_drepanocytaires_dans_fratrie}
          onChangeText={v => updateFormData('nombre_de_drepanocytaires_dans_fratrie', v)}
          placeholder="Ex: 0, 1, 2..."
          keyboardType="numeric"
        />

        <Text style={styles.label}>Assurance</Text>
        <Picker
          selectedValue={formData.assurance}
          onValueChange={v => updateFormData('assurance', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="CNPS" value="CNPS" />
          <Picker.Item label="CNAS" value="CNAS" />
          <Picker.Item label="Privée" value="Privée" />
          <Picker.Item label="Aucune" value="Aucune" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>

        {formData.assurance === 'Autre' && (
          <>
            <Text style={styles.label}>Préciser l'assurance</Text>
            <TextInput
              style={styles.input}
              value={formData.insurance_other}
              onChangeText={v => updateFormData('insurance_other', v)}
              placeholder="Nom de l'assurance"
            />
          </>
        )}
      </View>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!isAuthenticated}
        >
          <Text style={styles.submitButtonText}>Créer le profil patient</Text>
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
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    marginTop: 12,
    marginBottom: 8,
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
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 8,
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

export default CreatePatientScreen;