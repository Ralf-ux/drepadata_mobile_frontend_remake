import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFollowUp } from '../../../utils/followUpContext';

const { width } = Dimensions.get('window');

const FollowUpStep1 = () => {
  const { formData, updateFormData } = useFollowUp();

  const renderNumericFieldWithQuickOptions = (
    field: keyof typeof formData,
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

  return (
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
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 20,
    color: '#28a745',
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
    backgroundColor: '#28a745',
  },
  quickOptionText: {
    fontSize: 14,
    color: '#495057',
  },
  quickOptionTextSelected: {
    color: 'white',
  },
});

export default FollowUpStep1;