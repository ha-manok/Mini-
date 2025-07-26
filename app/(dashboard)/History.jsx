import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  RefreshControl,
  Share
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, orderBy, onSnapshot, doc, writeBatch, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useCalculationStorage } from '../../hooks/useCalculationStorage';
import ThemedView from '../../components/ThemedView';
import CalculationCard from '../../components/CalculationCard';
import HistoryHeader from '../../components/HistoryHeader';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import SelectionActions from '../../components/SelectionActions';
import ClearAllButton from '../../components/ClearAllButton';

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
              
              // Query ALL calculations from Firebase to ensure nothing is missed
              const calculationsRef = collection(db, 'users', userId, 'calculations');
              const snapshot = await getDocs(calculationsRef);
              
              console.log(`Found ${snapshot.size} calculations in Firebase to delete`);
              
              if (snapshot.size === 0) {
                console.log('No calculations found in Firebase');
              } else {
                // Delete all items from Firebase using batch
                const batch = writeBatch(db);
                
                snapshot.forEach((docSnapshot) => {
                  batch.delete(docSnapshot.ref);
                });
                
                await batch.commit();
                console.log(`Firebase batch delete completed - deleted ${snapshot.size} calculations`);
              }
              
              // Clear local storage as well
              await clearLocalStorage();
              console.log('Local storage cleared');
              
              // Note: Real-time listener will automatically update historyData
              // when documents are deleted from Firebase
              console.log('Waiting for real-time listener to update...');
              
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
    <CalculationCard
      item={item}
      isSelectionMode={isSelectionMode}
      isSelected={selectedItems.has(item.id)}
      onPress={handleItemPress}
      onLongPress={handleItemLongPress}
      formatDate={formatDate}
    />
  );

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <HistoryHeader
          isSelectionMode={false}
          selectedCount={0}
          sortOrder={sortOrder}
          onBack={() => router.back()}
          onClearSelection={clearSelection}
          onToggleSort={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        />
        <EmptyState type="loading" />
      </ThemedView>
    );
  }

  // Show empty state message if no calculations exist
  if (historyData.length === 0) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <HistoryHeader
          isSelectionMode={false}
          selectedCount={0}
          sortOrder={sortOrder}
          onBack={() => router.back()}
          onClearSelection={clearSelection}
          onToggleSort={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        />
        <EmptyState 
          type={!auth.currentUser ? "no-data" : "no-data"}
          onStartCalculating={() => router.push('/Calc')} 
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      {/* Header */}
      <HistoryHeader
        isSelectionMode={isSelectionMode}
        selectedCount={selectedItems.size}
        sortOrder={sortOrder}
        onBack={() => router.back()}
        onClearSelection={clearSelection}
        onToggleSort={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
      />

      {/* Search Bar */}
      {!isSelectionMode && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search calculations..."
        />
      )}

      {/* Selection Actions */}
      {isSelectionMode && (
        <SelectionActions onDelete={deleteSelected} />
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
        <EmptyState type="no-results" />
      ) : null}

      {/* Clear All Button */}
      <ClearAllButton
        onClearAll={clearAllHistory}
        isClearing={clearingAll}
        isVisible={!isSelectionMode && filteredData.length > 0}
      />
    </ThemedView>
  );
};

export default GradePointHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
});