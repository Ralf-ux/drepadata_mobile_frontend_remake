/* CreatePatientScreen.tsx – Professional Medical Form */
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CrossPlatformDateTimePicker from '../components/CrossPlatformDateTimePicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { savePatient, getPatients, type PatientProfile } from '@/utils/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/* ------------------------------------------------------------- */
/* REUSE COLORS & TOKENS FROM HOME                               */
/* ------------------------------------------------------------- */
const COLORS = {
  bg: '#FFF1F2',
  bgSecondary: '#FFF7ED',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  red: '#DC2626',
  redLight: '#FCA5A5',
  redBg: '#FEE2E2',
  rose: '#F43F5E',
  roseLight: '#FDA4AF',
  roseBg: '#FFE4E6',
  amber: '#F59E0B',
  amberBg: '#FEF3C7',
  emerald: '#10B981',
  emeraldBg: '#D1FAE5',
  border: '#FFE4E6',
  borderLight: '#FFF1F2',
  shadow: 'rgba(220, 38, 38, 0.15)',
};

const SPACING = 8;
const RADIUS = 12;

/* ------------------------------------------------------------- */
/* ICON HELPER                                                   */
/* ------------------------------------------------------------- */
const Icon = ({ name, size = 20, color = COLORS.textPrimary }: any) => (
  <Ionicons name={name} size={size} color={color} />
);

/* ------------------------------------------------------------- */
/* FORM LABEL COMPONENT                                          */
/* ------------------------------------------------------------- */
const FormLabel = ({ children, required = false }: { children: string; required?: boolean }) => (
  <Text style={styles.label}>
    {children}
    {required && <Text style={styles.required}> *</Text>}
  </Text>
);

