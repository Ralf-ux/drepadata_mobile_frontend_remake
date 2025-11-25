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
import CrossPlatformDateTimePicker from '../../CrossPlatformDateTimePicker';
import { useConsultation } from '../../../utils/consultationContext';

const { width } = Dimensions.get('window');

const Step8 = () => {
  const { formData, updateFormData } = useConsultation();
  const [showDatePicker, setShowDatePicker] = useState({ field: '', visible: false });

  const addExamen = () => {
    updateFormData('examens_avant_consultation', [...formData.examens_avant_consultation, '']);
  };

  const updateExamen = (index: number, value: string) => {
    const updated = [...formData.examens_avant_consultation];
    updated[index] = value;
    updateFormData('examens_avant_consultation', updated);
  };

  const removeExamen = (index: number) => {
    if (formData.examens_avant_consultation.length > 1) {
      const updated = formData.examens_avant_consultation.filter((_, i) => i !== index);
      updateFormData('examens_avant_consultation', updated);
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
      <Text style={styles.stepTitle}>📋 Plan de suivi</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Examens avant la prochaine consultation</Text>
        {formData.examens_avant_consultation.map((examen, index) => (
          <View key={index} style={styles.examenItem}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={examen}
              onChangeText={value => updateExamen(index, value)}
              placeholder="Nom de l'examen"
            />
            {formData.examens_avant_consultation.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeExamen(index)}
              >
                <Text style={styles.removeButtonText}>❌</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addExamen}>
          <Text style={styles.addButtonText}>➕ Ajouter un examen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Évolution depuis la dernière consultation</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={formData.evolution}
          onChangeText={value => updateFormData('evolution', value)}
          placeholder="Décrivez l'évolution du patient"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Éducation thérapeutique</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.education_therapeutique_step8}
          onChangeText={value => updateFormData('education_therapeutique_step8', value)}
          placeholder="Points d'éducation thérapeutique abordés"
        />
      </View>

      {renderDatePicker('date_prochaine_consultation_plan', 'Date prévue de la prochaine consultation')}

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
  examenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
  },
  removeButtonText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default Step8;