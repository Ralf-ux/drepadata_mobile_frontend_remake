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

const Step7 = () => {
  const { formData, updateFormData } = useConsultation();
  const [showDatePicker, setShowDatePicker] = useState({ field: '', visible: false });

  const handleCheckbox = (key: keyof typeof formData, value: string) => {
    const current = (formData[key] as string[]) || [];
    if (current.includes(value)) {
      updateFormData(key, current.filter(v => v !== value));
    } else {
      updateFormData(key, [...current, value]);
    }
  };

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
      <Text style={styles.stepTitle}>📚 Impact psychosocial</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Impact scolaire/professionnel</Text>
        <Picker
          selectedValue={formData.impact_scolaire}
          onValueChange={value => updateFormData('impact_scolaire', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Aucun" value="Aucun" />
          <Picker.Item label="Léger" value="Léger" />
          <Picker.Item label="Modéré" value="Modéré" />
          <Picker.Item label="Sévère" value="Sévère" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Participation à des causeries éducatives</Text>
        <Picker
          selectedValue={formData.participation_causeries}
          onValueChange={value => updateFormData('participation_causeries', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Suivi psychologique</Text>
        <Picker
          selectedValue={formData.suivie_psychologique}
          onValueChange={value => updateFormData('suivie_psychologique', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Éducation thérapeutique</Text>
        <Picker
          selectedValue={formData.education_therapeutique}
          onValueChange={value => updateFormData('education_therapeutique', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Visite à domicile</Text>
        <Picker
          selectedValue={formData.visite_domicile}
          onValueChange={value => updateFormData('visite_domicile', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Soutien social</Text>
        <Picker
          selectedValue={formData.soutien_social}
          onValueChange={value => updateFormData('soutien_social', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.soutien_social === 'Oui' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Options de soutien social</Text>
          {['Consultation sociale', 'Consultation gratuite', 'Médicament gratuit', 'Inscription gratuite à l\'école', 'Réduction des frais de transport'].map(option => (
            <View key={option} style={styles.checkboxItem}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  ((formData.soutien_social_options as string[]) || []).includes(option) && styles.checkboxSelected
                ]}
                onPress={() => handleCheckbox('soutien_social_options', option)}
              >
                <Text style={[
                  styles.checkboxText,
                  ((formData.soutien_social_options as string[]) || []).includes(option) && styles.checkboxTextSelected
                ]}>
                  ✓
                </Text>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>{option}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Accompagnement spécial</Text>
        <Picker
          selectedValue={formData.accompagnement_special}
          onValueChange={value => updateFormData('accompagnement_special', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Séparation de couple" value="Séparation de couple" />
          <Picker.Item label="Rejet familial" value="Rejet familial" />
          <Picker.Item label="Discrimination" value="Discrimination" />
          <Picker.Item label="Autres" value="Autres" />
          <Picker.Item label="Aucun" value="Aucun" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Famille informée sur la maladie</Text>
        <Picker
          selectedValue={formData.famille_informee}
          onValueChange={value => updateFormData('famille_informee', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Partiellement" value="Partiellement" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Plan de suivi personnalisé</Text>
        <Picker
          selectedValue={formData.plan_suivi_personnalise}
          onValueChange={value => updateFormData('plan_suivi_personnalise', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {renderDatePicker('date_prochaine_consultation', 'Date de la prochaine consultation')}

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
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  checkboxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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

export default Step7;