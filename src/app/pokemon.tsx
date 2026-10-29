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
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface PokemonData {
  id: number;
  name: string;
  baseExperience: number;
  abilities: string[];
  types: string[];
  imageUrl: string;
  cryUrl: string | null;
  height: number;
  weight: number;
}

const POPULAR_POKEMON = ['pikachu', 'charizard', 'gengar', 'lucario', 'eevee', 'mewtwo'];

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705598',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

function PokemonPlayer({ cryUrl }: { cryUrl: string }) {
  const player = useAudioPlayer(cryUrl);
  const status = useAudioPlayerStatus(player);
  const [isPlayingFallback, setIsPlayingFallback] = useState(false);

  const handlePlay = async () => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).Audio) {
        setIsPlayingFallback(true);
        const webAudio = new (window as any).Audio(cryUrl);
        webAudio.onended = () => setIsPlayingFallback(false);
        webAudio.onerror = () => {
          setIsPlayingFallback(false);
          player.seekTo(0);
          player.play();
        };
        await webAudio.play();
      } else {
        player.seekTo(0);
        player.play();
      }
    } catch (e) {
      try {
        player.seekTo(0);
        player.play();
      } catch (err) {
        console.warn('Error playing audio:', err);
      }
    }
  };

  const isPlaying = status?.playing || isPlayingFallback;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.audioButton,
        isPlaying && styles.audioButtonPlaying,
        pressed && styles.pressed,
      ]}
      onPress={handlePlay}>
      <Ionicons
        name={isPlaying ? 'volume-high' : 'volume-medium'}
        size={22}
        color="#FFFFFF"
      />
      <ThemedText style={styles.audioButtonText}>
        {isPlaying ? 'Reproduciendo Sonido...' : 'Reproducir Sonido (Cry Latest)'}
      </ThemedText>
      <View style={styles.audioBadge}>
        <ThemedText style={styles.audioBadgeText}>OGG</ThemedText>
      </View>
    </Pressable>
  );
}

