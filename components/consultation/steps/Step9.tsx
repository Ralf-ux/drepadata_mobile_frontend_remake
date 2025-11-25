import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useConsultation } from '../../../utils/consultationContext';

const Step9 = () => {
  const { formData, updateFormData } = useConsultation();

  return (
    <View>
      <Text style={styles.stepTitle}>📝 Commentaires et observations</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Commentaires généraux</Text>
        <TextInput
          style={[styles.input, { minHeight: 120 }]}
          multiline
          numberOfLines={6}
          value={formData.commentaires}
          onChangeText={value => updateFormData('commentaires', value)}
          placeholder="Observations particulières, recommandations spéciales, notes importantes..."
        />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 Résumé de la consultation</Text>
        <Text style={styles.summaryText}>Patient: {formData.full_name || 'Non renseigné'}</Text>
        <Text style={styles.summaryText}>Âge: {formData.age || 'Non renseigné'} ans</Text>
        <Text style={styles.summaryText}>Type: {formData.sickle_type || 'Non renseigné'}</Text>
        <Text style={styles.summaryText}>Structure: {formData.fosa || 'Non renseignée'}</Text>
        <Text style={styles.summaryText}>Hydroxyurée: {formData.hydroxyurea || 'Non renseigné'}</Text>
        <Text style={styles.summaryText}>Personnel: {formData.personnel_remplissant || 'Non renseigné'}</Text>
        <Text style={styles.summaryText}>Poids: {formData.poids || 'Non renseigné'} kg</Text>
        <Text style={styles.summaryText}>Taille: {formData.taille || 'Non renseigné'} cm</Text>
      </View>

      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>⚠️ Attention</Text>
        <Text style={styles.warningText}>
          Vérifiez toutes les informations avant de sauvegarder. Cette consultation sera enregistrée dans le système.
        </Text>
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
  summaryCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 4,
  },
  warningCard: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
  },
});

export default Step9;