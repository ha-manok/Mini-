import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import Spacer from '../components/Spacer';

const Terms = () => {
  return (
    <ThemedView safe={true} style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0D6EFD" />
        </Pressable>
        <View style={styles.titleWrapper}>
          <ThemedText style={styles.title} title>Terms & Conditions</ThemedText>
        </View>
      </View>

      <Spacer height={10} />

      <ThemedText style={styles.sectionTitle}>1. Acceptance of Terms</ThemedText>
      <ThemedText style={styles.content}>
        By using this CWA Calculator application, you agree to be bound by these terms and conditions.
      </ThemedText>

      <Spacer height={10} />

      <ThemedText style={styles.sectionTitle}>2. Use of the Application</ThemedText>
      <ThemedText style={styles.content}>
        This calculator is provided for educational purposes to help students estimate their Cumulative Weighted Average (CWA). Results are approximations and should not be considered official grades.
      </ThemedText>

      <Spacer height={10} />

      <ThemedText style={styles.sectionTitle}>3. Accuracy of Information</ThemedText>
      <ThemedText style={styles.content}>
        While we strive to provide accurate calculations, users are responsible for verifying all inputs and results with their academic institution.
      </ThemedText>

      <Spacer height={10} />

      <ThemedText style={styles.sectionTitle}>4. Privacy</ThemedText>
      <ThemedText style={styles.content}>
        We respect your privacy. Calculation data is stored locally on your device and is not transmitted to external servers.
      </ThemedText>

      <Spacer height={10} />

      <ThemedText style={styles.sectionTitle}>5. Limitation of Liability</ThemedText>
      <ThemedText style={styles.content}>
        The developers are not liable for any decisions made based on calculations from this application.
      </ThemedText>

      <Spacer height={10} />

      <ThemedText style={styles.lastUpdated}>
        Last updated: {new Date().toLocaleDateString()}
      </ThemedText>
    </ThemedView>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.7,
  },
});


