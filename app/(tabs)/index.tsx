/* HomeScreen.tsx – Professional Medical Dashboard */
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getConsultations } from '@/utils/storage/consultationStorage';
import { getFollowUps } from '@/utils/storage/followUpStorage';
import { getPatients } from '@/utils/storage/patientStorage';

const { width } = Dimensions.get('window');

/* ------------------------------------------------------------- */
/* COLORS & TOKENS                                               */
/* ------------------------------------------------------------- */
const COLORS = {
  bg: '#FFF1F2',
  bgSecondary: '#FFF7ED',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  
  // Primary red/rose palette
  red: '#DC2626',
  redLight: '#FCA5A5',
  redBg: '#FEE2E2',
  rose: '#F43F5E',
  roseLight: '#FDA4AF',
  roseBg: '#FFE4E6',
  
  // Supporting colors
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
const Icon = ({ name, size = 24, color = COLORS.textPrimary }: any) => (
  <Ionicons name={name} size={size} color={color} />
);

/* ------------------------------------------------------------- */
/* MAIN COMPONENT                                                */
/* ------------------------------------------------------------- */
export default function ProfessionalMedicalHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalConsultations: 0,
    totalFollowUps: 0,
    recentPatients: 0,
    pendingFollowUps: 0,
    todayAppointments: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadStats = async () => {
    const patients = await getPatients();
    const consultations = await getConsultations();
    const followUps = await getFollowUps();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = patients.filter((p: any) => 
      new Date(p.created_at) > thirtyDaysAgo
    ).length;

    const pending = followUps.filter((f: any) => 
      f.status === 'pending'
    ).length;

    setStats({
      totalPatients: patients.length,
      totalConsultations: consultations.length,
      totalFollowUps: followUps.length,
      recentPatients: recent,
      pendingFollowUps: pending,
      todayAppointments: 8, // Mock data
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const navigate = (route: string) => {
    router.push(route as any);
  };


  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Centre de Gestion{'\n'}Drépanocytaire</Text>
            <Text style={styles.headerDate}>{formatDate(currentTime)}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>Heure</Text>
              <Text style={styles.timeValue}>{formatTime(currentTime)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshBtn}
              onPress={onRefresh}
              activeOpacity={0.7}
            >
              <Icon name="refresh" size={20} color={COLORS.red} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={COLORS.red}
          />
        }
      >
        {/* Alert */}
        {stats.pendingFollowUps > 0 && (
          <View style={styles.alert}>
            <Icon name="alert-circle" size={20} color={COLORS.amber} />
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>
                {stats.pendingFollowUps} suivi{stats.pendingFollowUps > 1 ? 's' : ''} en attente nécessitent votre attention
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.alertLink}>Voir les détails</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search */}
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => navigate('/(tabs)/search')}
          activeOpacity={0.9}
        >
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color={COLORS.textSecondary} />
            <Text style={styles.searchPlaceholder}>
              Rechercher un patient par nom, ID...
            </Text>
          </View>
        </TouchableOpacity>

        {/* KPIs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métriques clés</Text>
          <View style={styles.kpiGrid}>
            <KPICard
              icon="people"
              label="Patients actifs"
              value={stats.totalPatients}
              trend="+12%"
              trendUp
              color="red"
            />
            <KPICard
              icon="document-text"
              label="Consultations"
              value={stats.totalConsultations}
              trend="+8%"
              trendUp
              color="rose"
            />
            <KPICard
              icon="pulse"
              label="Suivis"
              value={stats.totalFollowUps}
              trend="-3%"
              color="red"
            />
            <KPICard
              icon="trending-up"
              label="Nouveaux (30j)"
              value={stats.recentPatients}
              trend="+18%"
              trendUp
              color="rose"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <LinearGradient
            colors={[COLORS.red, COLORS.rose]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionsCard}
          >
            <Text style={styles.actionsTitle}>Actions rapides</Text>
            <View style={styles.actionsList}>
              <ActionButton
                icon="person-add"
                label="Nouveau patient"
                primary
                onPress={() => navigate('/create-patient')}
              />
              <ActionButton
                icon="document-text"
                label="Consultation"
                onPress={() => navigate('/(tabs)/consultations')}
              />
              <ActionButton
                icon="pulse"
                label="Suivi rapide"
                onPress={() => navigate('/(tabs)/followups')}
              />
              <ActionButton
                icon="time"
                label="Historique"
                onPress={() => navigate('/(tabs)/statistics')}
              />
            </View>
          </LinearGradient>
        </View>


        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------- */
/* SUB-COMPONENTS                                                */
/* ------------------------------------------------------------- */
function KPICard({
  icon,
  label,
  value,
  trend,
  trendUp = false,
  color = 'red'
}: {
  icon: string;
  label: string;
  value: number;
  trend: string;
  trendUp?: boolean;
  color?: 'red' | 'rose';
}) {
  const colorMap = {
    red: { bg: COLORS.redBg, text: COLORS.red },
    rose: { bg: COLORS.roseBg, text: COLORS.rose },
  };
  const colors = colorMap[color];

  return (
    <View style={styles.kpiCard}>
      <View style={styles.kpiHeader}>
        <View style={[styles.kpiIcon, { backgroundColor: colors.bg }]}>
          <Icon name={icon} size={22} color={colors.text} />
        </View>
        <View style={[
          styles.kpiTrend,
          { backgroundColor: trendUp ? COLORS.emeraldBg : COLORS.redBg }
        ]}>
          <Text style={[
            styles.kpiTrendText,
            { color: trendUp ? COLORS.emerald : COLORS.red }
          ]}>
            {trend}
          </Text>
        </View>
      </View>
      <Text style={styles.kpiValue}>{value.toLocaleString('fr-FR')}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusMap: any = {
    confirmed: { label: 'Confirmé', bg: COLORS.emeraldBg, text: COLORS.emerald },
    pending: { label: 'En attente', bg: COLORS.amberBg, text: COLORS.amber },
    urgent: { label: 'Urgent', bg: COLORS.redBg, text: COLORS.red },
  };
  const s = statusMap[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
      <Text style={[styles.statusText, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

function ActionButton({ icon, label, primary = false, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, primary && styles.actionBtnPrimary]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon 
        name={icon} 
        size={18} 
        color={primary ? COLORS.red : COLORS.white} 
      />
      <Text style={[styles.actionBtnText, primary && styles.actionBtnTextPrimary]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const iconMap: any = {
    consultation: { icon: 'document-text', bg: COLORS.redBg, color: COLORS.red },
    patient: { icon: 'person', bg: COLORS.roseBg, color: COLORS.rose },
    followup: { icon: 'pulse', bg: COLORS.redBg, color: COLORS.red },
  };
  const config = iconMap[type] || iconMap.consultation;

  return (
    <View style={[styles.activityIcon, { backgroundColor: config.bg }]}>
      <Icon name={config.icon} size={18} color={config.color} />
    </View>
  );
}

/* ------------------------------------------------------------- */
/* STYLES                                                        */
/* ------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    
  },
  scroll: {
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    marginTop:-49,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING * 3,
    paddingVertical: SPACING * 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 26,
  },
  headerDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING * 1.5,
  },
  timeCard: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  refreshBtn: {
    padding: SPACING,
    borderRadius: RADIUS - 4,
    backgroundColor: COLORS.bgSecondary,
  },

  // Alert
  alert: {
    flexDirection: 'row',
    backgroundColor: COLORS.amberBg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: RADIUS,
    padding: SPACING * 2,
    marginHorizontal: SPACING * 3,
    marginTop: SPACING * 2,
    gap: SPACING * 1.5,
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#92400E',
    marginBottom: 4,
  },
  alertLink: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.amber,
  },

  // Search
  searchContainer: {
    paddingHorizontal: SPACING * 3,
    marginTop: SPACING * 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS,
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 2,
    gap: SPACING,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // Section
  section: {
    paddingHorizontal: SPACING * 3,
    marginTop: SPACING * 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING * 2,
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING * 1.5,
  },
  kpiCard: {
    width: (width - SPACING * 9) / 2,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS,
    padding: SPACING * 2.5,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING * 1.5,
  },
  kpiIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTrend: {
    paddingHorizontal: SPACING,
    paddingVertical: 4,
    borderRadius: 12,
  },
  kpiTrendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },

  // Two Column Layout
  twoColumnGrid: {
    gap: SPACING * 2,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS,
    padding: SPACING * 2.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING * 2,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING * 1.5,
  },
  iconBadge: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.redBg,
    borderRadius: RADIUS - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.red,
  },

  // Agenda
  agendaCard: {
    marginBottom: SPACING * 2,
  },
  appointmentList: {
    gap: SPACING * 1.5,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS - 2,
    padding: SPACING * 1.5,
    gap: SPACING * 1.5,
  },
  appointmentTime: {
    alignItems: 'center',
    minWidth: 60,
  },
  appointmentTimeLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
    fontWeight: '600',
    marginBottom: 2,
  },
  appointmentTimeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  appointmentDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentPatient: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: SPACING * 1.5,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Quick Actions
  actionsCard: {
    borderRadius: RADIUS,
    padding: SPACING * 2.5,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING * 2,
  },
  actionsList: {
    gap: SPACING * 1.5,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 2,
    borderRadius: RADIUS - 2,
    gap: SPACING * 1.5,
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.white,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },
  actionBtnTextPrimary: {
    color: COLORS.red,
  },

  // Activity
  activityList: {
    marginTop: SPACING * 2,
    gap: SPACING * 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING * 1.5,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activityPatient: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
});