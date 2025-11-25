/* SearchScreen.tsx – Professional Medical Search */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  getPatients,
  searchPatients,
  getConsultationsByPatientId,
  getFollowUpsByPatientId,
  type PatientProfile,
} from '@/utils/storage';

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

const SearchScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allPatients, setAllPatients] = useState<PatientProfile[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [patientStats, setPatientStats] = useState<Record<string, { consultations: number; followUps: number }>>({});

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchQuery, allPatients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patients = await getPatients();
      setAllPatients(patients);

      const stats: Record<string, { consultations: number; followUps: number }> = {};
      for (const patient of patients) {
        const consultations = await getConsultationsByPatientId(patient.id);
        const followUps = await getFollowUpsByPatientId(patient.id);
        stats[patient.id] = {
          consultations: consultations.length,
          followUps: followUps.length,
        };
      }
      setPatientStats(stats);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(allPatients);
      return;
    }

    try {
      const results = await searchPatients(searchQuery);
      setFilteredPatients(results);
    } catch (error) {
      console.error('Error searching patients:', error);
      setFilteredPatients([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  };

  const renderPatientCard = (patient: PatientProfile) => {
    const stats = patientStats[patient.id] || { consultations: 0, followUps: 0 };

    return (
      <TouchableOpacity
        key={patient.id}
        style={styles.patientCard}
        onPress={() => router.push(`/patient/${patient.id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.patientHeader}>
          <View style={styles.avatar}>
            <Icon name="person" size={28} color={COLORS.red} />
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>
              {patient.nom} {patient.prenom}
            </Text>
            <Text style={styles.patientId}>
              ID: {patient.numero_identification_unique}
            </Text>
            <Text style={styles.patientMeta}>
              {patient.age_diagnostic} ans • {patient.sexe} • {patient.type_de_drepanocytose}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="document-text" size={16} color={COLORS.rose} />
            <Text style={styles.statText}>{stats.consultations} consultation{stats.consultations > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="pulse" size={16} color={COLORS.emerald} />
            <Text style={styles.statText}>{stats.followUps} suivi{stats.followUps > 1 ? 's' : ''}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            Créé le {new Date(patient.created_at).toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => router.push(`/patient/${patient.id}` as any)}
          >
            <Text style={styles.viewBtnText}>Voir profil</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Icon name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom, ID ou dossier..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setSearchQuery('')}
            >
              <Icon name="close-circle" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.red} />
          <Text style={styles.loadingText}>Chargement des patients...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.results}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.red}
              colors={[COLORS.red]}
            />
          }
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} trouvé{filteredPatients.length !== 1 ? 's' : ''}
            </Text>
            {searchQuery.trim() && (
              <Text style={styles.queryText}>
                « {searchQuery} »
              </Text>
            )}
          </View>

          {filteredPatients.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Icon name="search" size={64} color={COLORS.border} />
              </View>
              <Text style={styles.emptyTitle}>
                {searchQuery.trim() ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery.trim()
                  ? 'Essayez un autre terme de recherche'
                  : 'Commencez par ajouter un patient'}
              </Text>
              {!searchQuery.trim() && (
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={() => router.push('/create-patient')}
                >
                  <Text style={styles.createBtnText}>+ Créer un patient</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.list}>
              {filteredPatients.map(renderPatientCard)}
            </View>
          )}
        </ScrollView>
      )}
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

  // Search Bar
  searchContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING * 3,
    paddingTop: SPACING * 2,
    paddingBottom: SPACING * 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS,
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.8,
    gap: SPACING,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  clearBtn: {
    padding: SPACING / 2,
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

  // Results
  results: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: SPACING * 3,
    paddingVertical: SPACING * 2,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultsCount: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  queryText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING / 2,
    fontStyle: 'italic',
  },

  // Patient Card
  list: {
    padding: SPACING * 3,
    gap: SPACING * 2,
  },
  patientCard: {
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
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING * 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.redBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING * 2,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  patientId: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  patientMeta: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: SPACING * 3,
    paddingVertical: SPACING * 1.5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING * 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING,
  },
  statText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textTertiary,
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
  createBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: SPACING * 4,
    paddingVertical: SPACING * 1.8,
    borderRadius: RADIUS,
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default SearchScreen;