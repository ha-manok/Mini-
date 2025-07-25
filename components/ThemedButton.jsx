import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';

const ThemedButton = ({
  style,
  textStyle,
  children,
  useGradient = true,
  gradientColors = colors.primary,
  ...props
}) => {
  const content = (
    <Text style={[styles.btnText, textStyle]}>
      {children}
    </Text>
  );

  if (useGradient) {
    return (
      <Pressable
        style={({ pressed }) => [pressed && styles.pressed]}
        {...props}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, style]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      {content}
    </Pressable>
  );
};



export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
