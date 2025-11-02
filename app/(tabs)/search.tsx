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
import { Search as SearchIcon, User, FileText, Activity } from 'lucide-react-native';
import {
  getPatients,
  searchPatients,
  getConsultationsByPatientId,
  getFollowUpsByPatientId,
  type PatientProfile,
} from '@/utils/storage';

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
      >
        <View style={styles.patientCardHeader}>
          <View style={styles.avatarContainer}>
            <User size={32} color="#dc3545" />
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>
              {patient.nom} {patient.prenom}
            </Text>
            <Text style={styles.patientDetail}>
              ID: {patient.numero_identification_unique}
            </Text>
            <Text style={styles.patientDetail}>
              {patient.age} ans • {patient.sexe} • {patient.type_de_drepanocytose}
            </Text>
          </View>
        </View>

        <View style={styles.patientCardStats}>
          <View style={styles.statItem}>
            <FileText size={16} color="#007bff" />
            <Text style={styles.statText}>{stats.consultations} consultations</Text>
          </View>
          <View style={styles.statItem}>
            <Activity size={16} color="#28a745" />
            <Text style={styles.statText}>{stats.followUps} suivis</Text>
          </View>
        </View>

        <View style={styles.patientCardFooter}>
          <Text style={styles.footerText}>
            Créé le: {new Date(patient.created_at).toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => router.push(`/patient/${patient.id}` as any)}
          >
            <Text style={styles.viewButtonText}>Voir profil →</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <View style={styles.searchIcon}>
            <SearchIcon size={20} color="#6c757d" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom, prénom ou N° dossier..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc3545" />
          <Text style={styles.loadingText}>Chargement des patients...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.resultsContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#dc3545']}
              tintColor="#dc3545"
            />
          }
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} trouvé{filteredPatients.length !== 1 ? 's' : ''}
            </Text>
            {searchQuery.trim() && (
              <Text style={styles.searchQueryDisplay}>
                Recherche: "{searchQuery}"
              </Text>
            )}
          </View>

          {filteredPatients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <SearchIcon size={64} color="#e9ecef" />
              <Text style={styles.emptyTitle}>
                {searchQuery.trim() ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
              </Text>
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? 'Essayez avec un autre terme de recherche'
                  : 'Commencez par créer un nouveau patient'}
              </Text>
              {!searchQuery.trim() && (
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push('/create-patient')}
                >
                  <Text style={styles.createButtonText}>+ Créer un patient</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.patientsList}>
              {filteredPatients.map(renderPatientCard)}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#495057',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#6c757d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  searchQueryDisplay: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  patientsList: {
    padding: 16,
  },
  patientCard: {
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
  patientCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 4,
  },
  patientDetail: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 2,
  },
  patientCardStats: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#495057',
  },
  patientCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
  },
  viewButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
  createButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SearchScreen;
