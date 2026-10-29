import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Linking,
  Platform,
  Pressable,
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

interface University {
  name: string;
  country: string;
  domains: string[];
  web_pages: string[];
}

const POPULAR_COUNTRIES = [
  'Dominican Republic',
  'United States',
  'Canada',
  'Spain',
  'Mexico',
  'Colombia',
];

export default function CollegesScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [countryInput, setCountryInput] = useState('Dominican Republic');
  const [filterQuery, setFilterQuery] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCountry, setSearchedCountry] = useState<string | null>(null);

  const fetchUniversities = async (countryName: string) => {
    const trimmed = countryName.trim();
    if (!trimmed) {
      setError('Por favor, ingresa el nombre de un país en inglés.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setFilterQuery('');

    try {
      const response = await fetch(
        `https://adamix.net/proxy.php?country=${encodeURIComponent(trimmed)}`
      );
      if (!response.ok) {
        throw new Error(`Error en el servidor (${response.status})`);
      }
      const data: University[] = await response.json();
      setUniversities(Array.isArray(data) ? data : []);
      setSearchedCountry(trimmed);
      if (!Array.isArray(data) || data.length === 0) {
        setError(`No se encontraron universidades para "${trimmed}". Verifica que el país esté en inglés.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al obtener universidades.');
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const openWebsite = async (url: string) => {
    try {
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `http://${url}`;
      const canOpen = await Linking.canOpenURL(formattedUrl);
      if (canOpen) {
        await Linking.openURL(formattedUrl);
      } else {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.warn('Cannot open url:', url, err);
    }
  };

  const filteredList = universities.filter((item) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.domains.some((d) => d.toLowerCase().includes(q))
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredList}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: safeAreaInsets.top + Spacing.four,
            paddingBottom: safeAreaInsets.bottom + Spacing.four,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.headerWrapper}>
      
            <View style={styles.header}>
              <View style={[styles.headerIcon, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="school-outline" size={32} color="#10B981" />
              </View>
              <ThemedText type="title" style={styles.title}>
                Universidades
              </ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Busca universidades de cualquier país (en inglés) y explora sus dominios y páginas oficiales.
              </ThemedText>
            </View>

           
            <ThemedView type="backgroundElement" style={styles.searchCard}>
              <ThemedText type="smallBold">País (en inglés):</ThemedText>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color={theme.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Ej. Dominican Republic, United States..."
                  placeholderTextColor={theme.textSecondary}
                  value={countryInput}
                  onChangeText={setCountryInput}
                  onSubmitEditing={() => fetchUniversities(countryInput)}
                  returnKeyType="search"
                  autoCorrect={false}
                />
                {countryInput.length > 0 && (
                  <Pressable
                    onPress={() => setCountryInput('')}
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
                onPress={() => fetchUniversities(countryInput)}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="search" size={18} color="#FFFFFF" />
                    <ThemedText style={styles.submitButtonText}>Buscar Universidades</ThemedText>
                  </>
                )}
              </Pressable>

 
              <View style={styles.pillsContainer}>
                <ThemedText type="small" themeColor="textSecondary">
                  Populares:
                </ThemedText>
                <View style={styles.pillsRow}>
                  {POPULAR_COUNTRIES.map((country) => (
                    <Pressable
                      key={country}
                      style={({ pressed }) => [
                        styles.pill,
                        { backgroundColor: theme.backgroundSelected },
                        pressed && styles.pressed,
                      ]}
                      onPress={() => {
                        setCountryInput(country);
                        fetchUniversities(country);
                      }}>
                      <ThemedText type="smallBold">{country}</ThemedText>
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


            {universities.length > 0 && (
              <View style={styles.filterSection}>
                <View style={styles.countBadge}>
                  <Ionicons name="ribbon-outline" size={18} color="#10B981" />
                  <ThemedText type="smallBold">
                    {universities.length} {universities.length === 1 ? 'universidad encontrada' : 'universidades encontradas'} en {searchedCountry}
                  </ThemedText>
                </View>

                <View style={[styles.filterInputWrapper, { backgroundColor: theme.backgroundElement }]}>
                  <Ionicons name="funnel-outline" size={16} color={theme.textSecondary} />
                  <TextInput
                    style={[styles.filterInput, { color: theme.text }]}
                    placeholder="Filtrar por nombre o dominio..."
                    placeholderTextColor={theme.textSecondary}
                    value={filterQuery}
                    onChangeText={setFilterQuery}
                  />
                  {filterQuery.length > 0 && (
                    <Pressable onPress={() => setFilterQuery('')}>
                      <Ionicons name="close" size={16} color={theme.textSecondary} />
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </View>
        }
        renderItem={({ item, index }) => {
          const primaryWeb = item.web_pages?.[0] || '';
          return (
            <ThemedView type="backgroundElement" style={styles.cardItem}>
              <View style={styles.cardHeader}>
                <View style={styles.indexCircle}>
                  <ThemedText style={styles.indexText}>{index + 1}</ThemedText>
                </View>
                <ThemedText type="subtitle" style={styles.uniName}>
                  {item.name}
                </ThemedText>
              </View>

              {/* Dominio */}
              <View style={styles.infoRow}>
                <Ionicons name="at-circle-outline" size={16} color="#6366F1" />
                <ThemedText style={styles.infoLabel} themeColor="textSecondary">
                  Dominio:
                </ThemedText>
                <ThemedText type="code" style={styles.domainText}>
                  {item.domains?.join(', ') || 'N/A'}
                </ThemedText>
              </View>

              {/* Link a la página web */}
              {primaryWeb ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.webLinkButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => openWebsite(primaryWeb)}>
                  <Ionicons name="globe" size={16} color="#007AFF" />
                  <ThemedText style={styles.webLinkText} numberOfLines={1}>
                    {primaryWeb}
                  </ThemedText>
                  <Ionicons name="open-outline" size={16} color="#007AFF" />
                </Pressable>
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  Página web no disponible
                </ThemedText>
              )}
            </ThemedView>
          );
        }}
        ListEmptyComponent={
          !loading && universities.length === 0 && !error ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
              <ThemedText style={styles.emptyText} themeColor="textSecondary">
                Presiona "Buscar Universidades" o selecciona un país para cargar los resultados.
              </ThemedText>
            </View>
          ) : (
            <View />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.three,
  },
  headerWrapper: {
    gap: Spacing.four,
    marginBottom: Spacing.three,
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
  searchCard: {
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
    backgroundColor: '#10B981',
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
  pillsContainer: {
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
  filterSection: {
    gap: Spacing.two,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  filterInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    height: 40,
    gap: Spacing.two,
  },
  filterInput: {
    flex: 1,
    fontSize: 14,
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
    }),
  },
  cardItem: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  indexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  indexText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  uniName: {
    flex: 1,
    fontSize: 17,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  infoLabel: {
    fontSize: 13,
  },
  domainText: {
    fontSize: 13,
    color: '#6366F1',
  },
  webLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  webLinkText: {
    flex: 1,
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  emptyText: {
    textAlign: 'center',
    maxWidth: 320,
    fontSize: 14,
  },
});
