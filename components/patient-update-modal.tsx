import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PatientProfile } from '@/utils/storage';

interface PatientUpdateModalProps {
  visible: boolean;
  patient: PatientProfile | null;
  onClose: () => void;
  onUpdate: (patient: PatientProfile) => void;
}

const PatientUpdateModal: React.FC<PatientUpdateModalProps> = ({
  visible,
  patient,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (patient) {
      setFormData({ ...patient });
    }
  }, [patient]);

  const handleInputChange = (field: keyof PatientProfile, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    const requiredFields: (keyof PatientProfile)[] = [
      'nom',
      'prenom',
      'sexe',
      'numero_identification_unique',
      'type_de_drepanocytose',
    ];

    const missing = requiredFields.filter(field => {
      const value = formData[field];
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (missing.length > 0) {
      Alert.alert('Champs requis', `Veuillez remplir tous les champs obligatoires: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour les informations du patient');
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Modifier patient</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.content}>
          {/* Identification Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations d'identification</Text>
            
            <Text style={styles.label}>Nom <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.nom}
              onChangeText={(text) => handleInputChange('nom', text)}
              placeholder="Nom de famille"
            />

            <Text style={styles.label}>Prénom <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.prenom}
              onChangeText={(text) => handleInputChange('prenom', text)}
              placeholder="Prénom"
            />

            <Text style={styles.label}>Sexe <Text style={styles.required}>*</Text></Text>
            <Picker
              selectedValue={formData.sexe}
              onValueChange={(value: string) => handleInputChange('sexe', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Masculin" value="Masculin" />
              <Picker.Item label="Féminin" value="Féminin" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>

            <Text style={styles.label}>Numéro d'identification unique <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.numero_identification_unique}
              onChangeText={(text) => handleInputChange('numero_identification_unique', text)}
              placeholder="ID unique"
            />

            <Text style={styles.label}>Date de naissance</Text>
            <TextInput
              style={styles.input}
              value={formData.date_naissance || ''}
              onChangeText={(text) => {
                // Format date as DD/MM/YYYY
                const formatted = text.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})(\d{0,4}).*/, '$1/$2/$3');
                handleInputChange('date_naissance', formatted);
              }}
              placeholder="JJ/MM/AAAA"
              maxLength={10}
              keyboardType="numeric"
            />
          </View>

          {/* Medical Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations médicales</Text>
            
            <Text style={styles.label}>Type de drépanocytose <Text style={styles.required}>*</Text></Text>
            <Picker
              selectedValue={formData.type_de_drepanocytose}
              onValueChange={(value: string) => handleInputChange('type_de_drepanocytose', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="SS" value="SS" />
              <Picker.Item label="SC" value="SC" />
              <Picker.Item label="Sβ⁰" value="Sβ⁰" />
              <Picker.Item label="Sβ⁺" value="Sβ⁺" />
              <Picker.Item label="Other" value="Other" />
            </Picker>

            <Text style={styles.label}>Groupe sanguin</Text>
            <Picker
              selectedValue={formData.groupe_sanguin_rhesus || ''}
              onValueChange={(value: string) => handleInputChange('groupe_sanguin_rhesus', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
            </Picker>

            <Text style={styles.label}>Âge au diagnostic</Text>
            <Picker
              selectedValue={formData.age_diagnostic || ''}
              onValueChange={(value: string) => handleInputChange('age_diagnostic', value)}
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

            <Text style={styles.label}>Circonstances du diagnostic</Text>
            <Picker
              selectedValue={formData.circonstances_du_diagnostic || ''}
              onValueChange={(value: string) => handleInputChange('circonstances_du_diagnostic', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="Neonatal diagnosis" value="Neonatal diagnosis" />
              <Picker.Item label="Diagnosis from siblings" value="Diagnosis from siblings" />
            </Picker>

            <Text style={styles.label}>Antécédents familiaux</Text>
            <TextInput
              style={styles.input}
              value={formData.antecedent_familiaux || ''}
              onChangeText={(text) => handleInputChange('antecedent_familiaux', text)}
              placeholder="Antécédents familiaux de drépanocytose..."
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Autres antécédents médicaux</Text>
            <TextInput
              style={styles.input}
              value={formData.autres_antecedents_medicaux || ''}
              onChangeText={(text) => handleInputChange('autres_antecedents_medicaux', text)}
              placeholder="Autres antécédents médicaux..."
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Allergies connues</Text>
            <Picker
              selectedValue={formData.allergies_connues ? 'Oui' : 'Non'}
              onValueChange={(value: string) => handleInputChange('allergies_connues', value === 'Oui')}
              style={styles.picker}
            >
              <Picker.Item label="Non" value="false" />
              <Picker.Item label="Oui" value="true" />
            </Picker>

            {formData.allergies_connues && (
              <>
                <Text style={styles.label}>Détails des allergies</Text>
                <TextInput
                  style={styles.input}
                  value={formData.details_allergies || ''}
                  onChangeText={(text) => handleInputChange('details_allergies', text)}
                  placeholder="Médicaments, aliments..."
                  multiline
                  numberOfLines={3}
                />
              </>
            )}
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coordonnées</Text>
            
            <Text style={styles.label}>Téléphone du patient</Text>
            <TextInput
              style={styles.input}
              value={formData.telephone_patient || ''}
              onChangeText={(text) => handleInputChange('telephone_patient', text)}
              placeholder="Numéro de téléphone"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Quartier</Text>
            <TextInput
              style={styles.input}
              value={formData.quartier || ''}
              onChangeText={(text) => handleInputChange('quartier', text)}
              placeholder="Nom du quartier"
            />

            <Text style={styles.label}>Lieu-dit</Text>
            <TextInput
              style={styles.input}
              value={formData.lieu_dit || ''}
              onChangeText={(text) => handleInputChange('lieu_dit', text)}
              placeholder="Précision d'adresse"
            />

            <Text style={styles.label}>Région</Text>
            <TextInput
              style={styles.input}
              value={formData.region || ''}
              onChangeText={(text) => handleInputChange('region', text)}
              placeholder="Région"
            />
          </View>

          {/* Emergency Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact d'urgence</Text>
            
            <Text style={styles.label}>Nom du contact</Text>
            <TextInput
              style={styles.input}
              value={formData.contact_urgence_nom || ''}
              onChangeText={(text) => handleInputChange('contact_urgence_nom', text)}
              placeholder="Nom complet"
            />

            <Text style={styles.label}>Relation avec le patient</Text>
            <TextInput
              style={styles.input}
              value={formData.contact_urgence_relation || ''}
              onChangeText={(text) => handleInputChange('contact_urgence_relation', text)}
              placeholder="Relation"
            />

            <Text style={styles.label}>Téléphone du contact</Text>
            <TextInput
              style={styles.input}
              value={formData.contact_urgence_telephone || ''}
              onChangeText={(text) => handleInputChange('contact_urgence_telephone', text)}
              placeholder="Numéro de téléphone"
              keyboardType="phone-pad"
            />
          </View>

          {/* Emergency Contact Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Détails du contact d'urgence</Text>
            
            <Text style={styles.label}>Vit avec le patient</Text>
            <Picker
              selectedValue={formData.vit_avec_le_patient ? 'Oui' : 'Non'}
              onValueChange={(value: string) => handleInputChange('vit_avec_le_patient', value === 'Oui')}
              style={styles.picker}
            >
              <Picker.Item label="Non" value="false" />
              <Picker.Item label="Oui" value="true" />
            </Picker>
          </View>

          {/* Patient Referral Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de référencement</Text>
            
            <Text style={styles.label}>Patient référencé</Text>
            <Picker
              selectedValue={formData.patient_refere ? 'Oui' : 'Non'}
              onValueChange={(value: string) => handleInputChange('patient_refere', value === 'Oui')}
              style={styles.picker}
            >
              <Picker.Item label="Non" value="false" />
              <Picker.Item label="Oui" value="true" />
            </Picker>

            {formData.patient_refere && (
              <>
                <Text style={styles.label}>Référencé de</Text>
                <TextInput
                  style={styles.input}
                  value={formData.patient_refere_de || ''}
                  onChangeText={(text) => handleInputChange('patient_refere_de', text)}
                  placeholder="Origine du référencement"
                />

                <Text style={styles.label}>Référencé pour</Text>
                <TextInput
                  style={styles.input}
                  value={formData.patient_refere_pour || ''}
                  onChangeText={(text) => handleInputChange('patient_refere_pour', text)}
                  placeholder="Raison du référencement"
                />
              </>
            )}
          </View>

          {/* Social Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations sociales</Text>
            
            <Text style={styles.label}>Appartient à un groupe</Text>
            <Picker
              selectedValue={formData.appartient_a_groupe ? 'Oui' : 'Non'}
              onValueChange={(value: string) => handleInputChange('appartient_a_groupe', value === 'Oui')}
              style={styles.picker}
            >
              <Picker.Item label="Non" value="false" />
              <Picker.Item label="Oui" value="true" />
            </Picker>

            {formData.appartient_a_groupe && (
              <>
                <Text style={styles.label}>Nom du groupe</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nom_du_groupe || ''}
                  onChangeText={(text) => handleInputChange('nom_du_groupe', text)}
                  placeholder="Nom du groupe ou association"
                />

                <Text style={styles.label}>Rang dans la fratrie</Text>
                <TextInput
                  style={styles.input}
                  value={formData.rang_dans_fratrie?.toString() || ''}
                  onChangeText={(text) => handleInputChange('rang_dans_fratrie', parseInt(text) || 0)}
                  placeholder="1, 2, 3..."
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Nombre de drépanocytaires dans la fratrie</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre_de_drepanocytaires_dans_fratrie?.toString() || ''}
                  onChangeText={(text) => handleInputChange('nombre_de_drepanocytaires_dans_fratrie', parseInt(text) || 0)}
                  placeholder="0, 1, 2..."
                  keyboardType="numeric"
                />
              </>
            )}

            <Text style={styles.label}>Assurance</Text>
            <Picker
              selectedValue={formData.assurance || ''}
              onValueChange={(value: string) => handleInputChange('assurance', value)}
              style={styles.picker}
            >
              <Picker.Item label="--Sélectionner--" value="" />
              <Picker.Item label="CNPS" value="CNPS" />
              <Picker.Item label="CNAS" value="CNAS" />
              <Picker.Item label="Private" value="Private" />
              <Picker.Item label="None" value="None" />
              <Picker.Item label="Others" value="Others" />
            </Picker>

            {formData.assurance === 'Others' && (
              <>
                <Text style={styles.label}>Préciser l'assurance</Text>
                <TextInput
                  style={styles.input}
                  value={formData.assurance_details || ''}
                  onChangeText={(text) => handleInputChange('assurance_details', text)}
                  placeholder="Nom de l'assurance"
                />
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: 'white',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
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
    fontSize: 18,
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
    minHeight: 44,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 8,
    minHeight: 44,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PatientUpdateModal;