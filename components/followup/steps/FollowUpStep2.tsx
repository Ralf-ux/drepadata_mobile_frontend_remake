import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFollowUp } from '../../../utils/followUpContext';

const FollowUpStep2 = () => {
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
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.stepTitle}>🔬 Examens de Laboratoire</Text>

      {renderNumericFieldWithQuickOptions('taux_hemoglobine_recent', 'Taux d\'hémoglobine (g/dl)', [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], ' g/dl')}
      {renderNumericFieldWithQuickOptions('taux_hbf_recent', 'Taux HbF (%)', [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], '%')}
      {renderNumericFieldWithQuickOptions('taux_hbs_recent', 'Taux HbS (%)', [50, 60, 70, 80, 90, 95], '%')}
      {renderNumericFieldWithQuickOptions('nfs_gb', 'NFS - GB (x10³/μL)', [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20], ' x10³/μL')}
      {renderNumericFieldWithQuickOptions('nfs_hb', 'NFS - Hb (g/dL)', [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], ' g/dL')}
      {renderNumericFieldWithQuickOptions('nfs_pqts', 'NFS - Plaquettes (x10³/μL)', [150, 200, 250, 300, 350, 400, 450, 500], ' x10³/μL')}
      {renderNumericFieldWithQuickOptions('reticulocytes', 'Reticulocytes (%)', [2, 5, 10, 15, 20, 25, 30], '%')}

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

export default FollowUpStep2;