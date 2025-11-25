import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import CrossPlatformDateTimePicker from '../../CrossPlatformDateTimePicker';
import { useFollowUp } from '../../../utils/followUpContext';

const FollowUpStep5 = () => {
  const { formData, updateFormData } = useFollowUp();
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
      <Text style={styles.stepTitle}>📝 Évolution et Commentaires</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Évolution depuis la dernière consultation</Text>
        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          multiline
          numberOfLines={5}
          value={formData.evolution}
          onChangeText={value => updateFormData('evolution', value)}
          placeholder="Décrivez l'évolution du patient"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Commentaires généraux</Text>
        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          multiline
          numberOfLines={5}
          value={formData.commentaires}
          onChangeText={value => updateFormData('commentaires', value)}
          placeholder="Observations, recommandations..."
        />
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
});

export default FollowUpStep5;