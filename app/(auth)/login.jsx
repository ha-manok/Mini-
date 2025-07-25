import { StyleSheet, Pressable, Text, View, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import Spacer from '../../components/Spacer';
import ThemedButton from '../../components/ThemedButton';
import ThemedTextInput from '../../components/ThemedTextInput';
import ThemedCard from '../../components/ThemedCard';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { useGoogleLogin } from '../../hooks/useGooglelogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();
  const { promptAsync, loading: googleLoading } = useGoogleLogin(); // from custom hook
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title style={styles.title}>CWA Projector</ThemedText>
        <ThemedText style={{ textAlign: 'center', fontSize: 14 }}>
          Adjust Future Grades To See Outcomes
        </ThemedText>
        <Spacer height={25} />
        <ThemedText title style={[styles.title, { textAlign: 'left' }]}>
          Welcome Back
        </ThemedText>
        <ThemedText style={{ fontSize: 14 }}>Sign in to continue</ThemedText>
        <Spacer height={30} />

        <View style={styles.form}>
          <ThemedTextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
            style={styles.input}
          />
          <Spacer height={16} />
          <ThemedTextInput
            placeholder="Enter your password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Spacer height={24} />
        <ThemedButton onPress={handleSubmit} style={styles.btn}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text>Sign In</Text>
          )}
        </ThemedButton>

        <Spacer height={20} />
        <Link href="/register">
          <ThemedText style={{ color: '#2E5CFF' }}>
            Forgot Password?
          </ThemedText>
        </Link>

        <View style={styles.divider}>
          <View style={styles.line} />
          <ThemedText style={{ marginHorizontal: 10, color: '#6B7280' }}>
            or continue with
          </ThemedText>
          <View style={styles.line} />
        </View>

        {/* Google Login */}
        <Pressable
          onPress={() => promptAsync()}
          disabled={googleLoading}
          style={({ pressed }) => [pressed && styles.pressed]}>
          <ThemedCard style={styles.Continue_with}>
            <Ionicons name="logo-google" size={20} />
            <ThemedText title style={{ textAlign: 'center', marginLeft: 10 }}>
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </ThemedText>
          </ThemedCard>
        </Pressable>

        <Spacer height={10} />

        {/* Apple login placeholder */}
        <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
          <ThemedCard style={styles.Continue_with}>
            <Ionicons name="logo-apple" size={20} />
            <ThemedText title style={{ textAlign: 'center', marginLeft: 10 }}>
              Continue with Apple
            </ThemedText>
          </ThemedCard>
        </Pressable>

        <ThemedText style={{ marginTop: 20, textAlign: 'center' }}>
          Don’t have an account?{' '}
          <Link href="/register" style={{ color: '#2E5CFF' }}>
            Register
          </Link>
        </ThemedText>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 5,
  },
  form: {
    width: '100%',
  },
  input: {
    width: 342,
    height: 48,
    borderRadius: 12,
    padding: 14,
  },
  btn: {
    width: 342,
    height: 52,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    height: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  Continue_with: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 342,
    height: 52,
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
