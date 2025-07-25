import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'
import ThemedButton from './ThemedButton'
import Spacer from './Spacer'

const Terms = ({ onBack }) => {
  return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedText style={styles.title}>Terms & Conditions</ThemedText>
        
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
        
        <Spacer height={10}/>
        
        <ThemedText style={styles.sectionTitle}>4. Privacy</ThemedText>
        <ThemedText style={styles.content}>
          We respect your privacy. Calculation data is stored locally on your device and is not transmitted to external servers.
        </ThemedText>
        
        <Spacer height={10} />
        
        <ThemedText style={styles.sectionTitle}>5. Limitation of Liability</ThemedText>
        <ThemedText style={styles.content}>
          The developers are not liable for any decisions made based on calculations from this application.
        </ThemedText>
        
        <Spacer height={10}/>
        
        <ThemedText style={styles.lastUpdated}>
          Last updated: {new Date().toLocaleDateString()}
        </ThemedText>
        
        <Spacer height={10}/>
        
        <ThemedButton 
          onPress={onBack}
          style={styles.backButton}
        >
          Back to Registration
        </ThemedButton>
      </ThemedView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
  backButton: {
    marginTop: 20,
    borderRadius:8,
  },
})

export default Terms