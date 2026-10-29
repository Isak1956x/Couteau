import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

// Convert WMO code to human-readable condition and icon
function getWeatherCondition(code: number, isDay: number = 1): {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tip: string;
} {
  switch (code) {
    case 0:
      return {
        title: isDay ? 'Despejado / Soleado' : 'Cielo Despejado',
        icon: isDay ? 'sunny' : 'moon',
        color: isDay ? '#F59E0B' : '#818CF8',
        tip: 'Día radiante. ¡Usa protector solar y mantente hidratado!',
      };
    case 1:
    case 2:
      return {
        title: 'Parcialmente Nublado',
        icon: isDay ? 'partly-sunny' : 'cloudy-night',
        color: '#60A5FA',
        tip: 'Clima agradable con intervalos de sol y nubes.',
      };
    case 3:
      return {
        title: 'Nublado',
        icon: 'cloudy',
        color: '#94A3B8',
        tip: 'Cielo cubierto. Temperatura fresca en la zona metropolitana.',
      };
    case 45:
    case 48:
      return {
        title: 'Neblina / Niebla',
        icon: 'water-outline',
        color: '#94A3B8',
        tip: 'Visibilidad reducida. Precaución si vas a conducir.',
      };
    case 51:
    case 53:
    case 55:
      return {
        title: 'Llovizna Ligera',
        icon: 'rainy-outline',
        color: '#38BDF8',
        tip: 'Lloviznas dispersas. Es prudente llevar sombrilla.',
      };
    case 61:
    case 63:
    case 65:
      return {
        title: 'Lluvia Moderada',
        icon: 'rainy',
        color: '#2563EB',
        tip: 'Lluvia en el área. No olvides tu paraguas o impermeable.',
      };
    case 80:
    case 81:
    case 82:
      return {
        title: 'Chubascos Aislados',
        icon: 'thunderstorm-outline',
        color: '#3B82F6',
        tip: 'Chubascos intermitentes característicos del clima tropical caribeño.',
      };
    case 95:
    case 96:
    case 99:
      return {
        title: 'Tormenta Eléctrica',
        icon: 'thunderstorm',
        color: '#7C3AED',
        tip: 'Alerta de tormenta eléctrica. Evita zonas inundables y busca resguardo.',
      };
    default:
      return {
        title: 'Clima Tropical Variable',
        icon: 'cloud-outline',
        color: '#06B6D4',
        tip: 'Clima típico caribeño de República Dominicana.',
      };
  }
}

