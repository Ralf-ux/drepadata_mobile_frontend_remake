import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { getAllConsultations, ConsultationData } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ConsultationStats {
  totalConsultations: number;
  initialConsultations: number;
  followUpConsultations: number;
  consultationsThisMonth: number;
  patientsCount: number;
  recentConsultations: ConsultationData[];
  consultationsByRegion: Record<string, number>;
  consultationsByType: Record<string, number>;
}

const COLORS = {
  primary: '#dc3545',
  primaryLight: '#e4606d',
  secondary: '#28a745',
  accent: '#007bff',
  warning: '#ffc107',
  purple: '#6f42c1',
  teal: '#20c997',
  background: '#f8fafc',
  surface: '#ffffff',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
};

const StatCard: React.FC<{
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}> = ({ title, value, subtitle, icon, color, onPress }) => (
  <Animated.View entering={FadeInDown.duration(300)} style={styles.statCard}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.statGradient}
      >
        <View style={styles.statContent}>
          <Ionicons name={icon} size={24} color="white" style={styles.statIcon} />
          <View style={styles.statTextContainer}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
            <Text style={styles.statSubtitle}>{subtitle}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

const QuickAction: React.FC<{
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}> = ({ title, description, icon, color, onPress }) => (
  <Animated.View entering={FadeInDown.duration(300).delay(100)} style={styles.quickAction}>
    <TouchableOpacity style={styles.quickActionInner} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

const RecentConsultationItem: React.FC<{
  consultation: ConsultationData;
  index: number;
}> = ({ consultation, index }) => (
  <Animated.View entering={FadeInDown.duration(300).delay(index * 100)} style={styles.recentItem}>
    <View style={styles.recentIcon}>
      <Ionicons
        name={consultation.consultation_type === 'initial' ? 'star' : 'repeat'}
        size={16}
        color={COLORS.textPrimary}
      />
    </View>
    <View style={styles.recentContent}>
      <Text style={styles.recentName}>
        {consultation.full_name || 'Patient sans nom'}
      </Text>
      <Text style={styles.recentDetails}>
        {consultation.sickle_type} • {consultation.region} •{' '}
        {new Date(consultation.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
        })}
      </Text>
    </View>
    <View
      style={[
        styles.recentType,
        {
          backgroundColor:
            consultation.consultation_type === 'initial' ? COLORS.secondary : COLORS.accent,
        },
      ]}
    >
      <Text style={styles.recentTypeText}>
        {consultation.consultation_type === 'initial' ? 'Initiale' : 'Suivi'}
      </Text>
    </View>
  </Animated.View>
);

