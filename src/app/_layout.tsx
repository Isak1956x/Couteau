import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          headerBackTitle: 'Inicio',
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="gender-reveal"
          options={{
            title: 'Predictor de Género',
          }}
        />
        <Stack.Screen
          name="randomperson"
          options={{
            title: 'Persona Aleatoria',
          }}
        />
        <Stack.Screen
          name="colleges"
          options={{
            title: 'Universidades por País',
          }}
        />
        <Stack.Screen
          name="wheather"
          options={{
            title: 'Clima en RD',
          }}
        />
        <Stack.Screen
          name="pokemon"
          options={{
            title: 'Buscador de Pokémon',
          }}
        />
        <Stack.Screen
          name="news"
          options={{
            title: 'Noticias WordPress',
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: 'Acerca del Desarrollador',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
