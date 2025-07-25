import { StyleSheet, Text, View, Pressable, Switch, Alert } from 'react-native';
import ThemedView from '../../components/ThemedView';
import ThemedCard from '../../components/ThemedCard';
import ThemedText from '../../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Spacer from '../../components/Spacer';
import { useState } from 'react';
import { router } from 'expo-router';
import { useUser } from '../../hooks/useUser';
import { useAuthState } from '../../hooks/useAuthState';

const Settings = () => {
  const { logout } = useUser();
  const { user } = useAuthState();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <ThemedView safe={true} style={styles.container}>
      {/* Profile Card */}
      <ThemedCard style={styles.profileCard}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Ionicons name="person" size={30} color={'#E5E7EB'} style={styles.icon} />
          </View>  
        </View>
        <View style={styles.profileInfo}>
          <ThemedText title style={styles.userName}>
            {user?.displayName || user?.name || 'User Name'}
          </ThemedText>
          <View style={styles.emailRow}>
            <ThemedText style={styles.emailText}>
              {user?.email || 'user@example.com'}
            </ThemedText>
            <Pressable 
              onPress={() => router.push('/edit')} 
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Text style={styles.editButton}>Edit</Text>
            </Pressable>
          </View>
        </View>
      </ThemedCard>

      {/* App Preferences Card */}
      <ThemedCard style={styles.preferenceCard}>
        <ThemedText style={styles.sectionTitle}>APP PREFERENCES</ThemedText>
        <Spacer height={15} />
        
        {/* Dark Mode Toggle */}
        <View style={styles.switchContainer}>
          <View style={styles.optionLeft}>
            <Ionicons name='moon' size={18} color='#9CA3AF' style={styles.optionIcon} />
            <ThemedText title style={styles.optionText}>Dark Mode</ThemedText>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: "#E5E7EB", true: "#4A90E2" }}
            thumbColor={isDarkMode ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>

        <Spacer height={10} />

        {/* Language Option */}
        <Pressable 
          onPress={() => router.push('/language')} 
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <View style={styles.optionContainer}>
            <View style={styles.optionLeft}>
              <Ionicons name='language' size={18} color='#9CA3AF' style={styles.optionIcon} />
              <ThemedText title style={styles.optionText}>Language</ThemedText>
            </View>
            <View style={styles.optionRight}>
              <ThemedText style={styles.optionValue}>English</ThemedText>
              <Ionicons name='chevron-forward' size={16} color='#9CA3AF' />
            </View>
          </View>
        </Pressable>
      </ThemedCard>
      
      {/* Info Card */}
      <ThemedCard style={styles.preferenceCard}>
        <ThemedText style={styles.sectionTitle}>INFO</ThemedText>
        <Spacer height={15} />
        
        {/* Terms & Conditions */}
        <Pressable 
          onPress={() => router.push('/terms')} 
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <View style={styles.termsContainer}>
            <View style={styles.optionLeft}>
              <Ionicons name='document' size={18} color='#9CA3AF' style={styles.optionIcon} />
              <ThemedText title style={styles.optionText}>Terms & Conditions</ThemedText>
            </View>
            <Ionicons name='chevron-forward' size={16} color='#9CA3AF' />
          </View>
        </Pressable>
        
        <Spacer height={20} />
        
        {/* Sign Out Button */}
        <Pressable 
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}
        >
          <View style={styles.signOutContainer}>
            <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
            <ThemedText title style={styles.signOutText}>Sign Out</ThemedText>
          </View>
        </Pressable>
      </ThemedCard>
    </ThemedView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#F3F4F6',
    borderBottomWidth: 0.3,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  outerCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 46.5,
    height: 46.5,
    backgroundColor: '#9CA3AF',
    borderRadius: 23.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    marginBottom: 4,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    color: '#0D6EFD',
    fontSize: 14,
    fontWeight: '500',
  },
  preferenceCard: {
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.3,
    borderColor: '#F3F4F6',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  optionValue: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.3,
    borderColor: '#F3F4F6',
  },
  signOutButton: {
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
});
