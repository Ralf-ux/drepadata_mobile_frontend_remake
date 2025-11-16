import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/authSlice';
import { createPatient } from '@/api/users';

interface PatientData {
  // Basic Information
  lastName: string;
  firstName: string;
  sex: 'Male' | 'Female';
  dateOfDiagnosis: Date;
  ageAtDiagnosis: 'At birth' | '0-3 months' | '4-6 months' | '7-12 months' | '2-3 years' | '4-5 years';
  circumstancesOfDiagnosis: 'Neonatal diagnosis' | 'Diagnosis from siblings';
  uniqueId: string;
  birthOrderInSiblings: number;
  numberOfSickleCellInFamily: number;
  typeOfSickleCell: 'SS' | 'SC' | 'Sβ⁰' | 'Sβ⁺' | 'Other';
  personalMedicalHistory?: string;
  familyMedicalHistory?: string;
  bloodGroup: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  rhesusFactor: 'Positive' | 'Negative';
  vaccinesAtBirth?: string;

  // Demographic Data
  dateOfBirth?: Date;
  age?: number;
  relationshipWithPatient?: 'Father' | 'Mother' | 'Grandmother' | 'Grandfather' | 'Brother' | 'Sister' | 'Uncle' | 'Aunt' | 'Other';
  neighborhood?: string;
  locality?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  patientPhone?: string;
  livesWithPatient?: boolean;
  belongsToGroup?: boolean;
  groupName?: string;
  insurance: 'CNPS' | 'CNAS' | 'Private' | 'None' | 'Others';
  insuranceDetails?: string;

  // Medical History
  vocLast3Months?: 'None' | '1' | '1-2' | '3-5' | 'More than 5';
  familyHistory?: 'Yes' | 'No' | 'Unknown';
  otherMedicalHistory?: ('Nephropathy' | 'Cardiopathy' | 'Meningitis' | 'Others' | 'None')[];
  previousSurgicalInterventions?: {
    hasInterventions: boolean;
    dateOfLastIntervention?: Date;
    cause?: string;
  };
  folicAcid?: boolean;
  knownAllergies?: {
    hasAllergies: boolean;
    details?: string;
  };
}

