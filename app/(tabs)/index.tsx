import { getConsultations, getFollowUps, getPatients } from '@/utils/storage';
import { Ionicons as Activity, Ionicons as FileText, Ionicons as SearchIcon, Ionicons as UserPlus, Ionicons as Users } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalConsultations: 0,
    totalFollowUps: 0,
    recentPatients: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const patients = await getPatients();
    const consultations = await getConsultations();
    const followUps = await getFollowUps();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentPatients = patients.filter(
      p => new Date(p.created_at) > thirtyDaysAgo
    ).length;

    setStats({
      totalPatients: patients.length,
      totalConsultations: consultations.length,
      totalFollowUps: followUps.length,
      recentPatients,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#E84855']}
          tintColor="#E84855"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tableau de bord</Text>
        <Text style={styles.headerSubtitle}>Gestion des patients drépanocytaires</Text>
      </View>

      <TouchableOpacity 
        style={styles.searchBar}
        onPress={() => router.push('/(tabs)/search')}
      >
        <SearchIcon name="search" size={20} color="#9CA3AF" />
        <Text style={styles.searchPlaceholder}>Rechercher un patient...</Text>
      </TouchableOpacity>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFE5E5' }]}
            onPress={() => router.push('/create-patient')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E84855' }]}>
              <UserPlus name="person-add" size={24} color="white" />
            </View>
<<<<<<< HEAD
            <Text style={styles.actionLabel}>Nouveau Patient</Text>
=======
            <Text style={styles.actionLabel}>Nouveau{`\n`}Patient</Text>
>>>>>>> cd25b5d588c37a9ae4351709534b0f2b97b35579
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#E8F5FF' }]}
            onPress={() => router.push('/(tabs)/consultations')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
              <FileText name="document-text" size={24} color="white" />
            </View>
<<<<<<< HEAD
            <Text style={styles.actionLabel}>Consultations</Text>
=======
            <Text style={styles.actionLabel}>Consulta-{`\n`}tions</Text>
>>>>>>> cd25b5d588c37a9ae4351709534b0f2b97b35579
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#E8F9F1' }]}
            onPress={() => router.push('/(tabs)/statistics')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <Activity name="bar-chart" size={24} color="white" />
            </View>
<<<<<<< HEAD
            <Text style={styles.actionLabel}>Statistiques</Text>
=======
            <Text style={styles.actionLabel}>Statis-{`\n`}tiques</Text>
>>>>>>> cd25b5d588c37a9ae4351709534b0f2b97b35579
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFF4E5' }]}
            onPress={() => router.push('/(tabs)/search')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
              <Users name="people" size={24} color="white" />
            </View>
<<<<<<< HEAD
            <Text style={styles.actionLabel}>Tous les patients</Text>
=======
            <Text style={styles.actionLabel}>Tous les{`\n`}patients</Text>
>>>>>>> cd25b5d588c37a9ae4351709534b0f2b97b35579
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Vue d&apos;ensemble</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statNumber}>{stats.totalPatients}</Text>
              <View style={[styles.statIconSmall, { backgroundColor: '#FFE5E5' }]}>
                <Users name="people" size={16} color="#E84855" />
              </View>
            </View>
            <Text style={styles.statLabel}>Total Patients</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statNumber}>{stats.totalConsultations}</Text>
              <View style={[styles.statIconSmall, { backgroundColor: '#E8F5FF' }]}>
                <FileText name="document-text" size={16} color="#3B82F6" />
              </View>
            </View>
            <Text style={styles.statLabel}>Consultations</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statNumber}>{stats.totalFollowUps}</Text>
              <View style={[styles.statIconSmall, { backgroundColor: '#E8F9F1' }]}>
                <Activity name="bar-chart" size={16} color="#10B981" />
              </View>
            </View>
            <Text style={styles.statLabel}>Suivis</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statNumber}>{stats.recentPatients}</Text>
              <View style={[styles.statIconSmall, { backgroundColor: '#FFF4E5' }]}>
                <UserPlus name="person-add" size={16} color="#F59E0B" />
              </View>
            </View>
            <Text style={styles.statLabel}>Nouveaux (30j)</Text>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  quickActions: {
    paddingHorizontal: 20,
<<<<<<< HEAD
    marginBottom: -48,
=======
    marginBottom: 24,
>>>>>>> cd25b5d588c37a9ae4351709534b0f2b97b35579
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
<<<<<<< HEAD
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    aspectRatio: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
=======
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
>>>>>>> cd25b5d588c37a9ae4351709534b0f2b97b35579
    minHeight: 120,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
<<<<<<< HEAD
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 16,
    textAlign: 'center',
=======
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 18,
>>>>>>> cd25b5d588c37a9ae4351709534b0f2b97b35579
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
<<<<<<< HEAD
    marginTop: -48,
=======
>>>>>>> cd25b5d588c37a9ae4351709534b0f2b97b35579
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: (width - 52) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  statIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default HomeScreen;