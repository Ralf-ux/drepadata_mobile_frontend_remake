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
import { useFollowUp } from '../../../utils/followUpContext';

const FollowUpStep3 = () => {
  const { formData, updateFormData, handleCheckbox } = useFollowUp();
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
            {formData[field] ? new Date(formData[field] as string).toLocaleDateString('fr-FR') : 'Sélectionner date'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.stepTitle}>💊 Traitements Actuels</Text>

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
              <Picker.Item label="Bonne tolérance" value="Bonne tolérance" />
              <Picker.Item label="Tolérance moyenne" value="Tolérance moyenne" />
              <Picker.Item label="Mauvaise tolérance" value="Mauvaise tolérance" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Posologie de l'hydroxyurée (mg/kg/jour)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.posologie_hydroxyurea}
              onChangeText={value => updateFormData('posologie_hydroxyurea', value)}
              placeholder="Dosage en mg/kg/jour"
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
        <Text style={styles.label}>Transfusion régulière</Text>
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
              <Picker.Item label="Sang Total" value="Sang Total" />
              <Picker.Item label="Culot globulaire" value="Culot globulaire" />
              <Picker.Item label="Sang fractionné" value="Sang fractionné" />
              <Picker.Item label="Plaquettes" value="Plaquettes" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Fréquence de transfusion durant les trois derniers mois</Text>
            <Picker
              selectedValue={formData.frequence_transfusion_3mois}
              onValueChange={value => updateFormData('frequence_transfusion_3mois', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="0-1 poche" value="0-1 poche" />
              <Picker.Item label="2-4 poches" value="2-4 poches" />
              <Picker.Item label="3-5 poches" value="3-5 poches" />
              <Picker.Item label="6-8 poches" value="6-8 poches" />
              <Picker.Item label="Plus de 8 poches" value="Plus de 8 poches" />
            </Picker>
          </View>

          {renderDatePicker('last_transfusion_date', 'Dernière transfusion')}
        </>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Autres traitements spécifiques</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.autres_traitements_specifiques}
          onChangeText={value => updateFormData('autres_traitements_specifiques', value)}
          placeholder="Traitements spécifiques additionnels"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Observance</Text>
        {['Mois 1', 'Mois 2', 'Mois 3'].map(option => (
          <View key={option} style={styles.checkboxItem}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                (formData.observance as string[]).includes(option) && styles.checkboxSelected
              ]}
              onPress={() => handleCheckbox('observance', option)}
            >
              <Text style={[
                styles.checkboxText,
                (formData.observance as string[]).includes(option) && styles.checkboxTextSelected
              ]}>
                ✓
              </Text>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>{option}</Text>
          </View>
        ))}
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
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkboxText: {
    color: 'white',
    fontSize: 16,
  },
  checkboxTextSelected: {
    color: 'white',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#495057',
    flex: 1,
  },
});

export default FollowUpStep3;