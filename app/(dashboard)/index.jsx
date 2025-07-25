import { StyleSheet, Text, Pressable, View, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig'; // Adjust path as needed
import ThemedView from '../../components/ThemedView';
import ThemedButton from '../../components/ThemedButton';
import ThemedCard from '../../components/ThemedCard';
import ThemedText from '../../components/ThemedText';
import Spacer from '../../components/Spacer';
import calculator from '../../assets/images/FRAME.png';
import clock from '../../assets/images/FRAME (1).png';
import { instructions } from '../../constants/instructions';

const { width: screenWidth } = Dimensions.get('window');

const Home = () => {
  const [recentCalculations, setRecentCalculations] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const tips = instructions.tips;
  const router = useRouter();

  useEffect(() => {
    loadRecentCalculations();
  }, []);

  const loadRecentCalculations = () => {
    if (!auth.currentUser) {
      setLoadingRecent(false);
      setRecentCalculations([]);
      return;
    }

    const userId = auth.currentUser.uid;
    const calculationsRef = collection(db, 'users', userId, 'calculations');
    const q = query(calculationsRef, orderBy('timestamp', 'desc'), limit(3));

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
        setRecentCalculations(calculations);
        setLoadingRecent(false);
      },
      (error) => {
        console.error('Error loading recent calculations:', error);
        setLoadingRecent(false);
        setRecentCalculations([]);
      }
    );

    return unsubscribe;
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleRecentCalculationPress = (item) => {
    router.push({
      pathname: '/Calc',
      params: {
        currentCwa: item.currentCwa?.toString() || '',
        previousCredit: item.previousCredit?.toString() || '',
        semesterCredit: item.semesterCredit?.toString() || ''
      }
    });
  };

  const renderRecentCalculation = (item, index) => (
    <Pressable
      key={item.id}
      onPress={() => handleRecentCalculationPress(item)}
      style={({ pressed }) => [
        styles.recentCalculationItem,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
      ]}
    >
      <ThemedCard style={styles.recentCalculationCard}>
        <View style={styles.recentCalculationHeader}>
          <View style={styles.recentCalculationInfo}>
            <View style={styles.cwaSection}>
              <ThemedText style={styles.cwaLabel}>Current CWA</ThemedText>
              <ThemedText style={styles.cwaValue}>{item.currentCwa}</ThemedText>
            </View>
            <View style={styles.projectionSection}>
              <ThemedText style={styles.projectionLabel}>Projection</ThemedText>
              <ThemedText style={[
                styles.projectionValue,
                { color: item.targetAchievable ? '#10B981' : '#EF4444' }
              ]}>
                {item.bestProjection}
              </ThemedText>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
        
        <View style={styles.recentCalculationFooter}>
          <View style={styles.creditsInfo}>
            <ThemedText style={styles.creditsText}>
              {item.previousCredit} + {item.semesterCredit} credits
            </ThemedText>
          </View>
          <ThemedText style={styles.recentTime}>
            {formatDate(item.timestamp)}
          </ThemedText>
        </View>
      </ThemedCard>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
      <ThemedView style={styles.container} safe={true}>
        
        <ThemedButton style={styles.card} onPress={() => router.push("/Calc")}>
          <Text style={styles.btnTitle}>Project Your CWA</Text>
          <Spacer height={30} />
          <Text style={styles.btnSubtitle}>
            Track, predict, and improve your academic performance
          </Text>
        </ThemedButton>

        <Spacer height={16} />

        <View style={styles.optionsRow}>
          <Pressable style={({ pressed }) => [styles.optionCard, pressed && styles.pressed]} onPress={() => router.push("/Calc")}>
            <ThemedCard borderRadius={12} style={styles.optionCardInner}>
              <Image source={calculator} style={styles.optionIcon} />
              <Spacer height={12} />
              <ThemedText style={styles.optionText}>New Calculation</ThemedText>
            </ThemedCard>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.optionCard, pressed && styles.pressed]} onPress={() => router.push("/History")}>
            <ThemedCard borderRadius={12} style={styles.optionCardInner}>
              <Image source={clock} style={styles.optionIcon} />
              <Spacer height={12} />
              <ThemedText style={styles.optionText}>View History</ThemedText>
            </ThemedCard>
          </Pressable>
        </View>

        <Spacer height={24} />

        <View>
          <ThemedText style={styles.sectionTitle} title>{tips.title}</ThemedText>
          <Spacer height={12} />

          {tips.body.map((tip, index) => (
            <View key={index}>
              <View style={styles.tipContainer}>
                <Image source={tips.icon} style={styles.icon} />
                <ThemedText style={styles.tip}>{tip}</ThemedText>
              </View>
              <Spacer height={12} />
            </View>
          ))}
        </View>

        <Spacer height={24} />

        <ThemedButton style={styles.startBtn} onPress={() => router.push("/Calc")}>
          <Text style={styles.startBtnText}>Start Calculating</Text>
        </ThemedButton>

        <Spacer height={20} />

        <View style={styles.recentSection}>
          <View style={styles.recentSectionHeader}>
            <ThemedText style={styles.sectionTitle} title>Recent Calculations</ThemedText>
            {recentCalculations.length > 0 && (
              <Pressable onPress={() => router.push("/History")}>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            )}
          </View>
          <Spacer height={12} />

          {loadingRecent ? (
            <ThemedCard style={styles.recentCard}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#2E5CFF" />
                <ThemedText style={styles.loadingText}>Loading...</ThemedText>
              </View>
            </ThemedCard>
          ) : recentCalculations.length > 0 ? (
            <View>
              {recentCalculations.map((item, index) => renderRecentCalculation(item, index))}
            </View>
          ) : (
            <ThemedCard style={styles.recentCard}>
              <View style={styles.emptyRecentContainer}>
                <Ionicons name="calculator-outline" size={32} color="#9CA3AF" />
                <ThemedText style={styles.quickStatNote}>
                  No recent calculations
                </ThemedText>
                <Pressable onPress={() => router.push("/Calc")} style={styles.startCalculatingBtn}>
                  <Text style={styles.startCalculatingText}>Start your first calculation</Text>
                </Pressable>
              </View>
            </ThemedCard>
          )}
        </View>
        
        <Spacer height={40} />
        
      </ThemedView>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    height: 136,
    width: screenWidth - 32,
    flexDirection: 'column',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  btnTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_400Regular',
    marginBottom: 6,
    lineHeight: 32,
    fontWeight: '600',
  },
  btnSubtitle: {
    color: '#f0f4f8',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    opacity: 0.9,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  optionCard: {
    flex: 1,
  },
  optionCardInner: {
    width: '100%',
    height: 108,
    paddingVertical: 16,
  },
  optionIcon: {
    width: 32,
    height: 32,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    lineHeight: 28,
    color: '#111827',
    marginBottom: 8,
    fontWeight: '600',
  },
  tip: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    flex: 1,
  },
  startBtn: {
    borderRadius: 8,
    paddingVertical: 16,
  },
  startBtnText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 4,
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 2,
  },
  recentSection: {
    marginTop: 8,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#2E5CFF',
    fontSize: 14,
    fontWeight: '500',
  },
  recentCard: {
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
  },
  quickStatNote: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    marginTop: 4,
    textAlign: 'center',
    color: '#6B7280',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyRecentContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  startCalculatingBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  startCalculatingText: {
    color: '#2E5CFF',
    fontSize: 14,
    fontWeight: '500',
  },
  recentCalculationItem: {
    marginBottom: 8,
  },
  recentCalculationCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  recentCalculationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentCalculationInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 12,
  },
  cwaSection: {
    alignItems: 'flex-start',
  },
  cwaLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  cwaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  projectionSection: {
    alignItems: 'flex-end',
  },
  projectionLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  projectionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  recentCalculationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  creditsInfo: {
    flex: 1,
  },
  creditsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  recentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});