export default function PokemonScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [query, setQuery] = useState('pikachu');
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPokemon = async (pokemonName: string) => {
    const trimmed = pokemonName.trim().toLowerCase();
    if (!trimmed) {
      setError('Por favor, ingresa el nombre de un Pokémon.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(trimmed)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No se encontró el Pokémon "${trimmed}". Verifica la ortografía.`);
        }
        throw new Error(`Error en servidor (${response.status})`);
      }
      const data = await response.json();

      const image =
        data.sprites?.other?.['official-artwork']?.front_default ||
        data.sprites?.other?.home?.front_default ||
        data.sprites?.front_default ||
        '';

      const cry = data.cries?.latest || data.cries?.legacy || null;

      setPokemon({
        id: data.id,
        name: data.name,
        baseExperience: data.base_experience,
        abilities: data.abilities.map((a: any) => a.ability.name),
        types: data.types.map((t: any) => t.type.name),
        imageUrl: image,
        cryUrl: cry,
        height: data.height / 10, // decimetres to metres
        weight: data.weight / 10, // hectograms to kg
      });
    } catch (err: any) {
      setError(err?.message || 'Error al buscar el Pokémon.');
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  React.useEffect(() => {
    searchPokemon('pikachu');
  }, []);

  const primaryType = pokemon?.types[0] || 'electric';
  const typeColor = TYPE_COLORS[primaryType] || '#E11D48';

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
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="flash-outline" size={32} color="#F59E0B" />
          </View>
          <ThemedText type="title" style={styles.title}>
            Buscador de Pokémon
          </ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Busca cualquier Pokémon para ver su foto, experiencia base, habilidades y reproducir su sonido oficial.
          </ThemedText>
        </View>

        {/* Search Card */}
        <ThemedView type="backgroundElement" style={styles.searchCard}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="search-outline"
              size={20}
              color={theme.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Ej. pikachu, charizard, ditto..."
              placeholderTextColor={theme.textSecondary}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => searchPokemon(query)}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => setQuery('')}
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
            onPress={() => searchPokemon(query)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="search" size={18} color="#FFFFFF" />
                <ThemedText style={styles.submitButtonText}>Buscar Pokémon</ThemedText>
              </>
            )}
          </Pressable>

          {/* Quick suggestions */}
          <View style={styles.quickWrapper}>
            <ThemedText type="small" themeColor="textSecondary">
              Sugerencias populares:
            </ThemedText>
            <View style={styles.pillsRow}>
              {POPULAR_POKEMON.map((name) => (
                <Pressable
                  key={name}
                  style={({ pressed }) => [
                    styles.pill,
                    { backgroundColor: theme.backgroundSelected },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    setQuery(name);
                    searchPokemon(name);
                  }}>
                  <ThemedText type="smallBold">{name}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </ThemedView>

        {/* Error Box */}
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color="#E74C3C" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        {/* Pokemon Detail Card */}
        {pokemon && (
          <ThemedView
            type="backgroundElement"
            style={[styles.pokemonCard, { borderColor: typeColor }]}>
            {/* Top Bar with ID and Type */}
            <View style={styles.cardTopBar}>
              <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
                <ThemedText style={styles.typeBadgeText}>
                  {pokemon.types.join(' / ').toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText type="subtitle" style={styles.idText}>
                #{String(pokemon.id).padStart(3, '0')}
              </ThemedText>
            </View>

            {/* Official Artwork */}
            <View style={styles.artworkContainer}>
              <View
                style={[
                  styles.glowCircle,
                  { backgroundColor: `${typeColor}25` },
                ]}
              />
              {pokemon.imageUrl ? (
                <Image
                  source={{ uri: pokemon.imageUrl }}
                  style={styles.pokemonImage}
                  contentFit="contain"
                  transition={300}
                />
              ) : (
                <Ionicons name="help" size={80} color={theme.textSecondary} />
              )}
            </View>

            {/* Pokemon Name */}
            <ThemedText style={styles.pokemonName}>
              {pokemon.name.toUpperCase()}
            </ThemedText>

            {/* Sound Cry Player */}
            {pokemon.cryUrl ? (
              <PokemonPlayer cryUrl={pokemon.cryUrl} />
            ) : (
              <ThemedText type="small" themeColor="textSecondary">
                Sonido (cry) no disponible para este Pokémon
              </ThemedText>
            )}

            {/* Base Experience & Physical Stats */}
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: theme.backgroundSelected }]}>
                <Ionicons name="trophy" size={22} color="#F59E0B" />
                <ThemedText style={styles.statValue}>
                  {pokemon.baseExperience ?? 'N/A'} XP
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Experiencia Base
                </ThemedText>
              </View>

              <View style={[styles.statBox, { backgroundColor: theme.backgroundSelected }]}>
                <Ionicons name="resize" size={22} color="#3B82F6" />
                <ThemedText style={styles.statValue}>
                  {pokemon.height} m
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Altura
                </ThemedText>
              </View>

              <View style={[styles.statBox, { backgroundColor: theme.backgroundSelected }]}>
                <Ionicons name="barbell" size={22} color="#10B981" />
                <ThemedText style={styles.statValue}>
                  {pokemon.weight} kg
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Peso
                </ThemedText>
              </View>
            </View>

            {/* Abilities Section */}
            <View style={styles.abilitiesContainer}>
              <View style={styles.abilitiesHeader}>
                <Ionicons name="sparkles" size={18} color="#8E44AD" />
                <ThemedText type="smallBold">Habilidades (Abilities):</ThemedText>
              </View>

              <View style={styles.abilitiesGrid}>
                {pokemon.abilities.map((ability, idx) => (
                  <View
                    key={`${ability}-${idx}`}
                    style={[styles.abilityBadge, { backgroundColor: theme.backgroundSelected }]}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#8E44AD" />
                    <ThemedText style={styles.abilityText}>
                      {ability.replace('-', ' ')}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </ThemedView>
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
    backgroundColor: '#EF4444',
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
  pokemonCard: {
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    borderWidth: 2,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  typeBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.four,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  idText: {
    fontWeight: '800',
    color: 'rgba(128, 128, 128, 0.7)',
  },
  artworkContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  pokemonImage: {
    width: 190,
    height: 190,
  } as any,
  pokemonName: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  audioButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
    width: '100%',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  audioButtonPlaying: {
    backgroundColor: '#059669',
  },
  audioButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  audioBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.one,
  },
  audioBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
    marginTop: Spacing.one,
  },
  statBox: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  abilitiesContainer: {
    width: '100%',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  abilitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  abilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  abilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
  abilityText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
