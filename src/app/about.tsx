import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AboutScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const openContact = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn('Could not open link:', e);
    }
  };

  const skills = [
    'React Native',
    'Expo SDK',
    'Flutter & Dart',
    'TypeScript',
    'Node.js',
    'REST APIs',
    'UI/UX Design',
    'Git & GitHub',
  ];

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



        {/* Profile Card */}
        <ThemedView type="backgroundElement" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/fotoisaac.png')}
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>

          <ThemedText type="title" style={styles.name}>
            Isaac Cabrera Silverio
          </ThemedText>
          <ThemedText style={styles.role} themeColor="textSecondary">
            Software Developer & Mobile Engineer
          </ThemedText>

          <ThemedText style={styles.bio}>
            Desarrollador apasionado por construir aplicaciones móviles y web modernas, intuitivas
            y de alto rendimiento. Especializado en arquitecturas limpias, integración de APIs y
            experiencia de usuario excepcional.
          </ThemedText>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.statNumber}>100%</ThemedText>
              <ThemedText style={styles.statLabel} themeColor="textSecondary">
                Compromiso
              </ThemedText>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.statNumber}>ITLA</ThemedText>
              <ThemedText style={styles.statLabel} themeColor="textSecondary">
                Educación
              </ThemedText>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.statNumber}>RD 🇩🇴</ThemedText>
              <ThemedText style={styles.statLabel} themeColor="textSecondary">
                Ubicación
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Contact Links Card */}
        <ThemedView type="backgroundElement" style={styles.sectionCard}>
          <ThemedText type="subtitle">Canales de Contacto</ThemedText>
          <ThemedText style={styles.sectionHint} themeColor="textSecondary">
            Haz clic en cualquiera de las vías para iniciar contacto directo:
          </ThemedText>

          <View style={styles.contactList}>
            {/* Correo */}
            <Pressable
              style={({ pressed }) => [
                styles.contactItem,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressed,
              ]}
              onPress={() => openContact('mailto:isaaccabrera.dev@gmail.com')}>
              <View style={[styles.contactIconBg, { backgroundColor: '#EF4444' }]}>
                <Ionicons name="mail" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.contactTexts}>
                <ThemedText style={styles.contactTitle}>Correo Electrónico</ThemedText>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  isaaccabrerasilverio12@gmail.com
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </Pressable>

            {/* Teléfono / WhatsApp */}
            <Pressable
              style={({ pressed }) => [
                styles.contactItem,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressed,
              ]}
              onPress={() => openContact('tel:+18095551234')}>
              <View style={[styles.contactIconBg, { backgroundColor: '#10B981' }]}>
                <Ionicons name="call" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.contactTexts}>
                <ThemedText style={styles.contactTitle}>Teléfono / WhatsApp</ThemedText>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  +1 (809) 308-2048
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </Pressable>

            {/* GitHub */}
            <Pressable
              style={({ pressed }) => [
                styles.contactItem,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressed,
              ]}
              onPress={() => openContact('https://github.com/isak1956x')}>
              <View style={[styles.contactIconBg, { backgroundColor: '#333333' }]}>
                <Ionicons name="logo-github" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.contactTexts}>
                <ThemedText style={styles.contactTitle}>GitHub</ThemedText>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  github.com/Isak1956x
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </Pressable>

            {/* LinkedIn */}
            <Pressable
              style={({ pressed }) => [
                styles.contactItem,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressed,
              ]}
              onPress={() => openContact('https://www.linkedin.com/in/isaac-cabrera-silverio')}>
              <View style={[styles.contactIconBg, { backgroundColor: '#0A66C2' }]}>
                <Ionicons name="logo-linkedin" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.contactTexts}>
                <ThemedText style={styles.contactTitle}>LinkedIn</ThemedText>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  linkedin.com/in/isaaccabrera
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </Pressable>
          </View>
        </ThemedView>

        {/* Technical Skills Card */}
        <ThemedView type="backgroundElement" style={styles.sectionCard}>
          <ThemedText type="subtitle">Habilidades & Tecnologías</ThemedText>
          <View style={styles.skillsWrapper}>
            {skills.map((skill) => (
              <View
                key={skill}
                style={[styles.skillBadge, { backgroundColor: theme.backgroundSelected }]}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <ThemedText type="smallBold">{skill}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        {/* Hire Me CTA Button */}
        <Pressable
          style={({ pressed }) => [
            styles.hireButton,
            pressed && styles.pressed,
          ]}
          onPress={() => openContact('mailto:isaaccabrerasilverio12@gmail.com?subject=Propuesta%20de%20Trabajo')}>
          <Ionicons name="paper-plane" size={20} color="#FFFFFF" />
          <ThemedText style={styles.hireButtonText}>
            Contactar para Oportunidades Laborales
          </ThemedText>
        </Pressable>
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
  profileCard: {
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.two,
    position: 'relative',
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#6366F1',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: Spacing.three,
    paddingVertical: 4,
    borderRadius: Spacing.five,
    marginTop: -16,
    gap: Spacing.one,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  name: {
    fontSize: 24,
    textAlign: 'center',
  },
  role: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  bio: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    marginTop: Spacing.one,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    width: '100%',
    marginTop: Spacing.three,
  },
  statBox: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
  },
  sectionCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  sectionHint: {
    fontSize: 13,
  },
  contactList: {
    gap: Spacing.two,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  contactIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTexts: {
    flex: 1,
    gap: 2,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    gap: Spacing.one,
  },
  hireButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: Spacing.three,
    gap: Spacing.two,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  hireButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});
