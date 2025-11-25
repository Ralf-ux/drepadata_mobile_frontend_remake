import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CrossPlatformDateTimePicker from '../../CrossPlatformDateTimePicker';
import { useConsultation } from '../../../utils/consultationContext';

const Step2 = () => {
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
      <Text style={styles.stepTitle}>👤 Données démographiques</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Nom et Prénom <Text style={styles.required}>*</Text>
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.prefilledInput]}
          value={formData.full_name}
          editable={false}
          placeholder="Nom complet du patient"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Âge
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.prefilledInput]}
          keyboardType="numeric"
          value={formData.age}
          editable={false}
          placeholder="Âge en années"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Date de naissance
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, styles.prefilledInput]}
          onPress={() => setShowDatePicker({ field: 'birth_date', visible: true })}
        >
          <Text style={styles.dateText}>
            {formData.birth_date ? new Date(formData.birth_date).toLocaleDateString() : 'Sélectionner date'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Sexe <Text style={styles.required}>*</Text>
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.sex}
          onValueChange={value => updateFormData('sex', value)}
          style={styles.picker}
          enabled={false}
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
        <Text style={styles.label}>
          Quartier
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.prefilledInput]}
          value={formData.quartier}
          editable={false}
          placeholder="Nom du quartier"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Lieu-dit
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.prefilledInput]}
          value={formData.lieu_dit}
          editable={false}
          placeholder="Lieu-dit ou précision d'adresse"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Contact d'urgence - Nom
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.prefilledInput]}
          value={formData.emergency_contact_name}
          editable={false}
          placeholder="Nom du contact d'urgence"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Contact d'urgence - Relation
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.prefilledInput]}
          value={formData.emergency_contact_relation}
          editable={false}
          placeholder="Relation (parent, ami, etc.)"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Contact d'urgence - Téléphone
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.prefilledInput]}
          keyboardType="phone-pad"
          value={formData.emergency_contact_phone}
          editable={false}
          placeholder="Numéro de téléphone"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Téléphone du patient
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.prefilledInput]}
          keyboardType="phone-pad"
          value={formData.patient_phone_number}
          editable={false}
          placeholder="Numéro de téléphone du patient"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Vit avec le patient
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.vit_avec_patient}
          onValueChange={value => updateFormData('vit_avec_patient', value)}
          style={styles.picker}
          enabled={false}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Appartient à un groupe/Association
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.appartient_groupe}
          onValueChange={value => updateFormData('appartient_groupe', value)}
          style={styles.picker}
          enabled={false}
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
        <Text style={styles.label}>
          Rang dans la fratrie
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.rang_fratrie}
          onValueChange={value => updateFormData('rang_fratrie', value)}
          style={styles.picker}
          enabled={false}
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
        <Text style={styles.label}>
          Nombre de drépanocytaires dans la fratrie
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.nombre_drepanocytaire_fratrie}
          onValueChange={value => updateFormData('nombre_drepanocytaire_fratrie', value)}
          style={styles.picker}
          enabled={false}
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
        <Text style={styles.label}>
          Assurance
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.insurance}
          onValueChange={value => updateFormData('insurance', value)}
          style={styles.picker}
          enabled={false}
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
            style={[styles.input, styles.prefilledInput]}
            placeholder="Préciser l'assurance"
            value={formData.insurance_other}
            editable={false}
          />
        )}
      </View>

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

export default Step2;