/* ------------------------------------------------------------- */
/* MAIN SCREEN                                                   */
/* ------------------------------------------------------------- */
export default function CreatePatientScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState({
    id: uuidv4(),
    numero_identification_unique: `P${Date.now()}`,
    nom: '',
    prenom: '',
    sexe: '',
    date_diagnostic: '',
    age_diagnostic: '',
    circonstances_du_diagnostic: '',
    rang_dans_fratrie: '',
    nombre_de_drepanocytaires_dans_fratrie: '',
    type_de_drepanocytose: '',
    antecedent_familiaux: '',
    groupe_sanguin_rhesus: '',
    vaccins_naissance: {} as Record<string, boolean>,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const update = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const required: (keyof typeof formData)[] = [
      'nom', 'prenom', 'sexe', 'date_diagnostic', 'age_diagnostic',
      'circonstances_du_diagnostic', 'type_de_drepanocytose', 'groupe_sanguin_rhesus',
    ];
    const missing = required.filter(k => !formData[k]);
    if (missing.length) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await savePatient(formData as unknown as PatientProfile);
      
      // Refresh patient list by fetching from API
      // The savePatient function already saves to local storage, but we need to ensure
      // the list screen refreshes when we navigate back
      
      Alert.alert(
        'Succès',
        'Profil patient créé avec succès',
        [
          {
            text: 'Créer la consultation initiale',
            onPress: async () => {
              // Get the updated patient with MongoDB ObjectId
              const patients = await getPatients();
              const savedPatient = patients.find(p => 
                p.numero_identification_unique === formData.numero_identification_unique
              );
              if (savedPatient) {
                router.replace(`/consultation/${savedPatient.id}` as any);
              } else {
                // Fallback to UUID if not found (shouldn't happen)
                router.replace(`/consultation/${formData.id}` as any);
              }
            },
          },
          {
            text: 'Retour à l\'accueil',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating patient:', error);
      Alert.alert('Erreur', 'Impossible de créer le profil. Veuillez réessayer.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="person-add" size={24} color={COLORS.red} />
            <Text style={styles.cardTitle}>Nouveau patient</Text>
          </View>

          {/* Identification */}
          <FormLabel required>Nom</FormLabel>
          <TextInput
            style={styles.input}
            value={formData.nom}
            onChangeText={v => update('nom', v)}
            placeholder="Nom de famille"
            placeholderTextColor={COLORS.textSecondary}
          />

          <FormLabel required>Prénom</FormLabel>
          <TextInput
            style={styles.input}
            value={formData.prenom}
            onChangeText={v => update('prenom', v)}
            placeholder="Prénom"
            placeholderTextColor={COLORS.textSecondary}
          />

          <FormLabel required>Sexe</FormLabel>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.sexe}
              onValueChange={v => update('sexe', v)}
              style={styles.picker}
            >
              <Picker.Item label="-- Sélectionner --" value="" />
              <Picker.Item label="Masculin" value="Masculin" />
              <Picker.Item label="Féminin" value="Féminin" />
            </Picker>
          </View>

          <FormLabel required>Date du diagnostic</FormLabel>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[
              styles.dateText,
              !formData.date_diagnostic && styles.placeholder
            ]}>
              {formData.date_diagnostic
                ? new Date(formData.date_diagnostic).toLocaleDateString('fr-FR')
                : 'Sélectionner la date'}
            </Text>
            <Icon name="calendar" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          {showDatePicker && (
            <CrossPlatformDateTimePicker
              value={formData.date_diagnostic ? new Date(formData.date_diagnostic) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) update('date_diagnostic', selectedDate.toISOString());
              }}
            />
          )}

          <FormLabel required>Âge au diagnostic</FormLabel>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.age_diagnostic}
            onChangeText={v => update('age_diagnostic', v)}
            placeholder="ex. 3"
            placeholderTextColor={COLORS.textSecondary}
          />

          <FormLabel required>Circonstances du diagnostic</FormLabel>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={3}
            value={formData.circonstances_du_diagnostic}
            onChangeText={v => update('circonstances_du_diagnostic', v)}
            placeholder="Décrire les circonstances"
            placeholderTextColor={COLORS.textSecondary}
          />

          <FormLabel required>Type de drépanocytose</FormLabel>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.type_de_drepanocytose}
              onValueChange={v => update('type_de_drepanocytose', v)}
              style={styles.picker}
            >
              <Picker.Item label="-- Sélectionner --" value="" />
              <Picker.Item label="SS" value="SS" />
              <Picker.Item label="SC" value="SC" />
              <Picker.Item label="Sβ⁰" value="Sβ⁰" />
              <Picker.Item label="Sβ⁺" value="Sβ⁺" />
              <Picker.Item label="Autre" value="Autre" />
            </Picker>
          </View>

          <FormLabel>Antécédents familiaux</FormLabel>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={3}
            value={formData.antecedent_familiaux}
            onChangeText={v => update('antecedent_familiaux', v)}
            placeholder="Antécédents familiaux de drépanocytose"
            placeholderTextColor={COLORS.textSecondary}
          />

          <FormLabel required>Groupe sanguin / Rhésus</FormLabel>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.groupe_sanguin_rhesus}
              onValueChange={v => update('groupe_sanguin_rhesus', v)}
              style={styles.picker}
            >
              <Picker.Item label="-- Sélectionner --" value="" />
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => (
                <Picker.Item key={g} label={g} value={g} />
              ))}
            </Picker>
          </View>

          <FormLabel>Rang dans la fratrie</FormLabel>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.rang_dans_fratrie}
              onValueChange={v => update('rang_dans_fratrie', v)}
              style={styles.picker}
            >
              <Picker.Item label="-- Sélectionner --" value="" />
              {[...Array(12)].map((_, i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
              ))}
            </Picker>
          </View>

          <FormLabel>Nombre de drépanocytaires dans la fratrie</FormLabel>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.nombre_de_drepanocytaires_dans_fratrie}
              onValueChange={v => update('nombre_de_drepanocytaires_dans_fratrie', v)}
              style={styles.picker}
            >
              <Picker.Item label="-- Sélectionner --" value="" />
              {['0', '1', '2', '3', '4', '5', '6+'].map(n => (
                <Picker.Item key={n} label={n} value={n} />
              ))}
            </Picker>
          </View>

          <FormLabel>Vaccins reçus à la naissance</FormLabel>
          <View style={styles.checkGroup}>
            {['BCG', 'Hépatite B', 'Polio (VPO 0)', 'Pneumo 13'].map(v => (
              <TouchableOpacity
                key={v}
                style={styles.checkRow}
                onPress={() =>
                  update('vaccins_naissance', {
                    ...formData.vaccins_naissance,
                    [v]: !formData.vaccins_naissance[v],
                  })
                }
              >
                <Text style={styles.checkLabel}>{v}</Text>
                <View style={[
                  styles.checkbox,
                  formData.vaccins_naissance[v] && styles.checkboxChecked
                ]}>
                  {formData.vaccins_naissance[v] && (
                    <Icon name="checkmark" size={14} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Submit Button */}
      <View style={styles.footer}>
        <LinearGradient
          colors={[COLORS.red, COLORS.rose]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitButton}
        >
          <TouchableOpacity onPress={handleSubmit} style={styles.submitInner}>
            <Text style={styles.submitText}>Créer le profil patient</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------- */
/* STYLES – 100% CONSISTENT WITH HomeScreen.tsx                  */
/* ------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING * 3,
    marginTop: SPACING * 2,
    marginBottom: SPACING * 2,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING * 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING * 1.5,
    marginBottom: SPACING * 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING,
  },
  required: {
    color: COLORS.red,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS - 2,
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.8,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING * 2,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS - 2,
    marginBottom: SPACING * 2,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: COLORS.white,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS - 2,
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.8,
    marginBottom: SPACING * 2,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  placeholder: {
    color: COLORS.textSecondary,
  },
  checkGroup: {
    marginTop: SPACING,
    marginBottom: SPACING * 2,
  },
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING * 1.2,
  },
  checkLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING * 3,
    paddingBottom: SPACING * 2 + (Platform.OS === 'ios' ? 34 : 16),
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  submitButton: {
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  submitInner: {
    paddingVertical: SPACING * 2,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});