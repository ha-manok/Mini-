import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SelectionActions = ({ onDelete }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onDelete} style={styles.actionButton}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
        <Text style={styles.actionText}>Delete</Text>
      </Pressable>
    </View>
  );
};

export default SelectionActions;

const styles = StyleSheet.create({
  container: {
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
    color: '#EF4444',
  },
}); 