import React from 'react';
import { StyleSheet, View, Pressable, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthState } from '../hooks/useAuthState';
import ThemedText from './ThemedText';
import Spacer from './Spacer';

const EmptyState = ({ 
  type, // 'loading', 'no-data', 'no-results'
  onStartCalculating 
}) => {
  const { isAuthenticated } = useAuthState();
  
  const renderContent = () => {
    switch (type) {
      case 'loading':
        return (
          <>
            <ActivityIndicator size="large" color="#2E5CFF" />
            <ThemedText style={styles.loadingText}>Loading calculations...</ThemedText>
          </>
        );
      
      case 'no-data':
        return (
          <>
            <Ionicons name="calculator-outline" size={64} color="#9CA3AF" />
            <ThemedText style={styles.title}>
              {isAuthenticated ? 'No Calculations Yet' : 'No Saved Calculations'}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {isAuthenticated 
                ? 'Your GradePoint calculations will appear here' 
                : 'Log in to save and view your calculation history'
              }
            </ThemedText>
            <Spacer height={20} />
            <Pressable
              onPress={onStartCalculating}
              style={styles.actionButton}
            >
              <Ionicons name="calculator" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>
                {isAuthenticated ? 'Start Calculating' : 'Try Calculator'}
              </Text>
            </Pressable>
          </>
        );
      
      case 'no-results':
        return (
          <>
            <Ionicons name="search-outline" size={64} color="#9CA3AF" />
            <ThemedText style={styles.title}>No Results Found</ThemedText>
            <ThemedText style={styles.subtitle}>
              Try adjusting your search terms
            </ThemedText>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E5CFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 