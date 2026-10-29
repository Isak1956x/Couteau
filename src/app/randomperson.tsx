import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

interface RandomUserData {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  dob: {
    date: string;
    age: number;
  };
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export default function RandomPersonScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [user, setUser] = useState<RandomUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomPerson = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://randomuser.me/api/?results=1');
      if (!response.ok) {
        throw new Error(`Error en servidor (${response.status})`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setUser(data.results[0]);
      } else {
        throw new Error('No se encontró información de usuario.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al obtener persona aleatoria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPerson();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

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
            <Ionicons name="people-outline" size={32} color="#007AFF" />
          </View>
          <ThemedText type="title" style={styles.title}>
            Persona Aleatoria
          </ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Consulta perfiles aleatorios con nombre, apellido, fotografía, fecha de nacimiento y edad.
          </ThemedText>
        </View>

    
        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.pressed,
            loading && styles.disabledButton,
          ]}
          onPress={fetchRandomPerson}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="shuffle" size={20} color="#FFFFFF" />
              <ThemedText style={styles.refreshButtonText}>Generar Nueva Persona</ThemedText>
            </>
          )}
        </Pressable>


        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={22} color="#E74C3C" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <Pressable onPress={fetchRandomPerson} style={styles.retryButton}>
              <ThemedText style={styles.retryText}>Reintentar</ThemedText>
            </Pressable>
          </View>
        )}

    
        {loading && !user && (
          <ThemedView type="backgroundElement" style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={{ marginTop: Spacing.two }} themeColor="textSecondary">
              Cargando perfil aleatorio...
            </ThemedText>
          </ThemedView>
        )}


        {user && (
          <ThemedView type="backgroundElement" style={styles.profileCard}>
  
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: user.picture.large }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  transition={300}
                />
                <View
                  style={[
                    styles.genderBadge,
                    {
                      backgroundColor: user.gender === 'male' ? '#2196F3' : '#E91E63',
                    },
                  ]}>
                  <Ionicons
                    name={user.gender === 'male' ? 'male' : 'female'}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <ThemedText type="subtitle" style={styles.fullName}>
                {user.name.first} {user.name.last}
              </ThemedText>
              <ThemedText style={styles.userTitle} themeColor="textSecondary">
                {user.name.title}. {user.location.city}, {user.location.country}
              </ThemedText>
            </View>

           
            <View style={styles.highlightRow}>
            
              <View style={[styles.highlightBox, { backgroundColor: theme.backgroundSelected }]}>
                <Ionicons name="time-outline" size={20} color="#007AFF" />
                <ThemedText style={styles.highlightValue}>{user.dob.age} años</ThemedText>
                <ThemedText style={styles.highlightLabel} themeColor="textSecondary">
                  Edad
                </ThemedText>
              </View>

         
              <View style={[styles.highlightBox, { backgroundColor: theme.backgroundSelected }]}>
                <Ionicons
                  name={user.gender === 'male' ? 'man-outline' : 'woman-outline'}
                  size={20}
                  color={user.gender === 'male' ? '#2196F3' : '#E91E63'}
                />
                <ThemedText style={styles.highlightValue}>
                  {user.gender === 'male' ? 'Masculino' : 'Femenino'}
                </ThemedText>
                <ThemedText style={styles.highlightLabel} themeColor="textSecondary">
                  Género
                </ThemedText>
              </View>
            </View>

    
            <View style={styles.detailsList}>
          
              <View style={styles.detailItem}>
                <View style={styles.detailIconWrapper}>
                  <Ionicons name="person" size={18} color="#007AFF" />
                </View>
                <View style={styles.detailTexts}>
                  <ThemedText style={styles.detailLabel} themeColor="textSecondary">
                    Nombre
                  </ThemedText>
                  <ThemedText type="smallBold">{user.name.first}</ThemedText>
                </View>
              </View>

     
              <View style={styles.detailItem}>
                <View style={styles.detailIconWrapper}>
                  <Ionicons name="text-outline" size={18} color="#007AFF" />
                </View>
                <View style={styles.detailTexts}>
                  <ThemedText style={styles.detailLabel} themeColor="textSecondary">
                    Apellido
                  </ThemedText>
                  <ThemedText type="smallBold">{user.name.last}</ThemedText>
                </View>
              </View>

       
              <View style={styles.detailItem}>
                <View style={styles.detailIconWrapper}>
                  <Ionicons name="calendar-outline" size={18} color="#007AFF" />
                </View>
                <View style={styles.detailTexts}>
                  <ThemedText style={styles.detailLabel} themeColor="textSecondary">
                    Fecha de Nacimiento
                  </ThemedText>
                  <ThemedText type="smallBold">{formatDate(user.dob.date)}</ThemedText>
                </View>
              </View>

      
              <View style={styles.detailItem}>
                <View style={styles.detailIconWrapper}>
                  <Ionicons name="mail-outline" size={18} color="#007AFF" />
                </View>
                <View style={styles.detailTexts}>
                  <ThemedText style={styles.detailLabel} themeColor="textSecondary">
                    Correo Electrónico
                  </ThemedText>
                  <ThemedText type="smallBold">{user.email}</ThemedText>
                </View>
              </View>

              {/* Teléfono */}
              <View style={styles.detailItem}>
                <View style={styles.detailIconWrapper}>
                  <Ionicons name="call-outline" size={18} color="#007AFF" />
                </View>
                <View style={styles.detailTexts}>
                  <ThemedText style={styles.detailLabel} themeColor="textSecondary">
                    Teléfono
                  </ThemedText>
                  <ThemedText type="smallBold">{user.phone}</ThemedText>
                </View>
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
  refreshButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  refreshButtonText: {
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
  loadingCard: {
    borderRadius: Spacing.four,
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  errorText: {
    color: '#E74C3C',
    flex: 1,
  },
  retryButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    backgroundColor: '#E74C3C',
    borderRadius: Spacing.two,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  profileCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarSection: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.two,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.two,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  genderBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fullName: {
    textAlign: 'center',
    fontSize: 22,
  },
  userTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  highlightRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  highlightBox: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: 4,
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  highlightLabel: {
    fontSize: 12,
  },
  detailsList: {
    gap: Spacing.two,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
    gap: Spacing.three,
  },
  detailIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTexts: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
});
