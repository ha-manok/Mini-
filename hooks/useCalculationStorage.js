import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const STORAGE_KEY = '@calculation_history';

export const useCalculationStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate storage key specific to user (for AsyncStorage)
  const getUserStorageKey = () => {
    const userId = auth.currentUser?.uid || 'anonymous';
    return `${STORAGE_KEY}_${userId}`;
  };

  // Save calculation to both AsyncStorage and Firebase
  const saveCalculation = async (calculationData) => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to save calculations');
      }

      // Prepare the data to save
      const timestamp = new Date();
      const dataToSave = {
        ...calculationData,
        timestamp: timestamp.toISOString(),
        userId: currentUser.uid,
        id: `calc_${timestamp.getTime()}` // Generate unique ID
      };

      // Save to AsyncStorage (local storage)
      await saveToAsyncStorage(dataToSave);

      // Save to Firebase (cloud storage)
      await saveToFirebase(dataToSave);

      return { success: true, data: dataToSave };
    } catch (error) {
      console.error('Error saving calculation:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Save to AsyncStorage
  const saveToAsyncStorage = async (data) => {
    try {
      const storageKey = getUserStorageKey();
      
      // Get existing calculations
      const existingData = await AsyncStorage.getItem(storageKey);
      const calculations = existingData ? JSON.parse(existingData) : [];
      
      // Add new calculation to the beginning of the array
      calculations.unshift(data);
      
      // Keep only the last 50 calculations to avoid storage bloat
      const limitedCalculations = calculations.slice(0, 50);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem(storageKey, JSON.stringify(limitedCalculations));
      
      console.log(' Calculation saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
      throw new Error('Failed to save locally');
    }
  };

  // Save to Firebase
  const saveToFirebase = async (data) => {
    try {
      const userId = auth.currentUser.uid;
      
      // Prepare data for Firebase (convert timestamp to Firestore timestamp)
      const firebaseData = {
        ...data,
        timestamp: Timestamp.fromDate(new Date(data.timestamp))
      };
      
      // Save to user's calculations subcollection
      const docRef = await addDoc(
        collection(db, 'users', userId, 'calculations'), 
        firebaseData
      );
      
      console.log(' Calculation saved to Firebase with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      // Don't throw error here - we still want local storage to work
      console.warn('⚠️ Failed to save to cloud, but local storage succeeded');
    }
  };

  // Get calculations from AsyncStorage (for offline access)
  const getLocalCalculations = async () => {
    try {
      const storageKey = getUserStorageKey();
      const data = await AsyncStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading from AsyncStorage:', error);
      return [];
    }
  };

  // Clear local storage (useful for logout or reset)
  const clearLocalStorage = async () => {
    try {
      const storageKey = getUserStorageKey();
      await AsyncStorage.removeItem(storageKey);
      console.log('Local calculation storage cleared');
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  };

  return {
    saveCalculation,
    getLocalCalculations,
    clearLocalStorage,
    loading,
    error
  };
}; 