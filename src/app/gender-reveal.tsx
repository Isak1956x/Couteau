import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface GenderResult {
  name: string;
  gender: 'male' | 'female' | null;
  probability: number;
  count: number;
}

const QUICK_NAMES = ['Irma', 'Carlos', 'Isaac', 'Maria', 'Alex'];

export default function GenderPredictorScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchGender = async (searchName: string) => {
    const trimmed = searchName.trim();
    if (!trimmed) {
      setError('Por favor, ingresa un nombre.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.genderize.io/?name=${encodeURIComponent(trimmed)}`
      );
      if (!response.ok) {
        throw new Error(`Error en el servidor (${response.status})`);
      }
      const data: GenderResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Error al predecir el género. Intenta de nuevo.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const isMale = result?.gender === 'male';
  const isFemale = result?.gender === 'female';

  // Dynamic accent colors based on predicted gender
  const genderColors = isMale
    ? {
        bg: '#0F2744',
        cardBg: '#1B3B6F',
        border: '#2196F3',
        text: '#E3F2FD',
        badge: '#1976D2',
        lightBg: '#E3F2FD',
        title: 'Masculino (Hombre)',
        icon: 'male' as const,
      }
    : isFemale
    ? {
        bg: '#3A0D26',
        cardBg: '#5B1A3F',
        border: '#E91E63',
        text: '#FCE4EC',
        badge: '#D81B60',
        lightBg: '#FCE4EC',
        title: 'Femenino (Mujer)',
        icon: 'female' as const,
      }
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
      ]}
      keyboardShouldPersistTaps="handled">
      <View style={styles.innerContainer}>
    
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="transgender-outline" size={32} color="#8E44AD" />
          </View>
          <ThemedText type="title" style={styles.title}>
            Predictor de Género
          </ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Ingresa cualquier nombre para predecir si es masculino (azul) o femenino (rosa).
          </ThemedText>
        </View>

       
        <ThemedView type="backgroundElement" style={styles.inputCard}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Ej. Irma, Carlos, Isaac..."
              placeholderTextColor={theme.textSecondary}
              value={nameInput}
              onChangeText={setNameInput}
              onSubmitEditing={() => fetchGender(nameInput)}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {nameInput.length > 0 && (
              <Pressable
                onPress={() => {
                  setNameInput('');
                  setResult(null);
                  setError(null);
                }}
                style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </Pressable>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.pressed,
              loading && styles.disabledButton,
            ]}
            onPress={() => fetchGender(nameInput)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                <ThemedText style={styles.submitButtonText}>Predecir Género</ThemedText>
              </>
            )}
          </Pressable>

   
          <View style={styles.quickWrapper}>
            <ThemedText type="small" themeColor="textSecondary">
              Prueba rápida:
            </ThemedText>
            <View style={styles.pillsRow}>
              {QUICK_NAMES.map((name) => (
                <Pressable
                  key={name}
                  style={({ pressed }) => [
                    styles.pill,
                    { backgroundColor: theme.backgroundSelected },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    setNameInput(name);
                    fetchGender(name);
                  }}>
                  <ThemedText type="smallBold">{name}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </ThemedView>


        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color="#E74C3C" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

   
        {result && (
          <View
            style={[
              styles.resultContainer,
              genderColors
                ? {
                    backgroundColor: genderColors.cardBg,
                    borderColor: genderColors.border,
                  }
                : {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.backgroundSelected,
                  },
            ]}>
            {result.gender ? (
              <>
                <View
                  style={[
                    styles.genderBadge,
                    { backgroundColor: genderColors?.badge || '#555' },
                  ]}>
                  <Ionicons
                    name={genderColors?.icon || 'help'}
                    size={40}
                    color="#FFFFFF"
                  />
                </View>

                <ThemedText style={[styles.resultName, { color: '#FFFFFF' }]}>
                  {result.name.toUpperCase()}
                </ThemedText>

                <View
                  style={[
                    styles.tagBadge,
                    { backgroundColor: genderColors?.border || '#777' },
                  ]}>
                  <ThemedText style={styles.tagBadgeText}>
                    {genderColors?.title}
                  </ThemedText>
                </View>

                {/* Stats Breakdown */}
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <ThemedText style={styles.statLabel}>Probabilidad</ThemedText>
                    <ThemedText style={styles.statValue}>
                      {Math.round(result.probability * 100)}%
                    </ThemedText>
                  </View>

                  <View style={styles.statBox}>
                    <ThemedText style={styles.statLabel}>Muestras</ThemedText>
                    <ThemedText style={styles.statValue}>
                      {result.count.toLocaleString()}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.indicatorBanner}>
                  <View
                    style={[
                      styles.indicatorDot,
                      { backgroundColor: isMale ? '#42A5F5' : '#F06292' },
                    ]}
                  />
                  <ThemedText style={styles.indicatorText}>
                    {isMale
                      ? 'Color Azul: Género Masculino detectado'
                      : 'Color Rosa: Género Femenino detectado'}
                  </ThemedText>
                </View>
              </>
            ) : (
              <View style={styles.undeterminedBox}>
                <Ionicons name="help-circle-outline" size={48} color={theme.textSecondary} />
                <ThemedText type="subtitle" style={styles.undeterminedTitle}>
                  Género no determinado
                </ThemedText>
                <ThemedText style={styles.undeterminedSubtitle} themeColor="textSecondary">
                  No se encontraron suficientes datos estadísticos para el nombre "{result.name}".
                </ThemedText>
              </View>
            )}
          </View>
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
  inputCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    height: 48,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
    }),
  },
  clearButton: {
    padding: Spacing.one,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
  quickWrapper: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
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
  resultContainer: {
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    borderWidth: 2,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  genderBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  resultName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tagBadge: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  tagBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
    width: '100%',
    marginTop: Spacing.two,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  indicatorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    marginTop: Spacing.one,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  undeterminedBox: {
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  undeterminedTitle: {
    textAlign: 'center',
  },
  undeterminedSubtitle: {
    textAlign: 'center',
    fontSize: 14,
  },
});
