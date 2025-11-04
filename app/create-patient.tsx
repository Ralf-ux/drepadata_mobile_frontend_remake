import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { savePatient, type PatientProfile } from '@/utils/storage';

const CreatePatientScreen = () => {
  const router = useRouter();

  /* ---------- 12 MANDATORY FIELDS ---------- */
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

  /* ------------- handlers ------------- */
  const update = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const required: (keyof typeof formData)[] = [
      'nom',
      'prenom',
      'sexe',
      'date_diagnostic',
      'age_diagnostic',
      'circonstances_du_diagnostic',
      'type_de_drepanocytose',
      'groupe_sanguin_rhesus',
    ];
    const missing = required.filter(k => !formData[k]);
    if (missing.length) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await savePatient(formData as unknown as PatientProfile);
      Alert.alert(
        'Succès',
        'Profil patient créé avec succès',
        [
          {
            text: 'Créer la consultation initiale',
            onPress: () => router.replace(`/consultation/${formData.id}` as any),
          },
          {
            text: 'Retour à l\'accueil',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le profil');
    }
  };

  /* -------------- UI ---------------- */
  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informations d'identification</Text>

        <Label required>Nom</Label>
        <TextInput style={styles.input} value={formData.nom} onChangeText={v => update('nom', v)} placeholder="Nom de famille" />

        <Label required>Prénom</Label>
        <TextInput style={styles.input} value={formData.prenom} onChangeText={v => update('prenom', v)} placeholder="Prénom" />

        <Label required>Sexe</Label>
        <Picker selectedValue={formData.sexe} onValueChange={v => update('sexe', v)} style={styles.picker}>
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="Masculin" value="Masculin" />
          <Picker.Item label="Féminin" value="Féminin" />
        </Picker>

        <Label required>Date du diagnostic</Label>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateTxt}>
            {formData.date_diagnostic ? new Date(formData.date_diagnostic).toLocaleDateString('fr-FR') : 'Sélectionner la date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.date_diagnostic ? new Date(formData.date_diagnostic) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) update('date_diagnostic', selectedDate.toISOString());
            }}
          />
        )}

        <Label required>Âge au diagnostic</Label>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.age_diagnostic}
          onChangeText={v => update('age_diagnostic', v)}
          placeholder="ex. 3"
        />

        <Label required>Circonstances du diagnostic</Label>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.circonstances_du_diagnostic}
          onChangeText={v => update('circonstances_du_diagnostic', v)}
          placeholder="Décrire les circonstances"
        />

        <Label required>Type de drépanocytose</Label>
        <Picker selectedValue={formData.type_de_drepanocytose} onValueChange={v => update('type_de_drepanocytose', v)} style={styles.picker}>
          <Picker.Item label="--Sélectionner--" value="" />
          <Picker.Item label="SS" value="SS" />
          <Picker.Item label="SC" value="SC" />
          <Picker.Item label="Sβ⁰" value="Sβ⁰" />
          <Picker.Item label="Sβ⁺" value="Sβ⁺" />
          <Picker.Item label="Autre" value="Autre" />
        </Picker>

        <Label>Antécédents familiaux</Label>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={formData.antecedent_familiaux}
          onChangeText={v => update('antecedent_familiaux', v)}
          placeholder="Antécédents familiaux de drépanocytose"
        />

        <Label required>Groupe sanguin / Rhésus</Label>
        <Picker selectedValue={formData.groupe_sanguin_rhesus} onValueChange={v => update('groupe_sanguin_rhesus', v)} style={styles.picker}>
          <Picker.Item label="--Sélectionner--" value="" />
          {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => (
            <Picker.Item key={g} label={g} value={g} />
          ))}
        </Picker>

        <Label>Rang dans la fratrie</Label>
        <Picker selectedValue={formData.rang_dans_fratrie} onValueChange={v => update('rang_dans_fratrie', v)} style={styles.picker}>
          <Picker.Item label="--Sélectionner--" value="" />
          {[...Array(12)].map((_, i) => (
            <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
          ))}
        </Picker>

        <Label>Nombre de drépanocytaires dans la fratrie</Label>
        <Picker
          selectedValue={formData.nombre_de_drepanocytaires_dans_fratrie}
          onValueChange={v => update('nombre_de_drepanocytaires_dans_fratrie', v)}
          style={styles.picker}
        >
          <Picker.Item label="--Sélectionner--" value="" />
          {['0', '1', '2', '3', '4', '5', '6+'].map(n => (
            <Picker.Item key={n} label={n} value={n} />
          ))}
        </Picker>

        <Label>Vaccins reçus à la naissance</Label>
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
            <Text style={styles.checkTxt}>{v}</Text>
            <View style={[styles.box, formData.vaccins_naissance[v] && styles.boxChecked]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnTxt}>Créer le profil patient</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#dc3545', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8, padding: 12, fontSize: 16, color: '#495057', backgroundColor: '#fff' },
  picker: { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8, backgroundColor: '#fff' },
  dateBtn: { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  dateTxt: { fontSize: 16, color: '#495057' },
  checkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  checkTxt: { fontSize: 16, color: '#495057' },
  box: { width: 20, height: 20, borderWidth: 2, borderColor: '#ced4da', borderRadius: 4 },
  boxChecked: { backgroundColor: '#dc3545', borderColor: '#dc3545' },
  footer: { padding: 16, paddingBottom: 32 },
  submitBtn: { backgroundColor: '#dc3545', padding: 16, borderRadius: 12, alignItems: 'center' },
  submitBtnTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

const Label: React.FC<{ required?: boolean; children: string }> = ({ required, children }) => (
  <Text style={{ fontSize: 16, fontWeight: '600', color: '#495057', marginBottom: 8 }}>
    {children}
    {required && <Text style={{ color: '#dc3545' }}> *</Text>}
  </Text>
);

export default CreatePatientScreen;
