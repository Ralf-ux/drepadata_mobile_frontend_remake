import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFollowUp } from '../../../utils/followUpContext';

const FollowUpStep4 = () => {
  const { formData, updateFormData } = useFollowUp();

  return (
    <View>
      <Text style={styles.stepTitle}>📚 Impact Psychosocial</Text>

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
});

export default FollowUpStep4;