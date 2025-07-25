import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AuthGuard from '../../components/AuthGuard';

export default function AuthLayout() {
  return (
    <AuthGuard requireAuth={false}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          animation: 'none',
          headerShown:false,
        }}
      />
    </AuthGuard>
  );
}
