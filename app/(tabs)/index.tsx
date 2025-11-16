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
  Platform,
} from 'react-native';
import { store } from '@/redux/store';
import { clearCredentials } from '@/redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearAuthFromStorage } from '@/utils/authUtils';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, FileText, Users, UserPlus } from 'lucide-react-native';

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
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    loadStats();
    setGreetingMessage();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
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
      c => new Date(c.consultation_date) >= todayStart
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
      store.dispatch(clearCredentials());
      // Add a small delay to ensure Redux state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      await AsyncStorage.clear();
      await clearAuthFromStorage();
      router.replace('/(auth)/login');
      Toast.show({
        type: 'success',
        text1: 'Déconnecté',
        text2: 'Vous avez été déconnecté avec succès.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Échec de la déconnexion',
        text2: 'Une erreur s\'est produite lors de la déconnexion.',
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
        colors={['#E84855', '#D03744', '#C73543']}
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
            <Ionicons name="log-out-outline" size={22} color="#E84855" />
          </TouchableOpacity>
        </View>

        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>

      <Animated.View 
        style={[
          styles.contentContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Quick Stats Banner */}
        <View style={styles.quickStatsBanner}>
          <TouchableOpacity style={styles.quickStatItem} activeOpacity={0.7}>
            <View style={[styles.quickStatIconContainer, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="calendar-outline" size={22} color="#E84855" />
            </View>
            <View style={styles.quickStatTextContainer}>
              <Text style={styles.quickStatNumber}>{stats.todayConsultations}</Text>
              <Text style={styles.quickStatLabel}>Aujourd'hui</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.quickStatDivider} />

          <TouchableOpacity style={styles.quickStatItem} activeOpacity={0.7}>
            <View style={[styles.quickStatIconContainer, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="alert-circle-outline" size={22} color="#F59E0B" />
            </View>
            <View style={styles.quickStatTextContainer}>
              <Text style={styles.quickStatNumber}>{stats.urgentFollowUps}</Text>
              <Text style={styles.quickStatLabel}>Urgents</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.quickStatDivider} />

          <TouchableOpacity style={styles.quickStatItem} activeOpacity={0.7}>
            <View style={[styles.quickStatIconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="people-outline" size={22} color="#10B981" />
            </View>
            <View style={styles.quickStatTextContainer}>
              <Text style={styles.quickStatNumber}>{stats.recentPatients}</Text>
              <Text style={styles.quickStatLabel}>Nouveaux</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Enhanced Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.7}
        >
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#E84855" />
          </View>
          <Text style={styles.searchPlaceholder}>Rechercher un patient...</Text>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>

        {/* Enhanced Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <Text style={styles.sectionSubtitle}>Accès direct aux fonctionnalités</Text>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/create-patient')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#E84855', '#D03744']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionContent}>
                  <View style={styles.actionIconLarge}>
                    <UserPlus size={30} color="white" strokeWidth={2.5} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Nouveau{'\n'}Patient</Text>
                    <Text style={styles.actionSubtitle}>Ajouter un patient</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.9)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/consultations')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionContent}>
                  <View style={styles.actionIconLarge}>
                    <FileText size={30} color="white" strokeWidth={2.5} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Consultations</Text>
                    <Text style={styles.actionSubtitle}>Voir les consultations</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.9)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/statistics')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionContent}>
                  <View style={styles.actionIconLarge}>
                    <Activity size={30} color="white" strokeWidth={2.5} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Statistiques</Text>
                    <Text style={styles.actionSubtitle}>Analyser les données</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.9)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/search')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionContent}>
                  <View style={styles.actionIconLarge}>
                    <Users size={30} color="white" strokeWidth={2.5} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Tous les{'\n'}patients</Text>
                    <Text style={styles.actionSubtitle}>Liste complète</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.9)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vue d&apos;ensemble</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/statistics')}>
              <Text style={styles.seeAllText}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: 'white' }]}
              onPress={() => router.push('/(tabs)/search')}
              activeOpacity={0.7}
            >
              <View style={styles.statCardHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FEF2F2' }]}>
                  <Users size={24} color="#E84855" strokeWidth={2.5} />
                </View>
                <View style={styles.statTrendBadge}>
                  <Ionicons name="trending-up" size={14} color="#10B981" />
                </View>
              </View>
              <Text style={styles.statNumber}>{stats.totalPatients}</Text>
              <Text style={styles.statLabel}>Total Patients</Text>
              <View style={styles.statFooter}>
                <View style={[styles.statBadge, { backgroundColor: '#FEF2F2' }]}>
                  <View style={styles.statBadgeDot} />
                  <Text style={[styles.statBadgeText, { color: '#E84855' }]}>Actif</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: 'white' }]}
              onPress={() => router.push('/(tabs)/consultations')}
              activeOpacity={0.7}
            >
              <View style={styles.statCardHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: '#EFF6FF' }]}>
                  <FileText size={24} color="#3B82F6" strokeWidth={2.5} />
                </View>
                <View style={styles.statTrendBadge}>
                  <Ionicons name="calendar" size={14} color="#64748B" />
                </View>
              </View>
              <Text style={styles.statNumber}>{stats.totalConsultations}</Text>
              <Text style={styles.statLabel}>Consultations</Text>
              <View style={styles.statFooter}>
                <View style={[styles.statBadge, { backgroundColor: '#EFF6FF' }]}>
                  <View style={[styles.statBadgeDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={[styles.statBadgeText, { color: '#3B82F6' }]}>Total</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: 'white' }]}
              onPress={() => router.push('/(tabs)/consultations')}
              activeOpacity={0.7}
            >
              <View style={styles.statCardHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <Activity size={24} color="#10B981" strokeWidth={2.5} />
                </View>
                <View style={styles.statTrendBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                </View>
              </View>
              <Text style={styles.statNumber}>{stats.totalFollowUps}</Text>
              <Text style={styles.statLabel}>Suivis</Text>
              <View style={styles.statFooter}>
                <View style={[styles.statBadge, { backgroundColor: '#F0FDF4' }]}>
                  <View style={[styles.statBadgeDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.statBadgeText, { color: '#10B981' }]}>En cours</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: 'white' }]}
              onPress={() => router.push('/(tabs)/search')}
              activeOpacity={0.7}
            >
              <View style={styles.statCardHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FFFBEB' }]}>
                  <UserPlus size={24} color="#F59E0B" strokeWidth={2.5} />
                </View>
                <View style={styles.statTrendBadge}>
                  <Ionicons name="time" size={14} color="#64748B" />
                </View>
              </View>
              <Text style={styles.statNumber}>{stats.recentPatients}</Text>
              <Text style={styles.statLabel}>Nouveaux</Text>
              <View style={styles.statFooter}>
                <View style={[styles.statBadge, { backgroundColor: '#FFFBEB' }]}>
                  <View style={[styles.statBadgeDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={[styles.statBadgeText, { color: '#F59E0B' }]}>30 jours</Text>
                </View>
              </View>
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
            <TouchableOpacity style={styles.activityItem} onPress={() => router.push('/(tabs)/search')} activeOpacity={0.7}>
              <View style={[styles.activityIcon, { backgroundColor: '#FEF2F2' }]}>
                <UserPlus size={22} color="#E84855" strokeWidth={2.5} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Nouveaux patients</Text>
                <Text style={styles.activityDescription}>{stats.recentPatients} patient(s) ajouté(s) ce mois</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>

            <View style={styles.activityDivider} />

            <TouchableOpacity style={styles.activityItem} onPress={() => router.push('/(tabs)/consultations')} activeOpacity={0.7}>
              <View style={[styles.activityIcon, { backgroundColor: '#EFF6FF' }]}>
                <FileText size={22} color="#3B82F6" strokeWidth={2.5} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Consultations du jour</Text>
                <Text style={styles.activityDescription}>{stats.todayConsultations} consultation(s) aujourd'hui</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>

            <View style={styles.activityDivider} />

            <TouchableOpacity style={styles.activityItem} onPress={() => router.push('/(tabs)/consultations')} activeOpacity={0.7}>
              <View style={[styles.activityIcon, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="alert-circle" size={22} color="#F59E0B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Suivis urgents</Text>
                <Text style={styles.activityDescription}>{stats.urgentFollowUps} suivi(s) nécessite(nt) attention</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsSection}>
          <LinearGradient
            colors={['#FFFBEB', '#FEF3C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tipsCard}
          >
            <View style={styles.tipsHeader}>
              <View style={styles.tipsIconContainer}>
                <Ionicons name="bulb" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.tipsTitle}>Conseil du jour</Text>
            </View>
            <Text style={styles.tipsContent}>
              N'oubliez pas de mettre à jour régulièrement les informations de vos patients et de planifier les suivis nécessaires pour assurer un suivi optimal.
            </Text>
          </LinearGradient>
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
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    bottom: -30,
    left: -30,
  },
  headerContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 1,
    paddingTop: 40,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
  },
  contentContainer: {
    marginTop: -20,
  },
  quickStatsBanner: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 20,
  },
  quickStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickStatIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatTextContainer: {
    flex: 1,
  },
  quickStatNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    height: 44,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 28,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  seeAllText: {
    fontSize: 14,
    color: '#E84855',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  actionCard: {
    width: (width - 54) / 2,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  actionGradient: {
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  actionContent: {
    flex: 1,
  },
  actionIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTextContainer: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  actionSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    lineHeight: 18,
  },
  actionArrow: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 54) / 2,
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTrendBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -1.5,
  },
  statLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 14,
  },
  statFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  statBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E84855',
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  recentActivity: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  activityDescription: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 18,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  tipsCard: {
    borderRadius: 22,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  tipsIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: -0.3,
  },
  tipsContent: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 22,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 32,
  },
});

export default HomeScreen;