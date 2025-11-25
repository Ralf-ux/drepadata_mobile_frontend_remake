import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CrossPlatformDateTimePicker from '../../CrossPlatformDateTimePicker';
import { useConsultation } from '../../../utils/consultationContext';

const { width } = Dimensions.get('window');

const Step3 = () => {
  const { formData, updateFormData } = useConsultation();
  const [showDatePicker, setShowDatePicker] = useState({ field: '', visible: false });

  const renderDatePicker = (field: keyof typeof formData, label: string) => {
    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
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

  return (
    <View>
      <Text style={styles.stepTitle}>🩺 Antécédents médicaux</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Type de drépanocytose <Text style={styles.required}>*</Text>
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.sickle_type}
          onValueChange={value => updateFormData('sickle_type', value)}
          style={styles.picker}
          enabled={false}
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
        <Text style={styles.label}>
          Âge au diagnostic
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.diagnosis_age}
          onValueChange={value => updateFormData('diagnosis_age', value)}
          style={styles.picker}
          enabled={false}
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
        <Text style={styles.label}>
          Circonstances du diagnostic
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.diagnosis_circumstance}
          onValueChange={value => updateFormData('diagnosis_circumstance', value)}
          style={styles.picker}
          enabled={false}
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
        <Text style={styles.label}>
          Antécédents familiaux
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.family_history}
          onValueChange={value => updateFormData('family_history', value)}
          style={styles.picker}
          enabled={false}
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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Allergies connues</Text>
        <Picker
          selectedValue={formData.allergies}
          onValueChange={value => updateFormData('allergies', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.allergies === 'Oui' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Détails des allergies</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={2}
            value={formData.allergies_details}
            onChangeText={value => updateFormData('allergies_details', value)}
            placeholder="Préciser les allergies"
          />
        </View>
      )}

      {showDatePicker.visible && (
        <CrossPlatformDateTimePicker
          value={formData[showDatePicker.field as keyof typeof formData] ? new Date(formData[showDatePicker.field as keyof typeof formData] as string) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker({ field: '', visible: false });
            if (selectedDate) updateFormData(showDatePicker.field as keyof typeof formData, selectedDate.toISOString());
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  required: {
    color: '#dc3545',
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
  prefilledNote: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  prefilledInput: {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
  },
});

export default Step3;