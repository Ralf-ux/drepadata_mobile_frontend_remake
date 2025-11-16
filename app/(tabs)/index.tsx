import { getConsultations, getFollowUps, getPatients } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
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
  Animated,
} from 'react-native';
import { logout } from '@/utils/authUtils';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalConsultations: 0,
    totalFollowUps: 0,
    recentPatients: 0,
    todayConsultations: 0,
    urgentFollowUps: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadStats();
    setGreetingMessage();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  };

  const loadStats = async () => {
    const patients = await getPatients();
    const consultations = await getConsultations();
    const followUps = await getFollowUps();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    
    const recentPatients = patients.filter(
      p => new Date(p.created_at) > thirtyDaysAgo
    ).length;

    const todayConsultations = consultations.filter(
      c => new Date(c.date) >= todayStart
    ).length;

    const urgentFollowUps = followUps.filter(
      f => f.priority === 'urgent' || f.priority === 'high'
    ).length;

    setStats({
      totalPatients: patients.length,
      totalConsultations: consultations.length,
      totalFollowUps: followUps.length,
      recentPatients,
      todayConsultations,
      urgentFollowUps,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'An error occurred during logout.',
      });
    }
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
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#E84855', '#C73543']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.headerTitle}>Tableau de bord</Text>
            <Text style={styles.headerSubtitle}>Gestion des patients drépanocytaires</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E84855" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        {/* Quick Stats Banner */}
        <View style={styles.quickStatsBanner}>
          <View style={styles.quickStatItem}>
            <View style={styles.quickStatIconContainer}>
              <Ionicons name="calendar-outline" size={20} color="#E84855" />
            </View>
            <View>
              <Text style={styles.quickStatNumber}>{stats.todayConsultations}</Text>
              <Text style={styles.quickStatLabel}>Aujourd'hui</Text>
            </View>
          </View>

          <View style={styles.quickStatDivider} />

          <View style={styles.quickStatItem}>
            <View style={styles.quickStatIconContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.quickStatNumber}>{stats.urgentFollowUps}</Text>
              <Text style={styles.quickStatLabel}>Urgents</Text>
            </View>
          </View>

          <View style={styles.quickStatDivider} />

          <View style={styles.quickStatItem}>
            <View style={styles.quickStatIconContainer}>
              <Ionicons name="people-outline" size={20} color="#10B981" />
            </View>
            <View>
              <Text style={styles.quickStatNumber}>{stats.recentPatients}</Text>
              <Text style={styles.quickStatLabel}>Nouveaux</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('./search')}
          activeOpacity={0.7}
        >
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#E84855" />
          </View>
          <Text style={styles.searchPlaceholder}>Rechercher un patient...</Text>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>

      {/* Stats Cards - Now at the top */}
      <View style={styles.statsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vue d&apos;ensemble</Text>
          <TouchableOpacity onPress={() => router.push('./statistics')}>
            <Text style={styles.seeAllText}>Voir tout →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#FFF1F2' }]}
            onPress={() => router.push('./search')}
            activeOpacity={0.7}
          >
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: '#E84855' }]}>
                <Ionicons name="people" size={22} color="white" />
              </View>
              <Ionicons name="trending-up" size={16} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{stats.totalPatients}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
            <View style={styles.statFooter}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>Actif</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}
            onPress={() => router.push('./consultations')}
            activeOpacity={0.7}
          >
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="document-text" size={22} color="white" />
              </View>
              <Ionicons name="calendar" size={16} color="#64748B" />
            </View>
            <Text style={styles.statNumber}>{stats.totalConsultations}</Text>
            <Text style={styles.statLabel}>Consultations</Text>
            <View style={styles.statFooter}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>Total</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}
            activeOpacity={0.7}
          >
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: '#10B981' }]}>
                <Ionicons name="bar-chart" size={22} color="white" />
              </View>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{stats.totalFollowUps}</Text>
            <Text style={styles.statLabel}>Suivis</Text>
            <View style={styles.statFooter}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>En cours</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}
            activeOpacity={0.7}
          >
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="person-add" size={22} color="white" />
              </View>
              <Ionicons name="time" size={16} color="#64748B" />
            </View>
            <Text style={styles.statNumber}>{stats.recentPatients}</Text>
            <Text style={styles.statLabel}>Nouveaux</Text>
            <View style={styles.statFooter}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>30 jours</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Quick Actions */}
      <View style={styles.quickActions}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <Text style={styles.sectionSubtitle}>Accès direct aux fonctionnalités</Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('../create-patient')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#E84855', '#C73543']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionIconLarge}>
                <Ionicons name="person-add" size={28} color="white" />
              </View>
              <Text style={styles.actionTitle}>Nouveau Patient</Text>
              <Text style={styles.actionSubtitle}>Ajouter un patient</Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.8)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('./consultations')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionIconLarge}>
                <Ionicons name="document-text" size={28} color="white" />
              </View>
              <Text style={styles.actionTitle}>Consultations</Text>
              <Text style={styles.actionSubtitle}>Voir les consultations</Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.8)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('./statistics')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionIconLarge}>
                <Ionicons name="bar-chart" size={28} color="white" />
              </View>
              <Text style={styles.actionTitle}>Statistiques</Text>
              <Text style={styles.actionSubtitle}>Analyser les données</Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.8)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('./search')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <View style={styles.actionIconLarge}>
                <Ionicons name="people" size={28} color="white" />
              </View>
              <Text style={styles.actionTitle}>Tous les patients</Text>
              <Text style={styles.actionSubtitle}>Liste complète</Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.8)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.recentActivity}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Voir tout →</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="person-add" size={20} color="#E84855" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Nouveaux patients</Text>
              <Text style={styles.activityDescription}>{stats.recentPatients} patient(s) ajouté(s) ce mois</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </View>

          <View style={styles.activityDivider} />

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="document-text" size={20} color="#3B82F6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Consultations du jour</Text>
              <Text style={styles.activityDescription}>{stats.todayConsultations} consultation(s) aujourd'hui</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </View>

          <View style={styles.activityDivider} />

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="alert-circle" size={20} color="#F59E0B" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Suivis urgents</Text>
              <Text style={styles.activityDescription}>{stats.urgentFollowUps} suivi(s) nécessite(nt) attention</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </View>
        </View>
      </View>

      {/* Quick Tips Card */}
      <View style={styles.tipsSection}>
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
            <Text style={styles.tipsTitle}>Conseil du jour</Text>
          </View>
          <Text style={styles.tipsContent}>
            N'oubliez pas de mettre à jour régulièrement les informations de vos patients et de planifier les suivis nécessaires.
          </Text>
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    marginTop: -16,
  },
  quickStatsBanner: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  quickStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quickStatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: '#E84855',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 12,
  },
  statFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  
  
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  actionGradient: {
    padding: 20,
    minHeight: 170,
    justifyContent: 'space-between',
  },
  actionIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    marginBottom: 8,
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  recentActivity: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tipsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  tipsContent: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 24,
  },
});

export default HomeScreen;