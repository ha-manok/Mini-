import { StyleSheet, Text, View, Image, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Spacer from '../components/Spacer'
import { useRouter } from 'expo-router'

const Splash = () => {
  const router = useRouter()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    // Fade-in sequence
    const fadeIn = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start()
    }

    // Fade-out sequence
    const fadeOut = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1, // Slight scale up while fading out
          duration: 600,
          useNativeDriver: true,
        })
      ]).start(() => {
        router.replace('/(dashboard)')
      })
    }

    // Start animations
    fadeIn()

    // Start fade-out after delay
    const timer = setTimeout(fadeOut, 2500)

    return () => clearTimeout(timer)
  }, [router, fadeAnim, scaleAnim])

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image 
          style={styles.image} 
          source={require('../assets/images/splash.png')}
          resizeMode="contain"
        />
        <Spacer height={20} />
        <Text style={styles.text}>Calculate. Project. Achieve.</Text>
        <Spacer height={10} />
        <Text style={styles.subText}>Your Academic Success Partner</Text>
      </Animated.View>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 350,
    height: 100,
    marginBottom: 5,
  },
  text: {
    color: '#625f72',
    letterSpacing: 1.2,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    color: '#625f72',
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
  }
})