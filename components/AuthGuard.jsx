import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthState } from '../hooks/useAuthState';
import { ActivityIndicator, View } from 'react-native';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';

const AuthGuard = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but isn't
        router.replace('/(auth)/login');
      } else if (!requireAuth && isAuthenticated) {
        // User shouldn't be on auth pages if already authenticated
        router.replace('/(dashboard)');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <ThemedView style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <ActivityIndicator size="large" color="#2E5CFF" />
        <ThemedText style={{ marginTop: 16, fontSize: 16 }}>
          Checking authentication...
        </ThemedText>
      </ThemedView>
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return children;
};

export default AuthGuard; 