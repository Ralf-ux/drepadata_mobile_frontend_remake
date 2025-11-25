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

const Step1 = () => {
  const { formData, updateFormData } = useConsultation();
  const [showDatePicker, setShowDatePicker] = useState({ field: '', visible: false });

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

  const renderDatePicker = (field: keyof typeof formData, label: string, required = false) => {
    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
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
      <Text style={styles.stepTitle}>📋 Informations administratives</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Structure de santé partenaire <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.fosa}
          onValueChange={value => updateFormData('fosa', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Centre Hospitalier Nicolas Barre" value="Centre Hospitalier Nicolas Barre" />
          <Picker.Item label="Centre Hospitalier d'Essos" value="Centre Hospitalier d'Essos" />
          <Picker.Item label="Hôpital de District de la Cite Verte" value="Hôpital de District de la Cite Verte" />
          <Picker.Item label="Hôpital Gynéco-Obstétrique et pédiatrique de Yaoundé" value="Hôpital Gynéco-Obstétrique et pédiatrique de Yaoundé" />
          <Picker.Item label="Hôpital Monseigneur Jean Zoa de Nkoldongo" value="Hôpital Monseigneur Jean Zoa de Nkoldongo" />
          <Picker.Item label="Hôpital Catholique Sainte Marie des Anges de Nkoabang" value="Hôpital Catholique Sainte Marie des Anges de Nkoabang" />
          <Picker.Item label="Hôpital Laquintinie de Douala" value="Hôpital Laquintinie de Douala" />
          <Picker.Item label="Hôpital Catholique Albert Legrand de Bonaberi" value="Hôpital Catholique Albert Legrand de Bonaberi" />
          <Picker.Item label="Fondation Padre Pio" value="Fondation Padre Pio"/>
          <Picker.Item label="Hôpital Ad Lucem de Bonamousadi" value="Hôpital Ad Lucem de Bonamousadi" />
          <Picker.Item label="Autres" value="Autres" />
        </Picker>
        {formData.fosa === 'Autres' && (
          <TextInput
            style={styles.input}
            placeholder="Veuillez préciser"
            value={formData.fosa_other}
            onChangeText={value => updateFormData('fosa_other', value)}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Personnel remplissant le formulaire</Text>
        <Picker
          selectedValue={formData.personnel_remplissant}
          onValueChange={value => updateFormData('personnel_remplissant', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Médecin" value="Medecin" />
          <Picker.Item label="Infirmier" value="Infirmier" />
          <Picker.Item label="APS (Accompagnateur Psychosocial)" value="APS" />
          <Picker.Item label="Laborantin" value="Laborantin" />
          <Picker.Item label="Autres" value="Autres" />
        </Picker>
      </View>

      {renderNumericFieldWithQuickOptions('poids', 'Poids (kg)', [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], ' kg')}

      {renderNumericFieldWithQuickOptions('taille', 'Taille (cm)', [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200], ' cm')}

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Région <Text style={styles.required}>*</Text>
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <Picker
          selectedValue={formData.region}
          onValueChange={value => updateFormData('region', value)}
          style={styles.picker}
          enabled={false}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Centre" value="Centre" />
          <Picker.Item label="Littoral" value="Littoral" />
          <Picker.Item label="Ouest" value="Ouest" />
          <Picker.Item label="Nord-Ouest" value="Nord-Ouest" />
          <Picker.Item label="Sud-Ouest" value="Sud-Ouest" />
          <Picker.Item label="Est" value="Est" />
          <Picker.Item label="Nord" value="Nord" />
          <Picker.Item label="Adamaoua" value="Adamaoua" />
          <Picker.Item label="Extrême-Nord" value="Extrême-Nord" />
          <Picker.Item label="Sud" value="Sud" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          District <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.district}
          onChangeText={value => updateFormData('district', value)}
          placeholder="Entrer le district"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Date de diagnostic <Text style={styles.required}>*</Text>
          <Text style={styles.prefilledNote}> (pré-rempli depuis le profil patient)</Text>
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, styles.prefilledInput]}
          onPress={() => setShowDatePicker({ field: 'diagnostic_date', visible: true })}
        >
          <Text style={styles.dateText}>
            {formData.diagnostic_date ? new Date(formData.diagnostic_date).toLocaleDateString() : 'Sélectionner date'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>IPP</Text>
        <TextInput
          style={styles.input}
          value={formData.ipp}
          onChangeText={value => updateFormData('ipp', value)}
          placeholder="Numéro IPP"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Personnel médical</Text>
        <TextInput
          style={styles.input}
          value={formData.personnel}
          onChangeText={value => updateFormData('personnel', value)}
          placeholder="Nom du personnel médical"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Patient référé</Text>
        <Picker
          selectedValue={formData.referred}
          onValueChange={value => updateFormData('referred', value)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Oui" value="Oui" />
          <Picker.Item label="Non" value="Non" />
        </Picker>
      </View>

      {formData.referred === 'Oui' && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Référé de</Text>
            <Picker
              selectedValue={formData.referred_from}
              onValueChange={value => updateFormData('referred_from', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Hôpital district" value="Hôpital district" />
              <Picker.Item label="Centre de santé" value="Centre de santé" />
              <Picker.Item label="Médecin privé" value="Médecin privé" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
            {formData.referred_from === 'Autres' && (
              <TextInput
                style={styles.input}
                placeholder="Veuillez préciser"
                value={formData.referred_from_other}
                onChangeText={value => updateFormData('referred_from_other', value)}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Référé pour</Text>
            <Picker
              selectedValue={formData.referred_for}
              onValueChange={value => updateFormData('referred_for', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Meilleure prise en charge" value="Meilleure prise en charge" />
              <Picker.Item label="Suivi trimestriel" value="Suivi trimestriel" />
              <Picker.Item label="Urgence" value="Urgence" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
          </View>
        </>
      )}

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
  required: {
    color: '#dc3545',
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

export default Step1;