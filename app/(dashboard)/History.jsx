import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  Alert,
  FlatList,
  RefreshControl,
  Share,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig'; // Adjust path as needed
import { useCalculationStorage } from '../../hooks/useCalculationStorage';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedCard from '../../components/ThemedCard';
import ThemedTextInput from '../../components/ThemedTextInput';
import Spacer from '../../components/Spacer';

const GradePointHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest');
  const [clearingAll, setClearingAll] = useState(false);

  const router = useRouter();
  const { clearLocalStorage } = useCalculationStorage();
  
  // Ref to store the unsubscribe function
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const unsubscribe = loadHistory();
    unsubscribeRef.current = unsubscribe;
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [historyData, searchQuery, sortOrder]);

  const loadHistory = () => {
    if (!auth.currentUser) {
      setLoading(false);
      setHistoryData([]);
      return;
    }

    const userId = auth.currentUser.uid;
    const calculationsRef = collection(db, 'users', userId, 'calculations');
    const q = query(calculationsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const calculations = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          calculations.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          });
        });
        console.log(`Firebase listener received ${calculations.length} calculations`);
        setHistoryData(calculations);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading calculations:', error);
        Alert.alert('Error', 'Failed to load calculation history');
        setLoading(false);
        setHistoryData([]);
      }
    );

    return unsubscribe;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // The real-time listener will automatically update the data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filterAndSortData = () => {
    let filtered = historyData;

    // Apply text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.currentCwa?.toString().includes(searchQuery) ||
        item.previousCredit?.toString().includes(searchQuery) ||
        item.semesterCredit?.toString().includes(searchQuery) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
    });

    setFilteredData(filtered);
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const handleItemPress = (item) => {
    if (isSelectionMode) {
      toggleSelection(item.id);
    } else {
      showCalculationDetails(item);
    }
  };

  const handleItemLongPress = (item) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedItems(new Set([item.id]));
    }
  };

  const toggleSelection = (id) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
    
    if (newSelection.size === 0) {
      setIsSelectionMode(false);
    }
  };

  const showCalculationDetails = (item) => {
    Alert.alert(
      'Calculation Details',
      `Current CWA: ${item.currentCwa}\nPrevious Credits: ${item.previousCredit}\nSemester Credits: ${item.semesterCredit}\nBest Projection: ${item.bestProjection}\nNotes: ${item.notes || 'No notes'}`,
      [
        { text: 'Reuse Values', onPress: () => reuseCalculation(item) },
        { text: 'Share', onPress: () => shareCalculation(item) },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const reuseCalculation = (item) => {
    Alert.alert(
      'Reuse Calculation',
      'This will open the calculator with these values pre-filled.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Calculator', 
          onPress: () => {
            router.push({
              pathname: '/Calc',
              params: {
                currentCwa: item.currentCwa?.toString() || '',
                previousCredit: item.previousCredit?.toString() || '',
                semesterCredit: item.semesterCredit?.toString() || ''
              }
            });
          }
        }
      ]
    );
  };

  const shareCalculation = async (item) => {
    try {
      const shareText = `GradePoint Calculation:\n\nCurrent CWA: ${item.currentCwa}\nPrevious Credits: ${item.previousCredit}\nSemester Credits: ${item.semesterCredit}\nBest Projection: ${item.bestProjection}\nDate: ${formatDate(item.timestamp)}\n\nCalculated with GradePoint Calculator`;
      
      await Share.share({
        message: shareText,
        title: 'GradePoint Calculation'
      });
    } catch (error) {
      console.error('Error sharing calculation:', error);
    }
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  const deleteSelected = async () => {
    Alert.alert(
      'Delete Calculations',
      `Are you sure you want to delete ${selectedItems.size} calculation(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = auth.currentUser.uid;
              const batch = writeBatch(db);
              
              selectedItems.forEach(id => {
                const docRef = doc(db, 'users', userId, 'calculations', id);
                batch.delete(docRef);
              });
              
              await batch.commit();
              
              // Manually update local state to immediately reflect changes
              const updatedHistory = historyData.filter(item => !selectedItems.has(item.id));
              setHistoryData(updatedHistory);
              
              clearSelection();
            } catch (error) {
              console.error('Error deleting calculations:', error);
              Alert.alert('Error', 'Failed to delete calculations');
            }
          }
        }
      ]
    );
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all calculation history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearingAll(true);
              
              if (!auth.currentUser) {
                Alert.alert('Error', 'You must be logged in to clear history');
                return;
              }

              const userId = auth.currentUser.uid;
              const batch = writeBatch(db);
              
              // Delete all items from Firebase
              console.log(`Deleting ${historyData.length} calculations from Firebase`);
              historyData.forEach(item => {
                const docRef = doc(db, 'users', userId, 'calculations', item.id);
                batch.delete(docRef);
              });
              
              await batch.commit();
              console.log('Firebase batch delete completed');
              
              // Clear local storage as well
              await clearLocalStorage();
              console.log('Local storage cleared');
              
              // Manually update local state to immediately reflect changes
              setHistoryData([]);
              setFilteredData([]);
              console.log('Local state updated to empty arrays');
              
              clearSelection();
              
              Alert.alert(
                'Success', 
                'All calculation history has been cleared from both local and cloud storage.',
                [{ text: 'OK' }]
              );
              
            } catch (error) {
              console.error('Error clearing all history:', error);
              Alert.alert(
                'Error', 
                'Failed to clear all history. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setClearingAll(false);
            }
          }
        }
      ]
    );
  };

  const renderHistoryItem = ({ item }) => (
    <Pressable
      onPress={() => handleItemPress(item)}
      onLongPress={() => handleItemLongPress(item)}
      style={[
        styles.historyItem,
        isSelectionMode && selectedItems.has(item.id) && styles.selectedItem
      ]}
    >
      <ThemedCard style={styles.calculationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.calculationInfo}>
            <View style={styles.cwaContainer}>
              <ThemedText style={styles.cwaLabel}>Current CWA</ThemedText>
              <ThemedText style={styles.cwaValue}>{item.currentCwa}</ThemedText>
            </View>
            <View style={styles.projectionContainer}>
              <ThemedText style={styles.projectionLabel}>Best Projection</ThemedText>
              <ThemedText style={[styles.projectionValue, { color: item.targetAchievable ? '#10B981' : '#EF4444' }]}>
                {item.bestProjection}
              </ThemedText>
            </View>
          </View>
          {isSelectionMode && (
            <Ionicons
              name={selectedItems.has(item.id) ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={selectedItems.has(item.id) ? '#2E5CFF' : '#9CA3AF'}
            />
          )}
        </View>

        <Spacer height={12} />

        <View style={styles.creditsRow}>
          <View style={styles.creditItem}>
            <ThemedText style={styles.creditLabel}>Previous Credits</ThemedText>
            <ThemedText style={styles.creditValue}>{item.previousCredit}</ThemedText>
          </View>
          <View style={styles.creditItem}>
            <ThemedText style={styles.creditLabel}>Semester Credits</ThemedText>
            <ThemedText style={styles.creditValue}>{item.semesterCredit}</ThemedText>
          </View>
        </View>

        <Spacer height={8} />

        {item.notes && (
          <View style={styles.notesContainer}>
            <Ionicons name="document-text-outline" size={14} color="#6B7280" />
            <ThemedText style={styles.notesText}>{item.notes}</ThemedText>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.statusContainer}>
            <Ionicons
              name={item.targetAchievable ? 'checkmark-circle' : 'alert-circle'}
              size={16}
              color={item.targetAchievable ? '#10B981' : '#F59E0B'}
            />
            <ThemedText style={[styles.statusText, { color: item.targetAchievable ? '#10B981' : '#F59E0B' }]}>
              {item.targetAchievable ? 'Good Performance Possible' : 'Limited Improvement Range'}
            </ThemedText>
          </View>
          <ThemedText style={styles.timestamp}>{formatDate(item.timestamp)}</ThemedText>
        </View>
      </ThemedCard>
    </Pressable>
  );

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2E5CFF" />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Calculation History</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E5CFF" />
          <ThemedText style={styles.loadingText}>Loading calculations...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Show empty state message if no calculations exist
  if (historyData.length === 0) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2E5CFF" />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Calculation History</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="calculator-outline" size={64} color="#9CA3AF" />
          <ThemedText style={styles.emptyTitle}>No Calculations Yet</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Your GradePoint calculations will appear here
          </ThemedText>
          <Spacer height={20} />
          <Pressable
            onPress={() => router.push('/Calc')}
            style={styles.calculatorButton}
          >
            <Ionicons name="calculator" size={20} color="#fff" />
            <Text style={styles.calculatorButtonText}>Start Calculating</Text>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2E5CFF" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>
          {isSelectionMode ? `${selectedItems.size} Selected` : 'Calculation History'}
        </ThemedText>
        {isSelectionMode ? (
          <Pressable onPress={clearSelection} style={styles.headerButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} style={styles.headerButton}>
            <Ionicons name="swap-vertical" size={20} color="#2E5CFF" />
          </Pressable>
        )}
      </View>

      {/* Search Bar */}
      {!isSelectionMode && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <ThemedTextInput
            placeholder="Search calculations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      )}

      {/* Selection Actions */}
      {isSelectionMode && (
        <View style={styles.selectionActions}>
          <Pressable onPress={deleteSelected} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
          </Pressable>
        </View>
      )}

      {/* History List */}
      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery.trim() ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#9CA3AF" />
          <ThemedText style={styles.emptyTitle}>No Results Found</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Try adjusting your search terms
          </ThemedText>
        </View>
      ) : null}

      {/* Clear All Button */}
      {!isSelectionMode && filteredData.length > 0 && (
        <View style={styles.footer}>
          <Pressable 
            onPress={clearAllHistory} 
            style={[styles.clearAllButton, clearingAll && styles.disabledButton]}
            disabled={clearingAll}
          >
            {clearingAll ? (
              <>
                <ActivityIndicator size="small" color="#EF4444" />
                <Text style={styles.clearAllText}>Clearing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={styles.clearAllText}>Clear All History</Text>
              </>
            )}
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
};

export default GradePointHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
  cancelText: {
    color: '#2E5CFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    marginBottom: 12,
  },
  selectedItem: {
    opacity: 0.8,
  },
  calculationCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  calculationInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cwaContainer: {
    alignItems: 'flex-start',
  },
  cwaLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  cwaValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  projectionContainer: {
    alignItems: 'flex-end',
  },
  projectionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  projectionValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  creditsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditItem: {
    alignItems: 'center',
    flex: 1,
  },
  creditLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  creditValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  notesText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  calculatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E5CFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  calculatorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: '#F3F4F6',
  },
  clearAllText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});