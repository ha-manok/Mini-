import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme] ?? colors.light;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.navBackground,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0.3,
            borderBottomColor: '#fff',
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            fontFamily: 'Inter_400Regular', // fixed font family name
            color: colors.title,
          },
        }}
      >
        <Stack.Screen name="Splash" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="terms" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default RootLayout;