const CreatePatientScreen = () => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState<PatientData>({
    // Basic Information
    lastName: '',
    firstName: '',
    sex: 'Male',
    dateOfDiagnosis: new Date(),
    ageAtDiagnosis: 'At birth',
    circumstancesOfDiagnosis: 'Neonatal diagnosis',
    uniqueId: `P${Date.now()}`,
    birthOrderInSiblings: 1,
    numberOfSickleCellInFamily: 0,
    typeOfSickleCell: 'SS',
    bloodGroup: 'O+',
    rhesusFactor: 'Positive',
    personalMedicalHistory: '',
    familyMedicalHistory: '',

    // Demographic Data
    dateOfBirth: new Date(),
    age: 0,
    relationshipWithPatient: undefined,
    neighborhood: '',
    locality: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    patientPhone: '',
    livesWithPatient: false,
    belongsToGroup: false,
    groupName: '',
    insurance: 'None',
    insuranceDetails: '',

    // Medical History
    vocLast3Months: undefined,
    familyHistory: undefined,
    otherMedicalHistory: undefined,
    previousSurgicalInterventions: {
      hasInterventions: false,
    },
    folicAcid: false,
    knownAllergies: {
      hasAllergies: false,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Auto-calculate age from dateOfBirth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.dateOfBirth]);

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    updateFormData('dateOfBirth', date);
    setShowDatePicker(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Sélectionner la date';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const updateFormData = <K extends keyof PatientData>(
    key: K,
    value: PatientData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateEmergencyContact = (field: 'name' | 'relationship' | 'phone', value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact!,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof PatientData)[] = [
      'lastName',
      'firstName',
      'sex',
      'dateOfDiagnosis',
      'ageAtDiagnosis',
      'circumstancesOfDiagnosis',
      'uniqueId',
      'birthOrderInSiblings',
      'numberOfSickleCellInFamily',
      'typeOfSickleCell',
      'bloodGroup',
      'rhesusFactor',
    ];

    const missing = requiredFields.filter(field => {
      const value = formData[field];
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (missing.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Champs obligatoires',
        text2: `Veuillez remplir : ${missing.join(', ')}`,
      });
      return;
    }

    try {
      const patientData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth,
        dateOfDiagnosis: formData.dateOfDiagnosis,
        emergencyContact: formData.emergencyContact,
        previousSurgicalInterventions: formData.previousSurgicalInterventions,
        knownAllergies: formData.knownAllergies,
      };

      await createPatient(patientData);
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Profil patient créé avec succès',
      });
      router.replace(`/consultation/${formData.uniqueId}`);
    } catch (error) {
      console.error('Error creating patient:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de créer le profil',
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      {/* Identification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations d'identification</Text>

        <Text style={styles.label}>
          Numéro d'identification unique
        </Text>
        <TextInput
          style={styles.input}
          value={formData.uniqueId}
          editable={false}
        />

        <Text style={styles.label}>
          Nom <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.lastName}
          onChangeText={v => updateFormData('lastName', v)}
          placeholder="Nom de famille"
        />

        <Text style={styles.label}>
          Prénom <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.firstName}
          onChangeText={v => updateFormData('firstName', v)}
          placeholder="Prénom"
        />

        <Text style={styles.label}>
          Sexe <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.sex}
          onValueChange={v => updateFormData('sex', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>

        <Text style={styles.label}>
          Date de naissance <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formData.dateOfBirth
              ? new Date(formData.dateOfBirth).toLocaleDateString('fr-FR')
              : 'Sélectionner la date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <Modal transparent visible={showDatePicker} animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  <Text style={styles.datePickerTitle}>Sélectionner une date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerButtonTextConfirm}>Confirmer</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.datePickerMonthYear}>
                  <Picker
                    selectedValue={(formData.dateOfBirth?.getMonth() || new Date().getMonth()).toString()}
                    onValueChange={(value) => {
                      const newDate = new Date(formData.dateOfBirth || new Date());
                      newDate.setMonth(parseInt(value));
                      updateFormData('dateOfBirth', newDate);
                    }}
                    style={styles.monthPicker}
                  >
                    {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((month, index) => (
                      <Picker.Item key={month} label={month} value={index.toString()} />
                    ))}
                  </Picker>
                  <Picker
                    selectedValue={(formData.dateOfBirth?.getFullYear() || new Date().getFullYear()).toString()}
                    onValueChange={(value) => {
                      const newDate = new Date(formData.dateOfBirth || new Date());
                      newDate.setFullYear(parseInt(value));
                      updateFormData('dateOfBirth', newDate);
                    }}
                    style={styles.yearPicker}
                  >
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map(year => (
                      <Picker.Item key={year} label={year.toString()} value={year.toString()} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.daysOfWeek}>
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <Text key={day} style={styles.dayOfWeekText}>{day}</Text>
                  ))}
                </View>

                <View style={styles.daysGrid}>
                  {(() => {
                    const year = formData.dateOfBirth?.getFullYear() || new Date().getFullYear();
                    const month = formData.dateOfBirth?.getMonth() || new Date().getMonth();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const firstDay = new Date(year, month, 1).getDay();
                    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                    const emptyDays = Array.from({ length: firstDay }, (_, i) => null);

                    return (
                      <>
                        {emptyDays.map((_, index) => (
                          <View key={`empty-${index}`} style={styles.emptyDay} />
                        ))}
                        {days.map(day => (
                          <TouchableOpacity
                            key={day}
                            style={[
                              styles.dayButton,
                              formData.dateOfBirth?.getDate() === day && formData.dateOfBirth?.getMonth() === month && formData.dateOfBirth?.getFullYear() === year
                                ? styles.selectedDay
                                : styles.normalDay
                            ]}
                            onPress={() => {
                              const newDate = new Date(formData.dateOfBirth || new Date());
                              newDate.setDate(day);
                              updateFormData('dateOfBirth', newDate);
                            }}
                          >
                            <Text style={[
                              styles.dayText,
                              formData.dateOfBirth?.getDate() === day && formData.dateOfBirth?.getMonth() === month && formData.dateOfBirth?.getFullYear() === year
                                ? styles.selectedDayText
                                : styles.normalDayText
                            ]}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </>
                    );
                  })()}
                </View>
              </View>
            </View>
          </Modal>
        )}

        <Text style={styles.label}>Âge</Text>
        <TextInput
          style={styles.input}
          value={formData.age?.toString()}
          editable={false}
          placeholder="Calculé automatiquement"
        />

        <Text style={styles.label}>
          Âge au diagnostic <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.ageAtDiagnosis}
          onValueChange={v => updateFormData('ageAtDiagnosis', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="At birth" value="At birth" />
          <Picker.Item label="0-3 months" value="0-3 months" />
          <Picker.Item label="4-6 months" value="4-6 months" />
          <Picker.Item label="7-12 months" value="7-12 months" />
          <Picker.Item label="2-3 years" value="2-3 years" />
          <Picker.Item label="4-5 years" value="4-5 years" />
        </Picker>

        <Text style={styles.label}>
          Circonstances du diagnostic <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.circumstancesOfDiagnosis}
          onValueChange={v => updateFormData('circumstancesOfDiagnosis', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Neonatal diagnosis" value="Neonatal diagnosis" />
          <Picker.Item label="Diagnosis from siblings" value="Diagnosis from siblings" />
        </Picker>

        <Text style={styles.label}>
          Type de drépanocytose <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.typeOfSickleCell}
          onValueChange={v => updateFormData('typeOfSickleCell', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="SS" value="SS" />
          <Picker.Item label="SC" value="SC" />
          <Picker.Item label="Sβ⁰" value="Sβ⁰" />
          <Picker.Item label="Sβ⁺" value="Sβ⁺" />
          <Picker.Item label="Other" value="Other" />
        </Picker>

        <Text style={styles.label}>
          Groupe sanguin <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.bloodGroup}
          onValueChange={v => updateFormData('bloodGroup', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => (
            <Picker.Item key={g} label={g} value={g} />
          ))}
        </Picker>

        <Text style={styles.label}>
          Rhésus <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.rhesusFactor}
          onValueChange={v => updateFormData('rhesusFactor', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Positive" value="Positive" />
          <Picker.Item label="Negative" value="Negative" />
        </Picker>

        <Text style={styles.label}>Rang dans la fratrie <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={formData.birthOrderInSiblings.toString()}
          onChangeText={v => updateFormData('birthOrderInSiblings', parseInt(v) || 1)}
          placeholder="1, 2, 3..."
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nombre de drépanocytaires dans la famille <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={formData.numberOfSickleCellInFamily.toString()}
          onChangeText={v => updateFormData('numberOfSickleCellInFamily', parseInt(v) || 0)}
          placeholder="0, 1, 2..."
          keyboardType="numeric"
        />
      </View>

      {/* Coordonnées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coordonnées</Text>

        <Text style={styles.label}>Quartier</Text>
        <TextInput
          style={styles.input}
          value={formData.neighborhood || ''}
          onChangeText={v => updateFormData('neighborhood', v)}
          placeholder="Nom du quartier"
        />

        <Text style={styles.label}>Lieu-dit</Text>
        <TextInput
          style={styles.input}
          value={formData.locality || ''}
          onChangeText={v => updateFormData('locality', v)}
          placeholder="Précision d'adresse"
        />

        <Text style={styles.label}>Téléphone du patient</Text>
        <TextInput
          style={styles.input}
          value={formData.patientPhone || ''}
          onChangeText={v => updateFormData('patientPhone', v)}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Lien avec le patient</Text>
        <Picker
          selectedValue={formData.relationshipWithPatient || ''}
          onValueChange={v => updateFormData('relationshipWithPatient', v as any)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Father" value="Father" />
          <Picker.Item label="Mother" value="Mother" />
          <Picker.Item label="Grandmother" value="Grandmother" />
          <Picker.Item label="Grandfather" value="Grandfather" />
          <Picker.Item label="Brother" value="Brother" />
          <Picker.Item label="Sister" value="Sister" />
          <Picker.Item label="Uncle" value="Uncle" />
          <Picker.Item label="Aunt" value="Aunt" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* Contact d'urgence */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact d'urgence</Text>

        <Text style={styles.label}>Nom du contact</Text>
        <TextInput
          style={styles.input}
          value={formData.emergencyContact?.name || ''}
          onChangeText={v => updateEmergencyContact('name', v)}
          placeholder="Nom complet"
        />

        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={formData.emergencyContact?.phone || ''}
          onChangeText={v => updateEmergencyContact('phone', v)}
          placeholder="Numéro de téléphone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Relation avec le patient</Text>
        <TextInput
          style={styles.input}
          value={formData.emergencyContact?.relationship || ''}
          onChangeText={v => updateEmergencyContact('relationship', v)}
          placeholder="Relation"
        />

        <Text style={styles.label}>Vit avec le patient</Text>
        <Picker
          selectedValue={formData.livesWithPatient ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('livesWithPatient', v === 'Oui')}
          style={styles.picker}
        >
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Oui" value="Oui" />
        </Picker>
      </View>

      {/* Antécédents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Antécédents médicaux</Text>

        <Text style={styles.label}>Antécédents personnels</Text>
        <TextInput
          style={styles.input}
          value={formData.personalMedicalHistory || ''}
          onChangeText={v => updateFormData('personalMedicalHistory', v)}
          placeholder="Antécédents personnels..."
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Antécédents familiaux</Text>
        <TextInput
          style={styles.input}
          value={formData.familyMedicalHistory || ''}
          onChangeText={v => updateFormData('familyMedicalHistory', v)}
          placeholder="Drépanocytose dans la famille..."
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>VOC dans les 3 derniers mois</Text>
        <Picker
          selectedValue={formData.vocLast3Months || ''}
          onValueChange={v => updateFormData('vocLast3Months', v as any)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="None" value="None" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="1-2" value="1-2" />
          <Picker.Item label="3-5" value="3-5" />
          <Picker.Item label="More than 5" value="More than 5" />
        </Picker>

        <Text style={styles.label}>Antécédents familiaux de drépanocytose</Text>
        <Picker
          selectedValue={formData.familyHistory || ''}
          onValueChange={v => updateFormData('familyHistory', v as any)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
          <Picker.Item label="Unknown" value="Unknown" />
        </Picker>

        <Text style={styles.label}>Autres antécédents médicaux</Text>
        <Picker
          selectedValue={formData.otherMedicalHistory?.[0] || ''}
          onValueChange={v => updateFormData('otherMedicalHistory', [v as any] as any)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Nephropathy" value="Nephropathy" />
          <Picker.Item label="Cardiopathy" value="Cardiopathy" />
          <Picker.Item label="Meningitis" value="Meningitis" />
          <Picker.Item label="Others" value="Others" />
          <Picker.Item label="None" value="None" />
        </Picker>

        <Text style={styles.label}>Acide folique</Text>
        <Picker
          selectedValue={formData.folicAcid ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('folicAcid', v === 'Oui')}
          style={styles.picker}
        >
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Oui" value="Oui" />
        </Picker>

        <Text style={styles.label}>Allergies connues</Text>
        <Picker
          selectedValue={formData.knownAllergies?.hasAllergies ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('knownAllergies', { hasAllergies: v === 'Oui' })}
          style={styles.picker}
        >
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Oui" value="Oui" />
        </Picker>

        {formData.knownAllergies?.hasAllergies && (
          <>
            <Text style={styles.label}>Détails des allergies</Text>
            <TextInput
              style={styles.input}
              value={formData.knownAllergies.details || ''}
              onChangeText={v => updateFormData('knownAllergies', { hasAllergies: formData.knownAllergies?.hasAllergies || false, details: v })}
              placeholder="Médicaments, aliments..."
              multiline
              numberOfLines={3}
            />
          </>
        )}

        <Text style={styles.label}>Interventions chirurgicales</Text>
        <Picker
          selectedValue={formData.previousSurgicalInterventions?.hasInterventions ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('previousSurgicalInterventions', { hasInterventions: v === 'Oui' })}
          style={styles.picker}
        >
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Oui" value="Oui" />
        </Picker>

        {formData.previousSurgicalInterventions?.hasInterventions && (
          <>
            <Text style={styles.label}>Cause de la dernière intervention</Text>
            <TextInput
              style={styles.input}
              value={formData.previousSurgicalInterventions.cause || ''}
              onChangeText={v => updateFormData('previousSurgicalInterventions', { hasInterventions: formData.previousSurgicalInterventions?.hasInterventions || false, cause: v })}
              placeholder="Cause de l'intervention"
            />
          </>
        )}
      </View>

      {/* Informations sociales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations sociales</Text>

        <Text style={styles.label}>Appartient à un groupe</Text>
        <Picker
          selectedValue={formData.belongsToGroup ? 'Oui' : 'Non'}
          onValueChange={v => updateFormData('belongsToGroup', v === 'Oui')}
          style={styles.picker}
        >
          <Picker.Item label="Non" value="Non" />
          <Picker.Item label="Oui" value="Oui" />
        </Picker>

        {formData.belongsToGroup && (
          <>
            <Text style={styles.label}>Nom du groupe</Text>
            <TextInput
              style={styles.input}
              value={formData.groupName || ''}
              onChangeText={v => updateFormData('groupName', v)}
              placeholder="Nom du groupe ou association"
            />
          </>
        )}

        <Text style={styles.label}>Assurance</Text>
        <Picker
          selectedValue={formData.insurance}
          onValueChange={v => updateFormData('insurance', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="CNPS" value="CNPS" />
          <Picker.Item label="CNAS" value="CNAS" />
          <Picker.Item label="Private" value="Private" />
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Others" value="Others" />
        </Picker>

        {formData.insurance === 'Others' && (
          <>
            <Text style={styles.label}>Préciser l'assurance</Text>
            <TextInput
              style={styles.input}
              value={formData.insuranceDetails || ''}
              onChangeText={v => updateFormData('insuranceDetails', v)}
              placeholder="Nom de l'assurance"
            />
          </>
        )}

        <Text style={styles.label}>Vaccins à la naissance</Text>
        <TextInput
          style={styles.input}
          value={formData.vaccinesAtBirth || ''}
          onChangeText={v => updateFormData('vaccinesAtBirth', v)}
          placeholder="Vaccins administrés à la naissance"
        />
      </View>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!isAuthenticated}
        >
          <Text style={styles.submitButtonText}>Créer le profil patient</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginTop: 12,
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#495057',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerButton: {
    padding: 10,
  },
  datePickerButtonText: {
    color: '#666',
    fontSize: 16,
  },
  datePickerButtonTextConfirm: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  datePickerMonthYear: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthPicker: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  yearPicker: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayOfWeekText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  emptyDay: {
    width: 40,
    height: 40,
  },
  dayButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  normalDay: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  normalDayText: {
    color: '#333',
  },
});

export default CreatePatientScreen;