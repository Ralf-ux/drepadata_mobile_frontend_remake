import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Calendar, User, Activity } from 'lucide-react-native';
import {
  getConsultations,
  getFollowUps,
  getPatientById,
  type ConsultationData,
  type FollowUpData,
} from '@/utils/storage';

type ConsultationWithPatient = ConsultationData & {
  patientName?: string;
  fosa?: string;
  poids?: string;
  taille?: string;
  referred_from?: string;
};

type FollowUpWithPatient = FollowUpData & {
  patientName?: string;
};

const ConsultationsScreen = () => {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationWithPatient[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpWithPatient[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'consultations' | 'followups'>('consultations');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const consultationsData = await getConsultations();
      const consultationsWithNames = await Promise.all(
        consultationsData.map(async (consultation) => {
          const patient = await getPatientById(consultation.patient_id);
          return {
            ...consultation,
            patientName: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
          };
        })
      );
      setConsultations(consultationsWithNames);

      const followUpsData = await getFollowUps();
      const followUpsWithNames = await Promise.all(
        followUpsData.map(async (followUp) => {
          const patient = await getPatientById(followUp.patient_id);
          return {
            ...followUp,
            patientName: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
          };
        })
      );
      setFollowUps(followUpsWithNames);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderConsultation = (consultation: ConsultationWithPatient) => {
    const date = new Date(consultation.consultation_date || consultation.created_at);
    
    return (
      <TouchableOpacity
        key={consultation.id}
        style={styles.card}
        onPress={() => router.push(`/patient/${consultation.patient_id}` as any)}
      >
        <View style={styles.cardHeader}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: consultation.consultation_type === 'initial' ? '#dc3545' : '#007bff' }
          ]}>
            <FileText size={24} color="white" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{consultation.patientName}</Text>
            <Text style={styles.cardSubtitle}>
              {consultation.consultation_type === 'initial' ? 'Consultation Initiale' : 'Consultation de Suivi'}
            </Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#6c757d" />
            <Text style={styles.detailText}>
              {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {consultation.fosa && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>FOSA: {consultation.fosa}</Text>
            </View>
          )}
          {consultation.poids && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>
                Poids: {consultation.poids} kg • Taille: {consultation.taille} cm
              </Text>
            </View>
          )}
          {consultation.referred_from && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Référé de: {consultation.referred_from}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => router.push(`/patient/${consultation.patient_id}` as any)}
        >
          <Text style={styles.viewButtonText}>Voir le profil →</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderFollowUp = (followUp: FollowUpWithPatient) => {
    const date = new Date(followUp.follow_up_date);
    
    return (
      <TouchableOpacity
        key={followUp.id}
        style={styles.card}
        onPress={() => router.push(`/patient/${followUp.patient_id}` as any)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: '#28a745' }]}>
            <Activity size={24} color="white" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{followUp.patientName}</Text>
            <Text style={styles.cardSubtitle}>Suivi Trimestriel #{followUp.follow_up_number}</Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#6c757d" />
            <Text style={styles.detailText}>
              {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {followUp.poids && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>
                Poids: {followUp.poids} kg • Taille: {followUp.taille} cm
              </Text>
            </View>
          )}
          {followUp.taux_hemoglobine_recent && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Hb: {followUp.taux_hemoglobine_recent} g/dl</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => router.push(`/patient/${followUp.patient_id}` as any)}
        >
          <Text style={styles.viewButtonText}>Voir le profil →</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const sortedConsultations = [...consultations].sort((a, b) => {
    const dateA = new Date(a.consultation_date || a.created_at).getTime();
    const dateB = new Date(b.consultation_date || b.created_at).getTime();
    return dateB - dateA;
  });

  const sortedFollowUps = [...followUps].sort((a, b) => {
    const dateA = new Date(a.follow_up_date).getTime();
    const dateB = new Date(b.follow_up_date).getTime();
    return dateB - dateA;
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'consultations' && styles.tabActive]}
          onPress={() => setViewMode('consultations')}
        >
          <FileText size={20} color={viewMode === 'consultations' ? '#dc3545' : '#6c757d'} />
          <Text style={[styles.tabText, viewMode === 'consultations' && styles.tabTextActive]}>
            Consultations ({consultations.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, viewMode === 'followups' && styles.tabActive]}
          onPress={() => setViewMode('followups')}
        >
          <Activity size={20} color={viewMode === 'followups' ? '#28a745' : '#6c757d'} />
          <Text style={[styles.tabText, viewMode === 'followups' && styles.tabTextActive]}>
            Suivis ({followUps.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#dc3545']}
            tintColor="#dc3545"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : viewMode === 'consultations' ? (
          sortedConsultations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FileText size={64} color="#e9ecef" />
              <Text style={styles.emptyTitle}>Aucune consultation</Text>
              <Text style={styles.emptyText}>
                Les consultations apparaîtront ici après leur création
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {sortedConsultations.map(renderConsultation)}
            </View>
          )
        ) : (
          sortedFollowUps.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Activity size={64} color="#e9ecef" />
              <Text style={styles.emptyTitle}>Aucun suivi</Text>
              <Text style={styles.emptyText}>
                Les suivis trimestriels apparaîtront ici après leur création
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {sortedFollowUps.map(renderFollowUp)}
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#dc3545',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  tabTextActive: {
    color: '#dc3545',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  cardDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#6c757d',
  },
  viewButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc3545',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    marginTop: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default ConsultationsScreen;
