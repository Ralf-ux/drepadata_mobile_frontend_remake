import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  Stethoscope,
  Activity,
  Heart,
  FileText,
  CheckCircle,
} from 'lucide-react-native';
import { getPatientById } from '@/utils/storage';
import { createConsultation } from '@/api/users';

// Types for consultation data based on backend schema
interface ConsultationFormData {
  patient: string;
  createdBy: string;
  administrativeInfo: {
    fosa: string;
    fosaOther?: string;
    personnel: string;
    weight?: number;
    height?: number;
    region: string;
    district: string;
    dateOfDiagnosis: string;
    ipp?: string;
    medicalPersonnel?: string;
    referredPatient: {
      isReferred: boolean;
      referredFrom?: string;
      referredFromOther?: string;
      referredFor?: string;
    };
  };
  demographicData: {
    lastName: string;
    firstName: string;
    age?: number;
    dateOfBirth?: string;
    sex: string;
    relationshipWithPatient?: string;
    neighborhood?: string;
    locality?: string;
    emergencyContact: {
      name?: string;
      relationship?: string;
      phone?: string;
    };
    patientPhone?: string;
    livesWithPatient?: boolean;
    belongsToGroup?: boolean;
    groupName?: string;
    birthOrderInSiblings?: number;
    numberOfSickleCellInFamily?: number;
    insurance?: string;
    insuranceDetails?: string;
  };
  medicalHistory: {
    typeOfSickleCell: string;
    ageAtDiagnosis?: string;
    circumstancesOfDiagnosis?: string;
    vocLast3Months?: string;
    familyHistory?: string;
    otherMedicalHistory?: string[];
    previousSurgicalInterventions: {
      hasInterventions: boolean;
      dateOfLastIntervention?: string;
      cause?: string;
    };
    folicAcid: boolean;
    knownAllergies: {
      hasAllergies: boolean;
      details?: string;
    };
  };
  complicationHistory: {
    vocLast3Months?: string;
    hospitalizationsLast3Months?: string;
    mainCauseOfHospitalization?: string;
    longestHospitalization?: number;
    recentHemoglobinLevel?: number;
    recentHbFLevel?: number;
    recentHbSLevel?: number;
    transfusionReaction?: boolean;
    acuteChestSyndrome?: boolean;
    stroke?: boolean;
    priapism?: string;
    legUlcers?: boolean;
  };
  currentTreatments: {
    hydroxyurea: {
      isTaking: boolean;
      tolerance?: string;
      dosage?: number;
      reasonsNotTaking?: string[];
    };
    adherence3Months: {
      month1: boolean;
      month2: boolean;
      month3: boolean;
    };
    folicAcid: boolean;
    antibioticProphylaxis: boolean;
    regularTransfusion: {
      isRegular: boolean;
      type?: string;
      frequency3Months?: string;
      lastTransfusion?: string;
    };
    specificTreatments?: string;
  };
  complementaryExaminations: {
    cbc: {
      wbc?: number;
      hb?: number;
      platelets?: number;
    };
    reticulocytes?: number;
    microalbuminuria?: string;
    hemolysisMarkers?: string;
    bloodGroup?: string;
    medicalImaging?: string[];
    ophthalmology?: string;
    specializedConsultations?: string[];
    todaysExamination?: string;
  };
  psychosocialImpact: {
    schoolProfessionalImpact?: string;
    participationInEducationalTalks?: boolean;
    psychologicalFollowUp?: boolean;
    therapeuticEducation?: boolean;
    homeVisit?: boolean;
    socialSupport: {
      hasSupport: boolean;
      socialConsultation?: boolean;
      freeConsultation?: boolean;
      freeMedication?: boolean;
      freeSchoolEnrollment?: boolean;
      reducedTransportationCosts?: boolean;
    };
    specialAccompaniment?: string[];
    familyInformed?: string;
    personalizedFollowUpPlan?: boolean;
    dateOfNextConsultation?: string;
  };
  followUpPlan: {
    testsBeforeNextConsultation?: { testName?: string }[];
    progressSinceLastConsultation?: string;
    therapeuticEducation?: string;
    expectedDateOfNextConsultation?: string;
  };
  comments: {
    generalComments?: string;
    consultationSummary?: {
      patient?: string;
      age?: number;
      typeOfSickleCell?: string;
      facility?: string;
      hydroxyurea?: boolean;
      personnel?: string;
      weight?: number;
      height?: number;
    };
  };
}

const CONSULTATION_STEPS = [
  'Informations administratives',
  'Données démographiques',
  'Antécédents médicaux',
  'Historique des complications',
  'Traitements actuels',
  'Examens complémentaires',
  'Impact psychosocial',
  'Plan de suivi',
  'Résumé et commentaires',
];