export default function RDWeatherScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRDWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=America%2FSanto_Domingo';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en el servicio (${response.status})`);
      }
      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener el clima de República Dominicana.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRDWeather();
  }, []);

  const todayFormatted = new Date().toLocaleDateString('es-DO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const condition = weather
    ? getWeatherCondition(weather.current.weather_code, weather.current.is_day)
    : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: safeAreaInsets.top + Spacing.four,
          paddingBottom: safeAreaInsets.bottom + Spacing.four,
        },
      ]}>
      <View style={styles.innerContainer}>
    
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="partly-sunny" size={32} color="#F59E0B" />
          </View>
          <ThemedText type="title" style={styles.title}>
            Clima en RD
          </ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Estado del tiempo para el día de hoy en la República Dominicana.
          </ThemedText>
        </View>

    
        <View style={styles.dateRow}>
          <View style={styles.locationTag}>
            <Ionicons name="location" size={16} color="#E11D48" />
            <ThemedText type="smallBold">Santo Domingo, República Dominicana</ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.pressed,
              loading && styles.disabledButton,
            ]}
            onPress={fetchRDWeather}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <ThemedText style={styles.refreshButtonText}>Actualizar</ThemedText>
              </>
            )}
          </Pressable>
        </View>


        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color="#E74C3C" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

  
        {loading && !weather && (
          <ThemedView type="backgroundElement" style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <ThemedText style={{ marginTop: Spacing.two }} themeColor="textSecondary">
              Cargando reporte meteorológico de hoy...
            </ThemedText>
          </ThemedView>
        )}

        
        {weather && condition && (
          <>
            <ThemedView
              type="backgroundElement"
              style={[styles.mainCard, { borderColor: condition.color }]}>
              {/* Today Badge */}
              <View style={styles.todayPill}>
                <ThemedText style={styles.todayPillText}>
                  {todayFormatted.toUpperCase()}
                </ThemedText>
              </View>

           
              <View style={styles.weatherHero}>
                <Ionicons name={condition.icon} size={84} color={condition.color} />
                <View style={styles.tempGroup}>
                  <ThemedText style={styles.currentTemp}>
                    {Math.round(weather.current.temperature_2m)}°C
                  </ThemedText>
                  <ThemedText type="subtitle" style={[styles.conditionTitle, { color: condition.color }]}>
                    {condition.title}
                  </ThemedText>
                  <ThemedText style={styles.feelsLike} themeColor="textSecondary">
                    Sensación térmica: {Math.round(weather.current.apparent_temperature)}°C
                  </ThemedText>
                </View>
              </View>

              {/* Day's High & Low */}
              <View style={styles.minMaxRow}>
                <View style={styles.minMaxItem}>
                  <Ionicons name="arrow-up" size={16} color="#EF4444" />
                  <ThemedText style={styles.minMaxText}>
                    Máx: {Math.round(weather.daily.temperature_2m_max[0])}°C
                  </ThemedText>
                </View>
                <View style={styles.divider} />
                <View style={styles.minMaxItem}>
                  <Ionicons name="arrow-down" size={16} color="#3B82F6" />
                  <ThemedText style={styles.minMaxText}>
                    Mín: {Math.round(weather.daily.temperature_2m_min[0])}°C
                  </ThemedText>
                </View>
              </View>

              {/* Recommendation Tip */}
              <View style={[styles.tipBanner, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                <Ionicons name="bulb-outline" size={20} color="#D97706" />
                <ThemedText style={styles.tipText}>
                  {condition.tip}
                </ThemedText>
              </View>
            </ThemedView>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              {/* Humedad */}
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <Ionicons name="water" size={24} color="#0EA5E9" />
                <ThemedText style={styles.metricValue}>
                  {weather.current.relative_humidity_2m}%
                </ThemedText>
                <ThemedText style={styles.metricLabel} themeColor="textSecondary">
                  Humedad Relativa
                </ThemedText>
              </ThemedView>

              {/* Probabilidad de Lluvia */}
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <Ionicons name="umbrella" size={24} color="#6366F1" />
                <ThemedText style={styles.metricValue}>
                  {weather.daily.precipitation_probability_max[0] ?? 0}%
                </ThemedText>
                <ThemedText style={styles.metricLabel} themeColor="textSecondary">
                  Prob. Precipitación
                </ThemedText>
              </ThemedView>

              {/* Viento */}
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <Ionicons name="flag" size={24} color="#10B981" />
                <ThemedText style={styles.metricValue}>
                  {weather.current.wind_speed_10m} km/h
                </ThemedText>
                <ThemedText style={styles.metricLabel} themeColor="textSecondary">
                  Velocidad Viento
                </ThemedText>
              </ThemedView>

              {/* Lluvia actual */}
              <ThemedView type="backgroundElement" style={styles.metricCard}>
                <Ionicons name="rainy-outline" size={24} color="#3B82F6" />
                <ThemedText style={styles.metricValue}>
                  {weather.current.precipitation} mm
                </ThemedText>
                <ThemedText style={styles.metricLabel} themeColor="textSecondary">
                  Precipitación Actual
                </ThemedText>
              </ThemedView>
            </View>

            {/* Solar cycle card */}
            <ThemedView type="backgroundElement" style={styles.sunCard}>
              <View style={styles.sunItem}>
                <Ionicons name="sunny-outline" size={26} color="#F59E0B" />
                <View>
                  <ThemedText style={styles.sunLabel} themeColor="textSecondary">
                    Amanecer
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {weather.daily.sunrise[0]?.split('T')[1] || '06:30'} AM
                  </ThemedText>
                </View>
              </View>

              <View style={styles.sunItem}>
                <Ionicons name="moon-outline" size={26} color="#818CF8" />
                <View>
                  <ThemedText style={styles.sunLabel} themeColor="textSecondary">
                    Atardecer
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {weather.daily.sunset[0]?.split('T')[1] || '18:15'} PM
                  </ThemedText>
                </View>
              </View>
            </ThemedView>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  innerContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 480,
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  errorText: {
    color: '#E74C3C',
    flex: 1,
  },
  loadingBox: {
    borderRadius: Spacing.four,
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    borderWidth: 1.5,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  todayPill: {
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.four,
  },
  todayPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  weatherHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    width: '100%',
    paddingVertical: Spacing.two,
  },
  tempGroup: {
    alignItems: 'flex-start',
  },
  currentTemp: {
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 56,
  },
  conditionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  feelsLike: {
    fontSize: 13,
    marginTop: 2,
  },
  minMaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    backgroundColor: 'rgba(128, 128, 128, 0.08)',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    width: '100%',
  },
  minMaxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  minMaxText: {
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
    width: '100%',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#B45309',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sunCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sunLabel: {
    fontSize: 11,
  },
});
