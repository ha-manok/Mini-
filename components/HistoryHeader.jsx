import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';

const HistoryHeader = ({
  isSelectionMode,
  selectedCount,
  sortOrder,
  onBack,
  onClearSelection,
  onToggleSort
}) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2E5CFF" />
      </Pressable>
      
      <ThemedText style={styles.headerTitle}>
        {isSelectionMode ? `${selectedCount} Selected` : 'Calculation History'}
      </ThemedText>
      
      {isSelectionMode ? (
        <Pressable onPress={onClearSelection} style={styles.headerButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onToggleSort} style={styles.headerButton}>
          <Ionicons name="swap-vertical" size={20} color="#2E5CFF" />
        </Pressable>
      )}
    </View>
  );
};

export default HistoryHeader;

const styles = StyleSheet.create({
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
}); 