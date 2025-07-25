import React, { useState } from 'react';
import { StyleSheet, Pressable, Text, View, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import Spacer from '../../components/Spacer';
import ThemedButton from '../../components/ThemedButton';
import ThemedTextInput from '../../components/ThemedTextInput';
import Checkbox from 'expo-checkbox';
import { useUser } from '../../hooks/useUser';
import Terms from '../../components/Terms';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [linkPressed, setLinkPressed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const router = useRouter();
  const { register } = useUser();

  const handleSubmit = async () => {
    if (!isChecked) {
      Alert.alert('Terms & Conditions', 'You must agree to the Terms & Conditions');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (password.length < 8 || password.length > 25) {
      Alert.alert('Password Length', 'Password must be between 8 to 25 characters');
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    try {
      // Correct parameter order: name, email, password
      await register(name, email, password);
      Alert.alert('Success', 'Account created! ');
      router.push('/dashboard');
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
      console.error('Registration error:', error);
    }
  };

  const handleTermsPress = () => setShowTerms(true);
  const handleBackFromTerms = () => setShowTerms(false);

  if (showTerms) {
    return <Terms onBack={handleBackFromTerms} />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title style={styles.title}>
          Create Account
        </ThemedText>
        <ThemedText>Begin your journey to better grades</ThemedText>
        <Spacer height={25} />

        <View style={styles.form}>
          <ThemedTextInput placeholder="Full Name" onChangeText={setName} value={name} style={styles.input} />
          <Spacer height={16} />
          <ThemedTextInput
            placeholder="Email Address"
            onChangeText={setEmail}
            value={email}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Spacer height={16} />

          <View style={styles.inputContainer}>
            <ThemedTextInput
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye-outline'} size={20} color="#625f72" />
            </Pressable>
          </View>

          {password.length > 0 && (password.length < 8 || password.length > 25) && (
            <Text style={styles.validationText}>Password must be between 8 to 25 characters</Text>
          )}

          <Spacer height={16} />

          <View style={styles.inputContainer}>
            <ThemedTextInput
              placeholder="Confirm Password"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={[styles.input, styles.passwordInput]}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye-outline'} size={20} color="#625f72" />
            </Pressable>
          </View>

          {isConfirmPasswordFocused && (
            <Text style={styles.validationText}>Password should be between 8 to 25 characters</Text>
          )}
        </View>

        <Spacer height={16} />

        <Pressable onPress={() => setIsChecked(!isChecked)} style={styles.checkboxContainer}>
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            style={[styles.checkbox, { borderColor: '#D1D5DB', borderRadius: 4 }]}
          />
          <Text style={styles.label}>
            I agree to the{' '}
            <Text
              onPressIn={() => setLinkPressed(true)}
              onPressOut={() => setLinkPressed(false)}
              onPress={handleTermsPress}
              style={[styles.link, linkPressed && { opacity: 0.8 }]}
            >
              Terms & Conditions
            </Text>
          </Text>
        </Pressable>

        <Spacer height={16} />

        <ThemedButton
          onPress={handleSubmit}
          style={styles.btn}
          disabled={
            !email ||
            !password ||
            password !== confirmPassword ||
            !isChecked ||
            !name ||
            password.length < 8 ||
            password.length > 25
          }
        >
          <Text>Create Account</Text>
        </ThemedButton>

        <Spacer height={25} />

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Link href="/login" style={styles.link}>
            Sign In
          </Link>
        </Text>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

// Your existing styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
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
    position: 'relative',
  },
  inputContainer: {
    width: 342,
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 35,
    padding: 5,
  },
  validationText: {
    fontSize: 12,
    color: '#d9534f',
    marginTop: 4,
    marginLeft: 4,
  },
  btn: {
    width: 342,
    height: 52,
    borderRadius: 12,
    paddingVertical: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  link: {
    color: '#2E5CFF',
    textDecorationLine: 'underline',
  },
  footerText: {
    textAlign: 'center',
  },
});
