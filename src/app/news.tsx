import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
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
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface WPPost {
  id: number;
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

// Configuración de la página oficial de WordPress seleccionada
const WP_SITE = {
  name: 'Remolacha.net',
  tagline: 'Noticias y Actualidad en República Dominicana',
  logo: 'https://i0.wp.com/remolacha.net/wp-content/uploads/2017/11/cropped-logoqqremo_r1_c1.png?fit=140%2C140&ssl=1',
  apiUrl: 'https://remolacha.net/wp-json/wp/v2/posts?per_page=3&_embed=true',
  website: 'https://remolacha.net',
  badge: 'WordPress REST API',
};

// Helper para limpiar etiquetas HTML y decodificar entidades comunes
function cleanHtmlText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&hellip;/g, '...')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export default function WordPressNewsScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(WP_SITE.apiUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        },
      });
      if (!response.ok) {
        throw new Error(`Error en el servidor (${response.status})`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data.slice(0, 3));
      } else {
        throw new Error('Formato de datos no válido.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al obtener las noticias del sitio WordPress.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn('Error opening link:', e);
    }
  };

  const handleCopyApi = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(WP_SITE.apiUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('es-DO', {
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
          paddingTop: safeAreaInsets.top + Spacing.two,
          paddingBottom: safeAreaInsets.bottom + Spacing.four,
        },
      ]}>
      <View style={styles.innerContainer}>
      
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="newspaper-outline" size={32} color="#8E44AD" />
          </View>
          <ThemedText type="title" style={styles.title}>
            Noticias WordPress
          </ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textSecondary">
            Últimas 3 noticias publicadas en español vía WordPress REST API.
          </ThemedText>
        </View>

    
        <ThemedView type="backgroundElement" style={styles.siteCard}>
          <View style={styles.siteInfoTop}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: WP_SITE.logo }}
                style={styles.siteLogo}
                contentFit="contain"
              />
            </View>
            <View style={styles.siteMeta}>
              <View style={styles.badgeRow}>
                <ThemedText type="subtitle" style={styles.siteName}>
                  {WP_SITE.name}
                </ThemedText>
                <View style={styles.wpBadge}>
                  <Ionicons name="logo-wordpress" size={12} color="#FFFFFF" />
                  <ThemedText style={styles.wpBadgeText}>WordPress</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.siteTagline} themeColor="textSecondary">
                {WP_SITE.tagline}
              </ThemedText>
              <Pressable onPress={() => openUrl(WP_SITE.website)}>
                <ThemedText type="link">{WP_SITE.website}</ThemedText>
              </Pressable>
            </View>
          </View>

        </ThemedView>


        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color="#E74C3C" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <Pressable onPress={fetchPosts} style={styles.retryButton}>
              <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
            </Pressable>
          </View>
        )}


        {loading && (
          <ThemedView type="backgroundElement" style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#8E44AD" />
            <ThemedText style={{ marginTop: Spacing.two }} themeColor="textSecondary">
              Cargando últimas 3 noticias en español...
            </ThemedText>
          </ThemedView>
        )}

       
        {!loading &&
          posts.map((post, idx) => {
            const cleanTitle = cleanHtmlText(post.title?.rendered || 'Sin título');
            const cleanExcerpt = cleanHtmlText(post.excerpt?.rendered || 'Sin descripción');
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

            return (
              <ThemedView key={post.id} type="backgroundElement" style={styles.newsCard}>
                
                <View style={styles.newsBadgeRow}>
                  <View style={styles.orderBadge}>
                    <ThemedText style={styles.orderBadgeText}>
                      Noticia #{idx + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.postDate} themeColor="textSecondary">
                    {formatDate(post.date)}
                  </ThemedText>
                </View>

               
                {featuredImage ? (
                  <Image
                    source={{ uri: featuredImage }}
                    style={styles.newsImage}
                    contentFit="cover"
                    transition={300}
                  />
                ) : null}

             
                <ThemedText type="subtitle" style={styles.newsTitle}>
                  {cleanTitle}
                </ThemedText>

              
                <ThemedText style={styles.newsExcerpt} themeColor="textSecondary">
                  {cleanExcerpt}
                </ThemedText>

            
                <Pressable
                  style={({ pressed }) => [
                    styles.visitButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => openUrl(post.link)}>
                  <ThemedText style={styles.visitButtonText}>
                    Visitar Noticia Original
                  </ThemedText>
                  <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                </Pressable>
              </ThemedView>
            );
          })}
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
  siteCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  siteInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.one,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  siteLogo: {
    width: 48,
    height: 48,
  },
  siteMeta: {
    flex: 1,
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  siteName: {
    fontSize: 18,
  },
  siteTagline: {
    fontSize: 12,
  },
  wpBadge: {
    backgroundColor: '#8E44AD',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wpBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  apiNoticeBox: {
    backgroundColor: 'rgba(142, 68, 173, 0.1)',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  apiNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  apiUrlCode: {
    fontSize: 12,
    color: '#8E44AD',
    paddingVertical: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    alignSelf: 'flex-start',
    marginTop: Spacing.half,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(142, 68, 173, 0.15)',
  },
  copyButtonText: {
    color: '#8E44AD',
    fontSize: 12,
    fontWeight: '700',
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
  retryButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    backgroundColor: '#E74C3C',
    borderRadius: Spacing.two,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  loadingBox: {
    borderRadius: Spacing.four,
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newsBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderBadge: {
    backgroundColor: 'rgba(142, 68, 173, 0.15)',
    paddingHorizontal: Spacing.three,
    paddingVertical: 2,
    borderRadius: Spacing.four,
  },
  orderBadgeText: {
    color: '#8E44AD',
    fontWeight: '800',
    fontSize: 12,
  },
  postDate: {
    fontSize: 12,
  },
  newsImage: {
    width: '100%',
    height: 180,
    borderRadius: Spacing.three,
  },
  newsTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  newsExcerpt: {
    fontSize: 14,
    lineHeight: 20,
  },
  visitButton: {
    backgroundColor: '#8E44AD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  visitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
