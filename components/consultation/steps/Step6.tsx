import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useConsultation } from '../../../utils/consultationContext';

const Step6 = () => {
  const { formData, updateFormData } = useConsultation();

  const renderNumericFieldWithQuickOptions = (field: keyof typeof formData, label: string, options: number[], unit = '') => {
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

  return (
    <View>
      <Text style={styles.stepTitle}>🔬 Examens complémentaires</Text>

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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Marqueurs d'hémolyse</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.hemolysis}
          onChangeText={value => updateFormData('hemolysis', value)}
          placeholder="LDH, bilirubine, haptoglobine..."
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Groupe sanguin - Rhésus
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.gs_rh}
          onValueChange={value => updateFormData('gs_rh', value)}
          style={styles.picker}
          enabled={false}
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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Imagerie médicale</Text>
        <Picker
          selectedValue={formData.imagerie_medical}
          onValueChange={value => updateFormData('imagerie_medical', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Échographie" value="Échographie" />
          <Picker.Item label="Radiographie" value="Radiographie" />
          <Picker.Item label="Scanner" value="Scanner" />
          <Picker.Item label="IRM" value="IRM" />
          <Picker.Item label="Doppler" value="Doppler" />
          <Picker.Item label="Autres" value="Autres" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ophtalmologie</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          value={formData.ophtalmologie}
          onChangeText={value => updateFormData('ophtalmologie', value)}
          placeholder="Résultats de l'examen ophtalmologique"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Consultations spécialisées</Text>
        <Picker
          selectedValue={formData.consultations_specialisees}
          onValueChange={value => updateFormData('consultations_specialisees', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Cardiologie" value="Cardiologie" />
          <Picker.Item label="Pneumologie" value="Pneumologie" />
          <Picker.Item label="Néphrologie" value="Néphrologie" />
          <Picker.Item label="Neurologie" value="Neurologie" />
          <Picker.Item label="Orthopédie" value="Orthopédie" />
          <Picker.Item label="Urologie" value="Urologie" />
          <Picker.Item label="Autres" value="Autres" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Examen du jour</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.examen_du_jour}
          onChangeText={value => updateFormData('examen_du_jour', value)}
          placeholder="Examens effectués lors de cette consultation"
        />
      </View>
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
    backgroundColor: '#dc3545',
  },
  quickOptionText: {
    fontSize: 14,
    color: '#495057',
  },
  quickOptionTextSelected: {
    color: 'white',
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

export default Step6;