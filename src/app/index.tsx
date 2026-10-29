import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  route: '/gender-reveal' | '/randomperson' | '/colleges' | '/wheather' | '/pokemon' | '/news' | '/about';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const TOOLS: ToolItem[] = [
  {
    id: 'gender',
    title: 'Predictor de Género',
    subtitle: 'Azul (♂) o Rosa (♀)',
    route: '/gender-reveal',
    icon: 'transgender-outline',
    color: '#8E44AD',
  },
  {
    id: 'randomperson',
    title: 'Persona Aleatoria',
    subtitle: 'Foto, fecha y edad',
    route: '/randomperson',
    icon: 'people-outline',
    color: '#007AFF',
  },
  {
    id: 'colleges',
    title: 'Universidades',
    subtitle: 'Por país en inglés',
    route: '/colleges',
    icon: 'school-outline',
    color: '#10B981',
  },
  {
    id: 'weather',
    title: 'Clima en RD',
    subtitle: 'Reporte del día de hoy',
    route: '/wheather',
    icon: 'partly-sunny-outline',
    color: '#F59E0B',
  },
  {
    id: 'pokemon',
    title: 'Pokémon',
    subtitle: 'Info y sonido oficial',
    route: '/pokemon',
    icon: 'flash-outline',
    color: '#EF4444',
  },
  {
    id: 'news',
    title: 'Noticias WordPress',
    subtitle: 'Últimas 3 publicaciones',
    route: '/news',
    icon: 'newspaper-outline',
    color: '#00749C',
  },
  {
    id: 'about',
    title: 'Acerca de',
    subtitle: 'Isaac Cabrera Silverio',
    route: '/about',
    icon: 'person-circle-outline',
    color: '#6366F1',
  },
];

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: safeAreaInsets.top + Spacing.two,
          paddingBottom: safeAreaInsets.bottom + Spacing.five,
        },
      ]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.innerContainer}>
        {/* Header Bar */}
        <View style={styles.topBar}>
          <View>
            <ThemedText type="title" style={styles.appTitle}>
              Couteau 🛠️
            </ThemedText>
            <ThemedText style={styles.appTagline} themeColor="textSecondary">
              Caja de herramientas multiuso
            </ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.aboutHeaderButton,
              { backgroundColor: theme.backgroundElement },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push('/about')}>
            <Ionicons name="person-circle" size={26} color="#6366F1" />
          </Pressable>
        </View>

        {/* Compact Toolbox Hero Image Card */}
        <View style={styles.heroCard}>
          <Image
            source={require('@/assets/images/toolbox.jpg')}
            style={styles.toolboxImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.imageOverlayBadge}>
            <Ionicons name="construct" size={14} color="#FFFFFF" />
            <ThemedText style={styles.overlayText}>Todas tus utilidades en un solo lugar</ThemedText>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Selecciona una herramienta
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            7 utilidades
          </ThemedText>
        </View>

        {/* Grid of Tools (2 Columns) */}
        <View style={styles.grid}>
          {TOOLS.map((tool, index) => {
            const isFullWidth = index === TOOLS.length - 1; // Last item "Acerca de" takes full width
            return (
              <Pressable
                key={tool.id}
                style={({ pressed }) => [
                  styles.cardPressable,
                  isFullWidth && styles.fullWidthCard,
                  pressed && styles.pressed,
                ]}
                onPress={() => router.push(tool.route)}>
                <ThemedView
                  type="backgroundElement"
                  style={[
                    styles.toolCard,
                    isFullWidth && styles.toolCardRow,
                  ]}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: `${tool.color}18` },
                    ]}>
                    <Ionicons name={tool.icon} size={28} color={tool.color} />
                  </View>

                  <View style={[styles.cardTextWrapper, isFullWidth && { flex: 1 }]}>
                    <ThemedText type="smallBold" style={styles.toolTitle} numberOfLines={1}>
                      {tool.title}
                    </ThemedText>
                    <ThemedText
                      type="small"
                      themeColor="textSecondary"
                      style={styles.toolSubtitle}
                      numberOfLines={1}>
                      {tool.subtitle}
                    </ThemedText>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.textSecondary}
                    style={styles.chevronIcon}
                  />
                </ThemedView>
              </Pressable>
            );
          })}
        </View>
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
    paddingHorizontal: Spacing.three,
  },
  innerContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.two,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
    paddingBottom: Spacing.half,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  appTagline: {
    fontSize: 13,
  },
  aboutHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    width: '100%',
    height: 170,
    borderRadius: Spacing.four,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  toolboxImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: Spacing.two,
    left: Spacing.two,
    right: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  sectionTitle: {
    fontSize: 17,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  cardPressable: {
    width: '48.5%',
    flexGrow: 1,
  },
  fullWidthCard: {
    width: '100%',
  },
  toolCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    alignItems: 'flex-start',
    gap: Spacing.two,
    minHeight: 110,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  toolCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    gap: Spacing.three,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrapper: {
    gap: 2,
    width: '100%',
  },
  toolTitle: {
    fontSize: 14,
  },
  toolSubtitle: {
    fontSize: 11,
  },
  chevronIcon: {
    position: 'absolute',
    right: Spacing.two,
    top: Spacing.three,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
