import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import ThemedCard from './ThemedCard';
import Spacer from './Spacer';

const CalculationCard = ({
  item,
  isSelectionMode,
  isSelected,
  onPress,
  onLongPress,
  formatDate
}) => {
  return (
    <Pressable
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      style={[
        styles.container,
        isSelectionMode && isSelected && styles.selectedItem
      ]}
    >
      <ThemedCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.calculationInfo}>
            <View style={styles.cwaContainer}>
              <ThemedText style={styles.cwaLabel}>Current CWA</ThemedText>
              <ThemedText style={styles.cwaValue}>{item.currentCwa}</ThemedText>
            </View>
            <View style={styles.projectionContainer}>
              <ThemedText style={styles.projectionLabel}>Best Projection</ThemedText>
              <ThemedText style={[
                styles.projectionValue, 
                { color: item.targetAchievable ? '#10B981' : '#EF4444' }
              ]}>
                {item.bestProjection}
              </ThemedText>
            </View>
          </View>
          {isSelectionMode && (
            <Ionicons
              name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={isSelected ? '#2E5CFF' : '#9CA3AF'}
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

        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <Ionicons
              name={item.targetAchievable ? 'checkmark-circle' : 'alert-circle'}
              size={16}
              color={item.targetAchievable ? '#10B981' : '#F59E0B'}
            />
            <ThemedText style={[
              styles.statusText, 
              { color: item.targetAchievable ? '#10B981' : '#F59E0B' }
            ]}>
              {item.targetAchievable ? 'Good Performance Possible' : 'Limited Improvement Range'}
            </ThemedText>
          </View>
          <ThemedText style={styles.timestamp}>{formatDate(item.timestamp)}</ThemedText>
        </View>
      </ThemedCard>
    </Pressable>
  );
};

export default CalculationCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  selectedItem: {
    opacity: 0.8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
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
  footer: {
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
}); 