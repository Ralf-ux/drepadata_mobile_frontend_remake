/* ConsultationsScreen.tsx – Professional Medical Consultations */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

const Icon = ({ name, size = 20, color = COLORS.textPrimary }: any) => (
  <Ionicons name={name} size={size} color={color} />
);

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
    const isInitial = consultation.consultation_type === 'initial';

    return (
      <TouchableOpacity
        key={consultation.id}
        style={styles.card}
        onPress={() => router.push(`/patient/${consultation.patient_id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[
            styles.iconBadge,
            { backgroundColor: isInitial ? COLORS.redBg : COLORS.roseBg }
          ]}>
            <Icon name="document-text" size={22} color={isInitial ? COLORS.red : COLORS.rose} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{consultation.patientName}</Text>
            <Text style={styles.cardSubtitle}>
              {isInitial ? 'Consultation Initiale' : 'Consultation de Suivi'}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={COLORS.textTertiary} />
            <Text style={styles.detailText}>
              {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {consultation.fosa && (
            <View style={styles.detailRow}>
              <Icon name="business" size={16} color={COLORS.textTertiary} />
              <Text style={styles.detailText}>FOSA: {consultation.fosa}</Text>
            </View>
          )}
          {consultation.poids && (
            <View style={styles.detailRow}>
              <Icon name="fitness" size={16} color={COLORS.textTertiary} />
              <Text style={styles.detailText}>
                Poids: {consultation.poids} kg • Taille: {consultation.taille} cm
              </Text>
            </View>
          )}
          {consultation.referred_from && (
            <View style={styles.detailRow}>
              <Icon name="arrow-forward-circle" size={16} color={COLORS.textTertiary} />
              <Text style={styles.detailText}>Référé de: {consultation.referred_from}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => router.push(`/patient/${consultation.patient_id}` as any)}
          >
            <Text style={styles.viewBtnText}>Voir le profil</Text>
          </TouchableOpacity>
        </View>
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
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBadge, { backgroundColor: COLORS.emeraldBg }]}>
            <Icon name="pulse" size={22} color={COLORS.emerald} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{followUp.patientName}</Text>
            <Text style={styles.cardSubtitle}>Suivi Trimestriel #{followUp.follow_up_number}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={COLORS.textTertiary} />
            <Text style={styles.detailText}>
              {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {followUp.poids && (
            <View style={styles.detailRow}>
              <Icon name="fitness" size={16} color={COLORS.textTertiary} />
              <Text style={styles.detailText}>
                Poids: {followUp.poids} kg • Taille: {followUp.taille} cm
              </Text>
            </View>
          )}
          {followUp.taux_hemoglobine_recent && (
            <View style={styles.detailRow}>
              <Icon name="water" size={16} color={COLORS.textTertiary} />
              <Text style={styles.detailText}>Hb: {followUp.taux_hemoglobine_recent} g/dl</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => router.push(`/patient/${followUp.patient_id}` as any)}
          >
            <Text style={styles.viewBtnText}>Voir le profil</Text>
          </TouchableOpacity>
        </View>
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
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'consultations' && styles.tabActive]}
          onPress={() => setViewMode('consultations')}
          activeOpacity={0.8}
        >
          <Icon name="document-text" size={20} color={viewMode === 'consultations' ? COLORS.red : COLORS.textSecondary} />
          <Text style={[styles.tabText, viewMode === 'consultations' && styles.tabTextActive]}>
            Consultations ({consultations.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, viewMode === 'followups' && styles.tabActive]}
          onPress={() => setViewMode('followups')}
          activeOpacity={0.8}
        >
          <Icon name="pulse" size={20} color={viewMode === 'followups' ? COLORS.emerald : COLORS.textSecondary} />
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
            tintColor={COLORS.red}
            colors={[COLORS.red]}
          />
        }
      >
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.red} />
            <Text style={styles.loadingText}>Chargement des données...</Text>
          </View>
        ) : viewMode === 'consultations' ? (
          sortedConsultations.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Icon name="document-text" size={64} color={COLORS.border} />
              </View>
              <Text style={styles.emptyTitle}>Aucune consultation</Text>
              <Text style={styles.emptySubtitle}>
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
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Icon name="pulse" size={64} color={COLORS.border} />
              </View>
              <Text style={styles.emptyTitle}>Aucun suivi</Text>
              <Text style={styles.emptySubtitle}>
                Les suivis trimestriels apparaîtront ici après leur création
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {sortedFollowUps.map(renderFollowUp)}
            </View>
          )
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

/* ------------------------------------------------------------- */
/* STYLES – 100% CONSISTENT WITH HomeScreen.tsx                  */
/* ------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING * 2,
    gap: SPACING * 1.5,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.red,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.red,
  },

  // Content
  content: {
    flex: 1,
  },
  list: {
    padding: SPACING * 3,
    gap: SPACING * 2,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING * 2.5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING * 2,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: RADIUS - 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING * 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  // Details
  details: {
    gap: SPACING,
    marginBottom: SPACING * 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },

  // Footer
  cardFooter: {
    alignItems: 'flex-end',
  },
  viewBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING,
    borderRadius: RADIUS - 4,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Loading
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING * 4,
  },
  loadingText: {
    marginTop: SPACING * 2,
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  // Empty State
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING * 4,
    marginTop: SPACING * 8,
  },
  emptyIcon: {
    marginBottom: SPACING * 3,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING * 3,
  },
});

export default ConsultationsScreen;