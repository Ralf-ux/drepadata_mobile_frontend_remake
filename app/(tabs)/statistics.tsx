/* StatisticsScreen.tsx – Professional Medical Stats */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getPatients,
  getConsultations,
  getFollowUps,
  getVaccinationRecords,
} from '@/utils/storage';

const { width } = Dimensions.get('window');

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
const Icon = ({ name, size = 24, color = COLORS.textPrimary }: any) => (
  <Ionicons name={name} size={size} color={color} />
);

/* ------------------------------------------------------------- */
/* MAIN SCREEN                                                   */
/* ------------------------------------------------------------- */
const StatisticsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalConsultations: 0,
    totalFollowUps: 0,
    totalVaccinations: 0,
    recentPatients: 0,
    averageFollowUpsPerPatient: 0,
    patientsWithInitialConsultation: 0,
    typesDistribution: { SS: 0, SC: 0, 'Sβ⁰': 0, 'Sβ⁺': 0, Autre: 0 },
    genderDistribution: { Masculin: 0, Féminin: 0 },
    ageGroups: { '0-5': 0, '6-12': 0, '13-18': 0, '19-30': 0, '31+': 0 },
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const patients = await getPatients();
    const consultations = await getConsultations();
    const followUps = await getFollowUps();
    const vaccinations = await getVaccinationRecords();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentPatients = patients.filter(p => new Date(p.created_at) > thirtyDaysAgo).length;

    const patientsWithInitial = consultations.filter(c => c.consultation_type === 'initial').length;

    const typesDistribution = { SS: 0, SC: 0, 'Sβ⁰': 0, 'Sβ⁺': 0, Autre: 0 };
    patients.forEach(p => {
      if (p.type_de_drepanocytose in typesDistribution) {
        typesDistribution[p.type_de_drepanocytose as keyof typeof typesDistribution]++;
      } else {
        typesDistribution.Autre++;
      }
    });

    const genderDistribution = { Masculin: 0, Féminin: 0 };
    patients.forEach(p => {
      if (p.sexe === 'Masculin') genderDistribution.Masculin++;
      if (p.sexe === 'Féminin') genderDistribution.Féminin++;
    });

    const ageGroups = { '0-5': 0, '6-12': 0, '13-18': 0, '19-30': 0, '31+': 0 };
    patients.forEach(p => {
      const age = parseInt(p.age_diagnostic || '0');
      if (age <= 5) ageGroups['0-5']++;
      else if (age <= 12) ageGroups['6-12']++;
      else if (age <= 18) ageGroups['13-18']++;
      else if (age <= 30) ageGroups['19-30']++;
      else ageGroups['31+']++;
    });

    setStats({
      totalPatients: patients.length,
      totalConsultations: consultations.length,
      totalFollowUps: followUps.length,
      totalVaccinations: vaccinations.length,
      recentPatients,
      averageFollowUpsPerPatient: patients.length > 0
        ? Math.round((followUps.length / patients.length) * 10) / 10
        : 0,
      patientsWithInitialConsultation: patientsWithInitial,
      typesDistribution,
      genderDistribution,
      ageGroups,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const renderStatCard = (iconName: any, title: string, value: string | number, bgColor: string, iconColor: string) => (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <Icon name={iconName} size={28} color={iconColor} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const getBarColors = () => [COLORS.red, COLORS.rose, COLORS.emerald, COLORS.amber, '#8B5CF6'];

  const renderDistributionCard = (title: string, data: Record<string, number>, iconName: any, iconColor: string) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const colors = getBarColors();

    return (
      <View style={styles.distributionCard}>
        <View style={styles.distributionHeader}>
          <Icon name={iconName} size={20} color={iconColor} />
          <Text style={styles.distributionTitle}>{title}</Text>
        </View>
        {Object.entries(data).map(([key, value], index) => {
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <View key={key} style={styles.distributionItem}>
              <View style={styles.distributionInfo}>
                <View style={styles.distributionLabelContainer}>
                  <View style={[styles.colorDot, { backgroundColor: colors[index % colors.length] }]} />
                  <Text style={styles.distributionLabel}>{key}</Text>
                </View>
                <Text style={styles.distributionValue}>{value} ({percentage}%)</Text>
              </View>
              <View style={styles.distributionBar}>
                <View
                  style={[
                    styles.distributionBarFill,
                    { width: `${percentage}%`, backgroundColor: colors[index % colors.length] }
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.red}
            colors={[COLORS.red]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Statistiques</Text>
            <Text style={styles.headerSubtitle}>Vue d'ensemble du centre</Text>
          </View>
          <Icon name="stats-chart" size={32} color={COLORS.red} />
        </View>

        {/* KPI Grid */}
        <View style={styles.section}>
          <View style={styles.kpiGrid}>
            {renderStatCard('people', 'Patients', stats.totalPatients, COLORS.redBg, COLORS.red)}
            {renderStatCard('document-text', 'Consultations', stats.totalConsultations, COLORS.roseBg, COLORS.rose)}
            {renderStatCard('pulse', 'Suivis', stats.totalFollowUps, COLORS.emeraldBg, COLORS.emerald)}
            {renderStatCard('bandage', 'Vaccinations', stats.totalVaccinations, COLORS.amberBg, COLORS.amber)}
            {renderStatCard('trending-up', 'Nouveaux (30j)', stats.recentPatients, COLORS.redBg, COLORS.red)}
            {renderStatCard('repeat', 'Moy. suivis/patient', stats.averageFollowUpsPerPatient, COLORS.roseBg, COLORS.rose)}
          </View>
        </View>

        {/* Initial Consultation Rate */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="medkit" size={20} color={COLORS.emerald} />
              <Text style={styles.cardTitle}>Taux de consultation initiale</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${stats.totalPatients > 0
                        ? (stats.patientsWithInitialConsultation / stats.totalPatients) * 100
                        : 0}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {stats.patientsWithInitialConsultation} / {stats.totalPatients} patients
              </Text>
            </View>
          </View>
        </View>

        {/* Distributions */}
        <View style={styles.section}>
          {renderDistributionCard(
            'Distribution par type de drépanocytose',
            stats.typesDistribution,
            'flask',
            COLORS.red
          )}
          {renderDistributionCard(
            'Distribution par sexe',
            stats.genderDistribution,
            'people',
            COLORS.rose
          )}
          {renderDistributionCard(
            'Distribution par groupe d\'âge',
            stats.ageGroups,
            'calendar',
            COLORS.emerald
          )}
        </View>

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
  scroll: {
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING * 3,
    paddingVertical: SPACING * 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  // Section
  section: {
    paddingHorizontal: SPACING * 3,
    marginTop: SPACING * 3,
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING * 1.5,
  },
  statCard: {
    width: (width - SPACING * 9) / 2,
    borderRadius: RADIUS,
    padding: SPACING * 2.5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: SPACING * 0.5,
    textAlign: 'center',
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
    alignItems: 'center',
    gap: SPACING * 1.5,
    marginBottom: SPACING * 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  // Progress
  progressContainer: {
    marginTop: SPACING,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.borderLight,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.emerald,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Distribution Card
  distributionCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS,
    padding: SPACING * 2.5,
    marginBottom: SPACING * 2,
  },
  distributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING * 1.5,
    marginBottom: SPACING * 2,
  },
  distributionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  distributionItem: {
    marginBottom: SPACING * 2,
  },
  distributionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING,
  },
  distributionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  distributionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  distributionValue: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  distributionBar: {
    height: 10,
    backgroundColor: COLORS.borderLight,
    borderRadius: 5,
    overflow: 'hidden',
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: 5,
  },
});

export default StatisticsScreen;