const RegionItem: React.FC<{
  region: string;
  count: number;
  total: number;
}> = ({ region, count, total }) => (
  <Animated.View entering={FadeIn.duration(300)} style={styles.regionItem}>
    <View style={styles.regionInfo}>
      <Text style={styles.regionName}>{region}</Text>
      <Text style={styles.regionCount}>{count} consultations</Text>
    </View>
    <View style={styles.regionBar}>
      <Animated.View
        style={[
          styles.regionBarFill,
          {
            width: `${(count / total) * 100}%`,
            backgroundColor: getRegionColor(region),
          },
        ]}
      />
    </View>
  </Animated.View>
);

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<ConsultationStats>({
    totalConsultations: 0,
    initialConsultations: 0,
    followUpConsultations: 0,
    consultationsThisMonth: 0,
    patientsCount: 0,
    recentConsultations: [],
    consultationsByRegion: {},
    consultationsByType: {},
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const consultations = await getAllConsultations();

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const consultationsThisMonth = consultations.filter((consultation) => {
        const consultationDate = new Date(consultation.created_at);
        return (
          consultationDate.getMonth() === currentMonth &&
          consultationDate.getFullYear() === currentYear
        );
      });

      const regionStats: Record<string, number> = {};
      const typeStats: Record<string, number> = {};

      consultations.forEach((consultation) => {
        const region = consultation.region || 'Non spécifiée';
        regionStats[region] = (regionStats[region] || 0) + 1;

        const sickleType = consultation.sickle_type || 'Non spécifié';
        typeStats[sickleType] = (typeStats[sickleType] || 0) + 1;
      });

      const uniquePatients = new Set(consultations.map((c) => c.patient_id));

      setStats({
        totalConsultations: consultations.length,
        initialConsultations: consultations.filter(
          (c) => c.consultation_type === 'initial'
        ).length,
        followUpConsultations: consultations.filter(
          (c) => c.consultation_type === 'follow_up'
        ).length,
        consultationsThisMonth: consultationsThisMonth.length,
        patientsCount: uniquePatients.size,
        recentConsultations: consultations.slice(0, 5),
        consultationsByRegion: regionStats,
        consultationsByType: typeStats,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Text entering={FadeIn} style={styles.loadingText}>
          Chargement des données...
        </Animated.Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.header}
      >
        <Animated.View entering={FadeIn} style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tableau de Bord</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="Nouvelle Consultation"
            description="Démarrer une nouvelle consultation"
            icon="medkit"
            color={COLORS.primary}
            onPress={() => router.push('/consultation')}
          />
          <QuickAction
            title="Liste des Patients"
            description="Voir tous les patients"
            icon="people"
            color={COLORS.secondary}
            onPress={() => router.push('/patient')}
          />
          <QuickAction
            title="Rapports"
            description="Générer des rapports"
            icon="stats-chart"
            color={COLORS.accent}
            onPress={() => Alert.alert('Rapports', 'Fonctionnalité à venir')}
          />
          <QuickAction
            title="Paramètres"
            description="Configurer l'application"
            icon="settings"
            color={COLORS.purple}
            onPress={() => Alert.alert('Paramètres', 'Fonctionnalité à venir')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aperçu des Consultations</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Consultations"
            value={stats.totalConsultations}
            subtitle="Toutes consultations"
            icon="pulse"
            color={COLORS.accent}
            onPress={() =>
              Alert.alert(
                'Total Consultations',
                `${stats.totalConsultations} consultations enregistrées`
              )
            }
          />
          <StatCard
            title="Consultations Initiales"
            value={stats.initialConsultations}
            subtitle="Premières consultations"
            icon="star"
            color={COLORS.secondary}
            onPress={() =>
              Alert.alert(
                'Consultations Initiales',
                `${stats.initialConsultations} consultations initiales`
              )
            }
          />
          <StatCard
            title="Consultations de Suivi"
            value={stats.followUpConsultations}
            subtitle="Suivis réguliers"
            icon="repeat"
            color={COLORS.warning}
            onPress={() =>
              Alert.alert(
                'Consultations de Suivi',
                `${stats.followUpConsultations} consultations de suivi`
              )
            }
          />
          <StatCard
            title="Ce Mois"
            value={stats.consultationsThisMonth}
            subtitle="Consultations ce mois"
            icon="calendar"
            color={COLORS.primary}
            onPress={() =>
              Alert.alert(
                'Ce Mois',
                `${stats.consultationsThisMonth} consultations ce mois`
              )
            }
          />
          <StatCard
            title="Patients Uniques"
            value={stats.patientsCount}
            subtitle="Patients suivis"
            icon="person"
            color={COLORS.purple}
            onPress={() =>
              Alert.alert('Patients', `${stats.patientsCount} patients uniques suivis`)
            }
          />
          <StatCard
            title="Régions"
            value={Object.keys(stats.consultationsByRegion).length}
            subtitle="Régions couvertes"
            icon="map"
            color={COLORS.teal}
            onPress={() =>
              Alert.alert(
                'Régions',
                `${Object.keys(stats.consultationsByRegion).length} régions différentes`
              )
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultations Récentes</Text>
        {stats.recentConsultations.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <Ionicons name="document-text" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>Aucune consultation</Text>
            <Text style={styles.emptyStateText}>
              Commencez par créer votre première consultation
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => router.push('/consultation')}
            >
              <Text style={styles.emptyStateButtonText}>Nouvelle Consultation</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.recentList}>
            {stats.recentConsultations.map((consultation, index) => (
              <RecentConsultationItem
                key={consultation.id}
                consultation={consultation}
                index={index}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Répartition par Région</Text>
        <View style={styles.regionList}>
          {Object.entries(stats.consultationsByRegion).map(([region, count]) => (
            <RegionItem
              key={region}
              region={region}
              count={count}
              total={stats.totalConsultations}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const getRegionColor = (region: string): string => {
  const colors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.accent,
    COLORS.warning,
    COLORS.purple,
    COLORS.teal,
  ];
  const index = region.charCodeAt(0) % colors.length;
  return colors[index];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  quickActionInner: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  quickActionDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 20,
    borderRadius: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  statSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  recentList: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  recentDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  recentType: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recentTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  regionList: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  regionItem: {
    marginBottom: 16,
  },
  regionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  regionName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  regionCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  regionBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  regionBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  emptyStateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
});