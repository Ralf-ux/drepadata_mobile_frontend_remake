import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Trash2, AlertTriangle } from 'lucide-react-native';
import { PatientProfile } from '@/utils/storage';

interface PatientDeleteModalProps {
  visible: boolean;
  patient: PatientProfile | null;
  onClose: () => void;
  onDelete: (patientId: string) => void;
  loading?: boolean;
}

const PatientDeleteModal: React.FC<PatientDeleteModalProps> = ({
  visible,
  patient,
  onClose,
  onDelete,
  loading = false,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!patient) return;
    
    if (confirmDelete) {
      try {
        await onDelete(patient.id);
        onClose();
      } catch (error) {
        console.error('Error deleting patient:', error);
        Alert.alert('Erreur', 'Impossible de supprimer le patient');
      }
    } else {
      Alert.alert(
        'Confirmation requise',
        'Veuillez cocher la case pour confirmer la suppression'
      );
    }
  };

  if (!patient) return null;

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
          <View style={styles.headerContent}>
            <Trash2 size={24} color="#dc3545" />
            <Text style={styles.title}>Supprimer patient</Text>
          </View>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.warningSection}>
            <AlertTriangle size={32} color="#dc3545" />
            <Text style={styles.warningTitle}>Attention!</Text>
            <Text style={styles.warningText}>
              Cette action va supprimer définitivement le patient "{patient.nom} {patient.prenom}" 
              (ID: {patient.numero_identification_unique}) et toutes ses données associées.
            </Text>
            <Text style={styles.warningText}>
              Cette action est irréversible et ne peut pas être annulée.
            </Text>
          </View>

          <View style={styles.patientInfo}>
            <Text style={styles.patientInfoTitle}>Informations du patient:</Text>
            <View style={styles.patientInfoRow}>
              <Text style={styles.patientInfoLabel}>Nom:</Text>
              <Text style={styles.patientInfoValue}>{patient.nom}</Text>
            </View>
            <View style={styles.patientInfoRow}>
              <Text style={styles.patientInfoLabel}>Prénom:</Text>
              <Text style={styles.patientInfoValue}>{patient.prenom}</Text>
            </View>
            <View style={styles.patientInfoRow}>
              <Text style={styles.patientInfoLabel}>ID:</Text>
              <Text style={styles.patientInfoValue}>{patient.numero_identification_unique}</Text>
            </View>
            <View style={styles.patientInfoRow}>
              <Text style={styles.patientInfoLabel}>Type de drépanocytose:</Text>
              <Text style={styles.patientInfoValue}>{patient.type_de_drepanocytose}</Text>
            </View>
          </View>

          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationText}>
              Pour confirmer la suppression, veuillez cocher la case ci-dessous:
            </Text>
            <TouchableOpacity
              style={[styles.confirmationCheckbox, confirmDelete && styles.confirmationCheckboxChecked]}
              onPress={() => setConfirmDelete(!confirmDelete)}
              disabled={loading}
            >
              {confirmDelete && (
                <Text style={styles.confirmationCheckmark}>✓</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.confirmationLabel}>
              Je confirme que je veux supprimer définitivement ce patient
            </Text>
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
            style={[styles.button, styles.deleteButton, loading && styles.deleteButtonDisabled]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Suppression...' : 'Supprimer le patient'}
            </Text>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    padding: 16,
  },
  warningSection: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginTop: 8,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 16,
    color: '#856404',
    lineHeight: 24,
    marginBottom: 8,
  },
  patientInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  patientInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 12,
  },
  patientInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  patientInfoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  patientInfoValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#495057',
    textAlign: 'right',
  },
  confirmationSection: {
    backgroundColor: '#f8d7da',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
  },
  confirmationText: {
    fontSize: 16,
    color: '#721c24',
    lineHeight: 24,
    marginBottom: 16,
  },
  confirmationCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#dc3545',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmationCheckboxChecked: {
    backgroundColor: '#dc3545',
  },
  confirmationCheckmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmationLabel: {
    fontSize: 14,
    color: '#721c24',
    fontWeight: '600',
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
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  deleteButtonDisabled: {
    backgroundColor: '#dc354580',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PatientDeleteModal;