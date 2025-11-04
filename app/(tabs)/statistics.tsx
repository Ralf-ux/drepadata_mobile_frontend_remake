import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Users, FileText, Activity, Syringe, TrendingUp, Calendar } from 'lucide-react-native';
import {
  getPatients,
  getConsultations,
  getFollowUps,
  getVaccinationRecords,
} from '@/utils/storage';

const { width } = Dimensions.get('window');

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
    typesDistribution: {
      SS: 0,
      SC: 0,
      'Sβ⁰': 0,
      'Sβ⁺': 0,
      Autre: 0,
    },
    genderDistribution: {
      Masculin: 0,
      Féminin: 0,
    },
    ageGroups: {
      '0-5': 0,
      '6-12': 0,
      '13-18': 0,
      '19-30': 0,
      '31+': 0,
    },
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
    const recentPatients = patients.filter(
      p => new Date(p.created_at) > thirtyDaysAgo
    ).length;

    const patientsWithInitial = consultations.filter(
      c => c.consultation_type === 'initial'
    ).length;

    const typesDistribution = {
      SS: 0,
      SC: 0,
      'Sβ⁰': 0,
      'Sβ⁺': 0,
      Autre: 0,
    };
    patients.forEach(p => {
      if (p.type_de_drepanocytose in typesDistribution) {
        typesDistribution[p.type_de_drepanocytose as keyof typeof typesDistribution]++;
      } else {
        typesDistribution.Autre++;
      }
    });

    const genderDistribution = {
      Masculin: 0,
      Féminin: 0,
    };
    patients.forEach(p => {
      if (p.sexe === 'Masculin') genderDistribution.Masculin++;
      if (p.sexe === 'Féminin') genderDistribution.Féminin++;
    });

    const ageGroups = {
      '0-5': 0,
      '6-12': 0,
      '13-18': 0,
      '19-30': 0,
      '31+': 0,
    };
    patients.forEach(p => {
      const age = parseInt(p.age);
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

  const renderStatCard = (icon: React.ReactNode, title: string, value: string | number, color: string) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const getBarColors = () => ['#E84855', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  const renderDistributionCard = (title: string, data: Record<string, number>, icon: React.ReactNode) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const colors = getBarColors();
    
    return (
      <View style={styles.distributionCard}>
        <View style={styles.distributionHeader}>
          {icon}
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#dc3545']}
          tintColor="#dc3545"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistiques Générales</Text>
        <Text style={styles.headerSubtitle}>Vue d&apos;ensemble du système</Text>
      </View>

      <View style={styles.statsGrid}>
        {renderStatCard(
          <Users size={32} color="white" />,
          'Total Patients',
          stats.totalPatients,
          '#dc3545'
        )}
        {renderStatCard(
          <FileText size={32} color="white" />,
          'Consultations',
          stats.totalConsultations,
          '#007bff'
        )}
        {renderStatCard(
          <Activity size={32} color="white" />,
          'Suivis',
          stats.totalFollowUps,
          '#28a745'
        )}
        {renderStatCard(
          <Syringe size={32} color="white" />,
          'Vaccinations',
          stats.totalVaccinations,
          '#ffc107'
        )}
        {renderStatCard(
          <TrendingUp size={32} color="white" />,
          'Nouveaux (30j)',
          stats.recentPatients,
          '#17a2b8'
        )}
        {renderStatCard(
          <Calendar size={32} color="white" />,
          'Moyenne suivis/patient',
          stats.averageFollowUpsPerPatient,
          '#6c757d'
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Taux de consultation initiale</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${stats.totalPatients > 0 
                  ? (stats.patientsWithInitialConsultation / stats.totalPatients) * 100 
                  : 0}%` 
              }
            ]} 
          />
        </View>
        <Text style={styles.infoText}>
          {stats.patientsWithInitialConsultation} patients sur {stats.totalPatients} ont une consultation initiale
        </Text>
      </View>

      <View style={styles.distributionsContainer}>
        {renderDistributionCard(
          'Distribution par type de drépanocytose',
          stats.typesDistribution,
          <FileText size={20} color="#dc3545" />
        )}
        
        {renderDistributionCard(
          'Distribution par sexe',
          stats.genderDistribution,
          <Users size={20} color="#007bff" />
        )}
        
        {renderDistributionCard(
          'Distribution par groupe d\'âge',
          stats.ageGroups,
          <Calendar size={20} color="#28a745" />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#E84855',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold' as const,
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 44) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: 'white',
    marginTop: 12,
  },
  statTitle: {
    fontSize: 13,
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  infoCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 16,
  },
  progressBar: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 7,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  distributionsContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
    paddingBottom: 32,
  },
  distributionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  distributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  distributionTitle: {
    fontSize: 17,
    fontWeight: 'bold' as const,
    color: '#111827',
  },
  distributionItem: {
    marginBottom: 16,
  },
  distributionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distributionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  distributionLabel: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600' as const,
  },
  distributionValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  distributionBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: 5,
  },
});

export default StatisticsScreen;