const CreateConsultationScreen = () => {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [patient, setPatient] = useState<any>(null);
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePickerField, setDatePickerField] = useState<string>('');
  const [formData, setFormData] = useState<ConsultationFormData>({
    patient: patientId || '',
    createdBy: 'current_user_id', // This should be replaced with actual user ID
    administrativeInfo: {
      fosa: '',
      personnel: '',
      region: '',
      district: '',
      dateOfDiagnosis: new Date().toISOString().split('T')[0],
      referredPatient: {
        isReferred: false,
      },
    },
    demographicData: {
      lastName: '',
      firstName: '',
      sex: 'Male',
      emergencyContact: {},
    },
    medicalHistory: {
      typeOfSickleCell: '',
      previousSurgicalInterventions: {
        hasInterventions: false,
      },
      folicAcid: false,
      knownAllergies: {
        hasAllergies: false,
      },
    },
    complicationHistory: {},
    currentTreatments: {
      hydroxyurea: {
        isTaking: false,
      },
      adherence3Months: {
        month1: false,
        month2: false,
        month3: false,
      },
      folicAcid: false,
      antibioticProphylaxis: false,
      regularTransfusion: {
        isRegular: false,
      },
    },
    complementaryExaminations: {
      cbc: {},
    },
    psychosocialImpact: {
      socialSupport: {
        hasSupport: false,
      },
    },
    followUpPlan: {
      testsBeforeNextConsultation: [],
    },
    comments: {},
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      const patientData = await getPatientById(patientId);
      setPatient(patientData);
      if (patientData) {
        // Pre-fill some demographic data from patient record
        setFormData(prev => ({
          ...prev,
          demographicData: {
            ...prev.demographicData,
            lastName: patientData.nom || '',
            firstName: patientData.prenom || '',
            sex: patientData.sexe || 'Male',
          },
          administrativeInfo: {
            ...prev.administrativeInfo,
            region: patientData.region || '',
          },
        }));
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données du patient');
    }
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    updateDateField(datePickerField, date);
    setShowDatePicker(false);
  };

  const updateDateField = (field: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    switch (field) {
      case 'dateOfDiagnosis':
        updateFormData(0, { administrativeInfo: { ...formData.administrativeInfo, dateOfDiagnosis: dateStr } });
        break;
      case 'dateOfBirth':
        updateFormData(1, { demographicData: { ...formData.demographicData, dateOfBirth: dateStr } });
        break;
      case 'dateOfLastIntervention':
        updateFormData(2, { medicalHistory: { ...formData.medicalHistory, previousSurgicalInterventions: { ...formData.medicalHistory.previousSurgicalInterventions, dateOfLastIntervention: dateStr } } });
        break;
      case 'lastTransfusion':
        updateFormData(4, { currentTreatments: { ...formData.currentTreatments, regularTransfusion: { ...formData.currentTreatments.regularTransfusion, lastTransfusion: dateStr } } });
        break;
      case 'dateOfNextConsultation':
        updateFormData(6, { psychosocialImpact: { ...formData.psychosocialImpact, dateOfNextConsultation: dateStr } });
        break;
      case 'expectedDateOfNextConsultation':
        updateFormData(7, { followUpPlan: { ...formData.followUpPlan, expectedDateOfNextConsultation: dateStr } });
        break;
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Sélectionner la date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const updateFormData = (step: number, data: Partial<ConsultationFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting consultation data:', formData);
      await createConsultation(formData);
      Alert.alert('Succès', 'La consultation a été créée avec succès!');
      router.replace(`/consultation/${patientId}` as any);
    } catch (error) {
      console.error('Error creating consultation:', error);
      Alert.alert('Erreur', 'Impossible de créer la consultation');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AdministrativeInfoStep
            data={formData.administrativeInfo}
            onUpdate={(data) => updateFormData(0, { administrativeInfo: data })}
          />
        );
      case 1:
        return (
          <DemographicDataStep
            data={formData.demographicData}
            onUpdate={(data) => updateFormData(1, { demographicData: data })}
            patient={patient}
          />
        );
      case 2:
        return (
          <MedicalHistoryStep
            data={formData.medicalHistory}
            onUpdate={(data) => updateFormData(2, { medicalHistory: data })}
          />
        );
      case 3:
        return (
          <ComplicationHistoryStep
            data={formData.complicationHistory}
            onUpdate={(data) => updateFormData(3, { complicationHistory: data })}
          />
        );
      case 4:
        return (
          <CurrentTreatmentsStep
            data={formData.currentTreatments}
            onUpdate={(data) => updateFormData(4, { currentTreatments: data })}
          />
        );
      case 5:
        return (
          <ComplementaryExaminationsStep
            data={formData.complementaryExaminations}
            onUpdate={(data) => updateFormData(5, { complementaryExaminations: data })}
          />
        );
      case 6:
        return (
          <PsychosocialImpactStep
            data={formData.psychosocialImpact}
            onUpdate={(data) => updateFormData(6, { psychosocialImpact: data })}
          />
        );
      case 7:
        return (
          <FollowUpPlanStep
            data={formData.followUpPlan}
            onUpdate={(data) => updateFormData(7, { followUpPlan: data })}
          />
        );
      case 8:
        return (
          <CommentsStep
            data={formData.comments}
            onUpdate={(data) => updateFormData(8, { comments: data })}
            onPreview={() => setShowPreview(true)}
          />
        );
      default:
        return null;
    }
  };

  if (showPreview) {
    return (
      <ConsultationPreview
        formData={formData}
        onEdit={() => setShowPreview(false)}
        onSubmit={handleSubmit}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle consultation</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            Étape {currentStep + 1} sur {CONSULTATION_STEPS.length}
          </Text>
          <Text style={styles.stepName}>{CONSULTATION_STEPS[currentStep]}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          <Text style={styles.secondaryButtonText}>Précédent</Text>
        </TouchableOpacity>
        {currentStep < CONSULTATION_STEPS.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => {
              if (currentStep === CONSULTATION_STEPS.length - 2) {
                setShowPreview(true);
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
          >
            <Text style={styles.primaryButtonText}>
              {currentStep === CONSULTATION_STEPS.length - 2 ? 'Aperçu' : 'Suivant'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.successButton]} onPress={handleSubmit}>
            <Text style={styles.successButtonText}>Créer consultation</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Step Components
const AdministrativeInfoStep = ({ data, onUpdate }: any) => {
  const [formData, setFormData] = useState(data);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePickerField, setDatePickerField] = useState('');

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Sélectionner la date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    updateField('dateOfDiagnosis', dateStr);
    setShowDatePicker(false);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const updated = {
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Informations administratives</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Fosa *</Text>
        <Picker
          selectedValue={formData.fosa}
          onValueChange={(value) => updateField('fosa', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner une FOSA" value="" />
          <Picker.Item label="Centre Hospitalier Nicolas Barre" value="Centre Hospitalier Nicolas Barre" />
          <Picker.Item label="Centre Hospitalier d'Essos" value="Centre Hospitalier d'Essos" />
          <Picker.Item label="Hôpital de District de la Cite Verte" value="Hôpital de District de la Cite Verte" />
          <Picker.Item label="Hôpital Gynéco-Obstétrique et pédiatrique de Yaoundé" value="Hôpital Gynéco-Obstétrique et pédiatrique de Yaoundé" />
          <Picker.Item label="Hôpital Monseigneur Jean Zoa de Nkoldongo" value="Hôpital Monseigneur Jean Zoa de Nkoldongo" />
          <Picker.Item label="Hôpital Catholique Sainte Marie des Anges de Nkoabang" value="Hôpital Catholique Sainte Marie des Anges de Nkoabang" />
          <Picker.Item label="Hôpital Laquintinie de Douala" value="Hôpital Laquintinie de Douala" />
          <Picker.Item label="Hôpital Catholique Albert Legrand de Bonaberi" value="Hôpital Catholique Albert Legrand de Bonaberi" />
          <Picker.Item label="Fondation Padre Pio" value="Fondation Padre Pio" />
          <Picker.Item label="Hôpital Ad Lucem de Bonamousadi" value="Hôpital Ad Lucem de Bonamousadi" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
        {formData.fosa === 'Others' && (
          <TextInput
            style={styles.input}
            placeholder="Autre FOSA"
            value={formData.fosaOther || ''}
            onChangeText={(text) => updateField('fosaOther', text)}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Personnel *</Text>
        <Picker
          selectedValue={formData.personnel}
          onValueChange={(value) => updateField('personnel', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner le personnel" value="" />
          <Picker.Item label="Doctor" value="Doctor" />
          <Picker.Item label="Nurse" value="Nurse" />
          <Picker.Item label="APS" value="APS" />
          <Picker.Item label="Laboratory Technician" value="Laboratory Technician" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      <View style={styles.row}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Poids (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.weight?.toString() || ''}
            onChangeText={(text) => updateField('weight', text ? parseFloat(text) : undefined)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Taille (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.height?.toString() || ''}
            onChangeText={(text) => updateField('height', text ? parseFloat(text) : undefined)}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Région *</Text>
        <Picker
          selectedValue={formData.region}
          onValueChange={(value) => updateField('region', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner une région" value="" />
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
        <Text style={styles.label}>District *</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le district"
          value={formData.district || ''}
          onChangeText={(text) => updateField('district', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date du diagnostic *</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
            setDatePickerField('dateOfDiagnosis');
            setShowDatePicker(true);
            setSelectedDate(formData.dateOfDiagnosis ? new Date(formData.dateOfDiagnosis) : new Date());
          }}
        >
          <Text style={styles.dateInputText}>{formatDate(formData.dateOfDiagnosis)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>IPP</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'IPP"
          value={formData.ipp || ''}
          onChangeText={(text) => updateField('ipp', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Personnel médical</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le nom du personnel médical"
          value={formData.medicalPersonnel || ''}
          onChangeText={(text) => updateField('medicalPersonnel', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Patient référée</Text>
        <Switch
          value={formData.referredPatient.isReferred}
          onValueChange={(value) => updateNestedField('referredPatient', 'isReferred', value)}
        />
      </View>

      {formData.referredPatient.isReferred && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Référé de</Text>
            <Picker
              selectedValue={formData.referredPatient.referredFrom}
              onValueChange={(value) => updateNestedField('referredPatient', 'referredFrom', value)}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner" value="" />
              <Picker.Item label="District Hospital" value="District Hospital" />
              <Picker.Item label="Health Center" value="Health Center" />
              <Picker.Item label="Private Doctor" value="Private Doctor" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
            {formData.referredPatient.referredFrom === 'Others' && (
              <TextInput
                style={styles.input}
                placeholder="Autre"
                value={formData.referredPatient.referredFromOther || ''}
                onChangeText={(text) => updateNestedField('referredPatient', 'referredFromOther', text)}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Référé pour</Text>
            <Picker
              selectedValue={formData.referredPatient.referredFor}
              onValueChange={(value) => updateNestedField('referredPatient', 'referredFor', value)}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner" value="" />
              <Picker.Item label="Better care" value="Better care" />
              <Picker.Item label="Quarterly follow-up" value="Quarterly follow-up" />
              <Picker.Item label="Emergency" value="Emergency" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </View>
        </>
      )}
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              handleDateConfirm(date);
            }
          }}
        />
      )}
    </View>
  );
};

const DemographicDataStep = ({ data, onUpdate, patient }: any) => {
  const [formData, setFormData] = useState(data);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePickerField, setDatePickerField] = useState('');

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Sélectionner la date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    updateField('dateOfBirth', dateStr);
    setShowDatePicker(false);
  };

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const updated = {
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <>
      <View style={styles.stepContainer}>
        <Text style={styles.sectionTitle}>Données démographiques</Text>
        
        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom de famille *</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le nom"
              value={formData.lastName || ''}
              onChangeText={(text) => updateField('lastName', text)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Prénoms *</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez les prénoms"
              value={formData.firstName || ''}
              onChangeText={(text) => updateField('firstName', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Âge</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.age?.toString() || ''}
              onChangeText={(text) => updateField('age', text ? parseInt(text) : undefined)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Sexe *</Text>
            <Picker
              selectedValue={formData.sex}
              onValueChange={(value) => updateField('sex', value)}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date de naissance</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setDatePickerField('dateOfBirth');
              setShowDatePicker(true);
              setSelectedDate(formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date());
            }}
          >
            <Text style={styles.dateInputText}>{formatDate(formData.dateOfBirth)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Lien avec le patient</Text>
          <Picker
            selectedValue={formData.relationshipWithPatient}
            onValueChange={(value) => updateField('relationshipWithPatient', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
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

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Quartier</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le quartier"
              value={formData.neighborhood || ''}
              onChangeText={(text) => updateField('neighborhood', text)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Localité</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez la localité"
              value={formData.locality || ''}
              onChangeText={(text) => updateField('locality', text)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Téléphone du patient</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le téléphone"
            value={formData.patientPhone || ''}
            onChangeText={(text) => updateField('patientPhone', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact d'urgence - Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le nom"
            value={formData.emergencyContact.name || ''}
            onChangeText={(text) => updateNestedField('emergencyContact', 'name', text)}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Lien</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le lien"
              value={formData.emergencyContact.relationship || ''}
              onChangeText={(text) => updateNestedField('emergencyContact', 'relationship', text)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le téléphone"
              value={formData.emergencyContact.phone || ''}
              onChangeText={(text) => updateNestedField('emergencyContact', 'phone', text)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Vit avec le patient</Text>
          <Switch
            value={formData.livesWithPatient || false}
            onValueChange={(value) => updateField('livesWithPatient', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Appartient à un groupe</Text>
          <Switch
            value={formData.belongsToGroup || false}
            onValueChange={(value) => updateField('belongsToGroup', value)}
          />
        </View>

        {formData.belongsToGroup && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom du groupe</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le nom du groupe"
              value={formData.groupName || ''}
              onChangeText={(text) => updateField('groupName', text)}
            />
          </View>
        )}

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ordre de naissance</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.birthOrderInSiblings?.toString() || ''}
              onChangeText={(text) => updateField('birthOrderInSiblings', text ? parseInt(text) : undefined)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Drépanocytaires dans la famille</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.numberOfSickleCellInFamily?.toString() || ''}
              onChangeText={(text) => updateField('numberOfSickleCellInFamily', text ? parseInt(text) : undefined)}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Assurance</Text>
          <Picker
            selectedValue={formData.insurance}
            onValueChange={(value) => updateField('insurance', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="CNPS" value="CNPS" />
            <Picker.Item label="CNAS" value="CNAS" />
            <Picker.Item label="Private" value="Private" />
            <Picker.Item label="None" value="None" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
        </View>

        {formData.insurance === 'Others' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Détails de l'assurance</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez les détails"
              value={formData.insuranceDetails || ''}
              onChangeText={(text) => updateField('insuranceDetails', text)}
            />
          </View>
        )}
      </View>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              handleDateConfirm(date);
            }
          }}
        />
      )}
    </>
  );
};

const MedicalHistoryStep = ({ data, onUpdate }: any) => {
  const [formData, setFormData] = useState(data);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePickerField, setDatePickerField] = useState('');

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Sélectionner la date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    switch (datePickerField) {
      case 'dateOfLastIntervention':
        updateNestedField('previousSurgicalInterventions', 'dateOfLastIntervention', dateStr);
        break;
    }
    setShowDatePicker(false);
  };

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const updated = {
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const toggleMedicalHistory = (item: string) => {
    const current = formData.otherMedicalHistory || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField('otherMedicalHistory', updated);
  };

  const toggleReasonNotTaking = (item: string) => {
    const current = formData.hydroxyurea.reasonsNotTaking || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateNestedField('hydroxyurea', 'reasonsNotTaking', updated);
  };

  return (
    <>
      <View style={styles.stepContainer}>
        <Text style={styles.sectionTitle}>Antécédents médicaux</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Type de drépanocytose *</Text>
          <Picker
            selectedValue={formData.typeOfSickleCell}
            onValueChange={(value) => updateField('typeOfSickleCell', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="SS" value="SS" />
            <Picker.Item label="SC" value="SC" />
            <Picker.Item label="Sβ⁰" value="Sβ⁰" />
            <Picker.Item label="Sβ⁺" value="Sβ⁺" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Âge au diagnostic</Text>
          <Picker
            selectedValue={formData.ageAtDiagnosis}
            onValueChange={(value) => updateField('ageAtDiagnosis', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="At birth" value="At birth" />
            <Picker.Item label="0-3 months" value="0-3 months" />
            <Picker.Item label="4-6 months" value="4-6 months" />
            <Picker.Item label="7-12 months" value="7-12 months" />
            <Picker.Item label="2-3 years" value="2-3 years" />
            <Picker.Item label="4-5 years" value="4-5 years" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Circonstances du diagnostic</Text>
          <Picker
            selectedValue={formData.circumstancesOfDiagnosis}
            onValueChange={(value) => updateField('circumstancesOfDiagnosis', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="Neonatal diagnosis" value="Neonatal diagnosis" />
            <Picker.Item label="Diagnosis from siblings" value="Diagnosis from siblings" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>VOC (Crises vaso-occlusives) - 3 derniers mois</Text>
          <Picker
            selectedValue={formData.vocLast3Months}
            onValueChange={(value) => updateField('vocLast3Months', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="None" value="None" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="1-2" value="1-2" />
            <Picker.Item label="3-5" value="3-5" />
            <Picker.Item label="More than 5" value="More than 5" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Antécédents familiaux</Text>
          <Picker
            selectedValue={formData.familyHistory}
            onValueChange={(value) => updateField('familyHistory', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
            <Picker.Item label="Unknown" value="Unknown" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Autres antécédents médicaux</Text>
          <View style={styles.checkboxGroup}>
            {['Nephropathy', 'Cardiopathy', 'Meningitis', 'Others', 'None'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.checkbox, (formData.otherMedicalHistory || []).includes(item) && styles.checkboxSelected]}
                onPress={() => toggleMedicalHistory(item)}
              >
                <Text style={styles.checkboxText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Interventions chirurgicales antérieures</Text>
          <Switch
            value={formData.previousSurgicalInterventions.hasInterventions}
            onValueChange={(value) => updateNestedField('previousSurgicalInterventions', 'hasInterventions', value)}
          />
        </View>

        {formData.previousSurgicalInterventions.hasInterventions && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date de la dernière intervention</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  setDatePickerField('dateOfLastIntervention');
                  setShowDatePicker(true);
                  setSelectedDate(formData.previousSurgicalInterventions.dateOfLastIntervention ? new Date(formData.previousSurgicalInterventions.dateOfLastIntervention) : new Date());
                }}
              >
                <Text style={styles.dateInputText}>{formatDate(formData.previousSurgicalInterventions.dateOfLastIntervention)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cause</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez la cause"
                value={formData.previousSurgicalInterventions.cause || ''}
                onChangeText={(text) => updateNestedField('previousSurgicalInterventions', 'cause', text)}
              />
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Acide folique</Text>
          <Switch
            value={formData.folicAcid}
            onValueChange={(value) => updateField('folicAcid', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Allergies connues</Text>
          <Switch
            value={formData.knownAllergies.hasAllergies}
            onValueChange={(value) => updateNestedField('knownAllergies', 'hasAllergies', value)}
          />
        </View>

        {formData.knownAllergies.hasAllergies && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Détails des allergies</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez les détails des allergies"
              value={formData.knownAllergies.details || ''}
              onChangeText={(text) => updateNestedField('knownAllergies', 'details', text)}
            />
          </View>
        )}
      </View>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              handleDateConfirm(date);
            }
          }}
        />
      )}
    </>
  );
};

// Complication History Step
const ComplicationHistoryStep = ({ data, onUpdate }: any) => {
  const [formData, setFormData] = useState(data);

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const updated = {
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Historique des complications</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>VOC (Crises vaso-occlusives) - 3 derniers mois</Text>
        <Picker
          selectedValue={formData.vocLast3Months}
          onValueChange={(value) => updateField('vocLast3Months', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner" value="" />
          <Picker.Item label="None" value="None" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="1-2" value="1-2" />
          <Picker.Item label="3-5" value="3-5" />
          <Picker.Item label="More than 5" value="More than 5" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Hospitalisations - 3 derniers mois</Text>
        <Picker
          selectedValue={formData.hospitalizationsLast3Months}
          onValueChange={(value) => updateField('hospitalizationsLast3Months', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner" value="" />
          <Picker.Item label="None" value="None" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="More than 3" value="More than 3" />
        </Picker>
      </View>

      {formData.hospitalizationsLast3Months && formData.hospitalizationsLast3Months !== 'None' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Cause principale d'hospitalisation</Text>
          <Picker
            selectedValue={formData.mainCauseOfHospitalization}
            onValueChange={(value) => updateField('mainCauseOfHospitalization', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="VOC" value="VOC" />
            <Picker.Item label="Anémie sévère" value="Anémie sévère" />
            <Picker.Item label="Infection" value="Infection" />
            <Picker.Item label="Autre" value="Autre" />
          </Picker>
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Durée maximale d'hospitalisation (jours)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.longestHospitalization?.toString() || ''}
          onChangeText={(text) => updateField('longestHospitalization', text ? parseInt(text) : undefined)}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hémoglobine récente (g/dL)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.recentHemoglobinLevel?.toString() || ''}
            onChangeText={(text) => updateField('recentHemoglobinLevel', text ? parseFloat(text) : undefined)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>HbF récente (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.recentHbFLevel?.toString() || ''}
            onChangeText={(text) => updateField('recentHbFLevel', text ? parseFloat(text) : undefined)}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>HbS récente (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.recentHbSLevel?.toString() || ''}
            onChangeText={(text) => updateField('recentHbSLevel', text ? parseFloat(text) : undefined)}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Réaction à la transfusion</Text>
        <Switch
          value={formData.transfusionReaction || false}
          onValueChange={(value) => updateField('transfusionReaction', value)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Syndrome thoracique aigu</Text>
        <Switch
          value={formData.acuteChestSyndrome || false}
          onValueChange={(value) => updateField('acuteChestSyndrome', value)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Accident vasculaire cérébral</Text>
        <Switch
          value={formData.stroke || false}
          onValueChange={(value) => updateField('stroke', value)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Priapisme</Text>
        <Picker
          selectedValue={formData.priapism}
          onValueChange={(value) => updateField('priapism', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner" value="" />
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Occasional" value="Occasional" />
          <Picker.Item label="Frequent" value="Frequent" />
          <Picker.Item label="Chronic" value="Chronic" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ulcères de jambe</Text>
        <Switch
          value={formData.legUlcers || false}
          onValueChange={(value) => updateField('legUlcers', value)}
        />
      </View>
    </View>
  );
};

// Current Treatments Step
const CurrentTreatmentsStep = ({ data, onUpdate }: any) => {
  const [formData, setFormData] = useState(data);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePickerField, setDatePickerField] = useState('');

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Sélectionner la date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    switch (datePickerField) {
      case 'lastTransfusion':
        updateNestedField('regularTransfusion', 'lastTransfusion', dateStr);
        break;
    }
    setShowDatePicker(false);
  };

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const updated = {
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const toggleReasonNotTaking = (item: string) => {
    const current = formData.hydroxyurea.reasonsNotTaking || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateNestedField('hydroxyurea', 'reasonsNotTaking', updated);
  };

  return (
    <>
      <View style={styles.stepContainer}>
        <Text style={styles.sectionTitle}>Traitements actuels</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hydroxyurée</Text>
          <Switch
            value={formData.hydroxyurea.isTaking}
            onValueChange={(value) => updateNestedField('hydroxyurea', 'isTaking', value)}
          />
        </View>

        {formData.hydroxyurea.isTaking && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tolérance</Text>
              <Picker
                selectedValue={formData.hydroxyurea.tolerance}
                onValueChange={(value) => updateNestedField('hydroxyurea', 'tolerance', value)}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionner" value="" />
                <Picker.Item label="Bien toléré" value="Bien toléré" />
                <Picker.Item label="Modérément toléré" value="Modérément toléré" />
                <Picker.Item label="Mal toléré" value="Mal toléré" />
                <Picker.Item label="Très mal toléré" value="Très mal toléré" />
              </Picker>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Dosage (mg/jour)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.hydroxyurea.dosage?.toString() || ''}
                onChangeText={(text) => updateNestedField('hydroxyurea', 'dosage', text ? parseInt(text) : undefined)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Raisons de ne pas prendre</Text>
              <View style={styles.checkboxGroup}>
                {[`Effets secondaires`, `Coût`, `Manque d'accès`, `Autres`].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.checkbox, (formData.hydroxyurea.reasonsNotTaking || []).includes(item) && styles.checkboxSelected]}
                    onPress={() => toggleReasonNotTaking(item)}
                  >
                    <Text style={styles.checkboxText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Acide folique</Text>
          <Switch
            value={formData.folicAcid}
            onValueChange={(value) => updateField('folicAcid', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prophylaxie antibiotique</Text>
          <Switch
            value={formData.antibioticProphylaxis}
            onValueChange={(value) => updateField('antibioticProphylaxis', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Transfusion régulière</Text>
          <Switch
            value={formData.regularTransfusion.isRegular}
            onValueChange={(value) => updateNestedField('regularTransfusion', 'isRegular', value)}
          />
        </View>

        {formData.regularTransfusion.isRegular && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Type de transfusion</Text>
              <Picker
                selectedValue={formData.regularTransfusion.type}
                onValueChange={(value) => updateNestedField('regularTransfusion', 'type', value)}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionner" value="" />
                <Picker.Item label="Échange" value="Échange" />
                <Picker.Item label="Simple" value="Simple" />
                <Picker.Item label="Prophylactique" value="Prophylactique" />
              </Picker>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Fréquence (3 derniers mois)</Text>
              <Picker
                selectedValue={formData.regularTransfusion.frequency3Months}
                onValueChange={(value) => updateNestedField('regularTransfusion', 'frequency3Months', value)}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionner" value="" />
                <Picker.Item label="Aucune" value="Aucune" />
                <Picker.Item label="1 fois" value="1 fois" />
                <Picker.Item label="2 fois" value="2 fois" />
                <Picker.Item label="3 fois" value="3 fois" />
                <Picker.Item label="Plus de 3 fois" value="Plus de 3 fois" />
              </Picker>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Dernière transfusion</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  setDatePickerField('lastTransfusion');
                  setShowDatePicker(true);
                  setSelectedDate(formData.regularTransfusion.lastTransfusion ? new Date(formData.regularTransfusion.lastTransfusion) : new Date());
                }}
              >
                <Text style={styles.dateInputText}>{formatDate(formData.regularTransfusion.lastTransfusion)}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Traitements spécifiques</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez les traitements spécifiques"
            value={formData.specificTreatments || ''}
            onChangeText={(text) => updateField('specificTreatments', text)}
          />
        </View>
      </View>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              handleDateConfirm(date);
            }
          }}
        />
      )}
    </>
  );
};

// Complementary Examinations Step
const ComplementaryExaminationsStep = ({ data, onUpdate }: any) => {
  const [formData, setFormData] = useState(data);

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const updated = {
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Examens complémentaires</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Numération formule sanguine (NFS)</Text>
        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Leucocytes</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.cbc.wbc?.toString() || ''}
              onChangeText={(text) => updateNestedField('cbc', 'wbc', text ? parseFloat(text) : undefined)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Hémoglobine</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.cbc.hb?.toString() || ''}
              onChangeText={(text) => updateNestedField('cbc', 'hb', text ? parseFloat(text) : undefined)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Plaquettes</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.cbc.platelets?.toString() || ''}
              onChangeText={(text) => updateNestedField('cbc', 'platelets', text ? parseFloat(text) : undefined)}
            />
          </View>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Réticulocytes</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.reticulocytes?.toString() || ''}
          onChangeText={(text) => updateField('reticulocytes', text ? parseFloat(text) : undefined)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Microalbuminurie</Text>
        <Picker
          selectedValue={formData.microalbuminuria}
          onValueChange={(value) => updateField('microalbuminuria', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner" value="" />
          <Picker.Item label="Négative" value="Négative" />
          <Picker.Item label="Faiblement positive" value="Faiblement positive" />
          <Picker.Item label="Modérément positive" value="Modérément positive" />
          <Picker.Item label="Fortement positive" value="Fortement positive" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Marqueurs d'hémolyse</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez les marqueurs d'hémolyse"
          value={formData.hemolysisMarkers || ''}
          onChangeText={(text) => updateField('hemolysisMarkers', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Groupe sanguin</Text>
        <Picker
          selectedValue={formData.bloodGroup}
          onValueChange={(value) => updateField('bloodGroup', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner" value="" />
          <Picker.Item label="O+" value="O+" />
          <Picker.Item label="O-" value="O-" />
          <Picker.Item label="A+" value="A+" />
          <Picker.Item label="A-" value="A-" />
          <Picker.Item label="B+" value="B+" />
          <Picker.Item label="B-" value="B-" />
          <Picker.Item label="AB+" value="AB+" />
          <Picker.Item label="AB-" value="AB-" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Imagerie médicale</Text>
        <View style={styles.checkboxGroup}>
          {['Radiographie thoracique', 'Échocardiographie', 'IRM cérébrale', 'Échographie abdominale', 'Autres'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.checkbox, (formData.medicalImaging || []).includes(item) && styles.checkboxSelected]}
              onPress={() => {
                const current = formData.medicalImaging || [];
                const updated = current.includes(item)
                  ? current.filter(i => i !== item)
                  : [...current, item];
                updateField('medicalImaging', updated);
              }}
            >
              <Text style={styles.checkboxText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ophtalmologie</Text>
        <Picker
          selectedValue={formData.ophthalmology}
          onValueChange={(value) => updateField('ophthalmology', value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner" value="" />
          <Picker.Item label="Normal" value="Normal" />
          <Picker.Item label="Rétinopathie" value="Rétinopathie" />
          <Picker.Item label="Autres anomalies" value="Autres anomalies" />
          <Picker.Item label="Non examiné" value="Non examiné" />
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Consultations spécialisées</Text>
        <View style={styles.checkboxGroup}>
          {['Néphrologue', 'Cardiologue', 'Neurologue', 'Ophtalmologiste', 'Pédiatre', 'Autres'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.checkbox, (formData.specializedConsultations || []).includes(item) && styles.checkboxSelected]}
              onPress={() => {
                const current = formData.specializedConsultations || [];
                const updated = current.includes(item)
                  ? current.filter(i => i !== item)
                  : [...current, item];
                updateField('specializedConsultations', updated);
              }}
            >
              <Text style={styles.checkboxText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Examen du jour</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez les résultats de l'examen du jour"
          value={formData.todaysExamination || ''}
          onChangeText={(text) => updateField('todaysExamination', text)}
        />
      </View>
    </View>
  );
};

// Psychosocial Impact Step
const PsychosocialImpactStep = ({ data, onUpdate }: any) => {
  const [formData, setFormData] = useState(data);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePickerField, setDatePickerField] = useState('');

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Sélectionner la date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    updateField('dateOfNextConsultation', dateStr);
    setShowDatePicker(false);
  };

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const updated = {
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <>
      <View style={styles.stepContainer}>
        <Text style={styles.sectionTitle}>Impact psychosocial</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Impact scolaire/professionnel</Text>
          <Picker
            selectedValue={formData.schoolProfessionalImpact}
            onValueChange={(value) => updateField('schoolProfessionalImpact', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="Aucun impact" value="Aucun impact" />
            <Picker.Item label="Impact léger" value="Impact léger" />
            <Picker.Item label="Impact modéré" value="Impact modéré" />
            <Picker.Item label="Impact sévère" value="Impact sévère" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Participation à des conférences éducatives</Text>
          <Switch
            value={formData.participationInEducationalTalks}
            onValueChange={(value) => updateField('participationInEducationalTalks', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Suivi psychologique</Text>
          <Switch
            value={formData.psychologicalFollowUp}
            onValueChange={(value) => updateField('psychologicalFollowUp', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Éducation thérapeutique</Text>
          <Switch
            value={formData.therapeuticEducation}
            onValueChange={(value) => updateField('therapeuticEducation', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Visite à domicile</Text>
          <Switch
            value={formData.homeVisit}
            onValueChange={(value) => updateField('homeVisit', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Soutien social</Text>
          <Switch
            value={formData.socialSupport.hasSupport}
            onValueChange={(value) => updateNestedField('socialSupport', 'hasSupport', value)}
          />
        </View>

        {formData.socialSupport.hasSupport && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Consultation sociale</Text>
              <Switch
                value={formData.socialSupport.socialConsultation}
                onValueChange={(value) => updateNestedField('socialSupport', 'socialConsultation', value)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Consultation gratuite</Text>
              <Switch
                value={formData.socialSupport.freeConsultation}
                onValueChange={(value) => updateNestedField('socialSupport', 'freeConsultation', value)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Médicaments gratuits</Text>
              <Switch
                value={formData.socialSupport.freeMedication}
                onValueChange={(value) => updateNestedField('socialSupport', 'freeMedication', value)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Inscription scolaire gratuite</Text>
              <Switch
                value={formData.socialSupport.freeSchoolEnrollment}
                onValueChange={(value) => updateNestedField('socialSupport', 'freeSchoolEnrollment', value)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Réduction des coûts de transport</Text>
              <Switch
                value={formData.socialSupport.reducedTransportationCosts}
                onValueChange={(value) => updateNestedField('socialSupport', 'reducedTransportationCosts', value)}
              />
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Accompagnement spécial</Text>
          <View style={styles.checkboxGroup}>
            {['Psychologique', 'Social', 'Éducatif', 'Médical', 'Autres'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.checkbox, (formData.specialAccompaniment || []).includes(item) && styles.checkboxSelected]}
                onPress={() => {
                  const current = formData.specialAccompaniment || [];
                  const updated = current.includes(item)
                    ? current.filter((i: string) => i !== item)
                    : [...current, item];
                  updateField('specialAccompaniment', updated);
                }}
              >
                <Text style={styles.checkboxText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Famille informée</Text>
          <Picker
            selectedValue={formData.familyInformed}
            onValueChange={(value) => updateField('familyInformed', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner" value="" />
            <Picker.Item label="Oui, complètement" value="Oui, complètement" />
            <Picker.Item label="Oui, partiellement" value="Oui, partiellement" />
            <Picker.Item label="Non" value="Non" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Plan de suivi personnalisé</Text>
          <Switch
            value={formData.personalizedFollowUpPlan}
            onValueChange={(value) => updateField('personalizedFollowUpPlan', value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date du prochain suivi</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setDatePickerField('dateOfNextConsultation');
              setShowDatePicker(true);
              setSelectedDate(formData.dateOfNextConsultation ? new Date(formData.dateOfNextConsultation) : new Date());
            }}
          >
            <Text style={styles.dateInputText}>{formatDate(formData.dateOfNextConsultation)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              handleDateConfirm(date);
            }
          }}
        />
      )}
    </>
  );
};

// Follow-up Plan Step
const FollowUpPlanStep = ({ data, onUpdate }: any) => {
  const [formData, setFormData] = useState(data);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [datePickerField, setDatePickerField] = useState('');

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Sélectionner la date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    updateField('expectedDateOfNextConsultation', dateStr);
    setShowDatePicker(false);
  };

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const updated = {
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <>
      <View style={styles.stepContainer}>
        <Text style={styles.sectionTitle}>Plan de suivi</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Examens avant la prochaine consultation</Text>
          <View style={styles.testsList}>
            {(formData.testsBeforeNextConsultation || []).map((test: any, index: number) => (
              <View key={index} style={styles.testItem}>
                <TextInput
                  style={styles.testInput}
                  placeholder="Nom de l'examen"
                  value={test.testName || ''}
                  onChangeText={(text) => {
                    const updated = [...(formData.testsBeforeNextConsultation || [])];
                    updated[index] = { testName: text };
                    updateField('testsBeforeNextConsultation', updated);
                  }}
                />
                {(formData.testsBeforeNextConsultation || []).length > 1 && (
                  <TouchableOpacity
                    style={styles.removeTestButton}
                    onPress={() => {
                      const updated = [...(formData.testsBeforeNextConsultation || [])];
                      updated.splice(index, 1);
                      updateField('testsBeforeNextConsultation', updated);
                    }}
                  >
                    <Text style={styles.removeTestButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={styles.addTestButton}
              onPress={() => {
                const current = formData.testsBeforeNextConsultation || [];
                const updated = [...current, { testName: '' }];
                updateField('testsBeforeNextConsultation', updated);
              }}
            >
              <Text style={styles.addTestButtonText}>+ Ajouter un examen</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Progrès depuis la dernière consultation</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Décrivez les progrès ou changements observés"
            value={formData.progressSinceLastConsultation || ''}
            onChangeText={(text) => updateField('progressSinceLastConsultation', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Éducation thérapeutique</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Entrez les points d'éducation thérapeutique"
            value={formData.therapeuticEducation || ''}
            onChangeText={(text) => updateField('therapeuticEducation', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date prévue de la prochaine consultation</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setDatePickerField('expectedDateOfNextConsultation');
              setShowDatePicker(true);
              setSelectedDate(formData.expectedDateOfNextConsultation ? new Date(formData.expectedDateOfNextConsultation) : new Date());
            }}
          >
            <Text style={styles.dateInputText}>{formatDate(formData.expectedDateOfNextConsultation)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              handleDateConfirm(date);
            }
          }}
        />
      )}
    </>
  );
};

const CommentsStep = ({ data, onUpdate, onPreview }: any) => (
  <View style={styles.stepContainer}>
    <Text style={styles.sectionTitle}>Commentaires et observations</Text>
    
    <View style={styles.formGroup}>
      <Text style={styles.label}>Commentaires généraux</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Entrez les commentaires généraux"
        value={data.generalComments || ''}
        onChangeText={(text) => onUpdate({ generalComments: text })}
        multiline
        numberOfLines={4}
      />
    </View>

    <TouchableOpacity style={styles.previewButton} onPress={onPreview}>
      <Text style={styles.previewButtonText}>Voir l'aperçu</Text>
    </TouchableOpacity>
  </View>
);

const ConsultationPreview = ({ formData, onEdit, onSubmit, onBack }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Aperçu de la consultation</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Résumé de la consultation</Text>
          
          <View style={styles.previewSection}>
            <Text style={styles.previewSubtitle}>Informations administratives</Text>
            <Text>FOSA: {formData.administrativeInfo.fosa}</Text>
            <Text>Personnel: {formData.administrativeInfo.personnel}</Text>
            <Text>Région: {formData.administrativeInfo.region}</Text>
            <Text>District: {formData.administrativeInfo.district}</Text>
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.previewSubtitle}>Patient</Text>
            <Text>Nom: {formData.demographicData.lastName} {formData.demographicData.firstName}</Text>
            <Text>Sexe: {formData.demographicData.sex}</Text>
            <Text>Âge: {formData.demographicData.age}</Text>
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.previewSubtitle}>Antécédents médicaux</Text>
            <Text>Type de drépanocytose: {formData.medicalHistory.typeOfSickleCell}</Text>
            <Text>Acide folique: {formData.medicalHistory.folicAcid ? 'Oui' : 'Non'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onEdit}>
          <Text style={styles.secondaryButtonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.successButton]} onPress={onSubmit}>
          <Text style={styles.successButtonText}>Créer consultation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#dc3545',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  stepName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  checkboxGroup: {
    flexDirection: 'column',
    gap: 8,
  },
  checkbox: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  comingSoon: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 40,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#dc3545',
    marginBottom: 20,  
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    marginBottom: 20,  
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewSection: {
    marginBottom: 20,
  },
  previewSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 10,
  },
  previewButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testsList: {
    gap: 8,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  removeTestButton: {
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 4,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addTestButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  addTestButtonText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Date Picker Styles
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
    maxHeight: '70%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  datePickerButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: '#666',
    fontSize: 16,
  },
  datePickerButtonTextConfirm: {
    color: '#dc3545',
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
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monthPicker: {
    flex: 1,
    marginRight: 10,
  },
  yearPicker: {
    flex: 1,
    marginLeft: 10,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dayOfWeekText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 40,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  emptyDay: {
    width: 40,
    height: 40,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  normalDay: {
    backgroundColor: '#f5f5f5',
  },
  selectedDay: {
    backgroundColor: '#dc3545',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  normalDayText: {
    color: '#333',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateInputText: {
    color: '#333',
  },
});

export default CreateConsultationScreen;