import React from 'react';
import { StyleSheet, View, Pressable, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ClearAllButton = ({ onClearAll, isClearing, isVisible }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.footer}>
      <Pressable 
        onPress={onClearAll} 
        style={[styles.clearAllButton, isClearing && styles.disabledButton]}
        disabled={isClearing}
      >
        {isClearing ? (
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
  );
};

export default ClearAllButton;

const styles = StyleSheet.create({
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