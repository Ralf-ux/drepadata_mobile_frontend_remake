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

const Step4 = () => {
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
      <Text style={styles.stepTitle}>🏥 Historique des complications</Text>

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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Plus longue hospitalisation (jours)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.longest_hospitalization}
          onChangeText={value => updateFormData('longest_hospitalization', value)}
          placeholder="Durée en jours"
        />
      </View>

      {renderNumericFieldWithQuickOptions('taux_hemoglobine_recent', 'Taux d\'hémoglobine le plus récent (g/dl)', [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], ' g/dl')}

      {renderNumericFieldWithQuickOptions('taux_hbf_recent', 'Taux d\'hémoglobine F le plus récent (tx HbF) (%)', [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], '%')}

      {renderNumericFieldWithQuickOptions('taux_hbs_recent', 'Taux d\'hémoglobine S le plus récent (tx HbS) (%)', [50, 60, 70, 80, 90, 95], '%')}

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
          <Picker.Item label="N/A" value="N/A" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ulcères de jambe</Text>
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
});

export default Step4;