import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useComunicados, Comunicado } from '@/lib/comunicados-context';
import { useAppAuth } from '@/lib/auth-context';
import { useColors } from '@/hooks/use-colors';

const { width } = Dimensions.get('window');

/**
 * Componente de carrossel de comunicados
 */
export function ComunicadoCarousel() {
  const { user: authUser } = useAppAuth();
  const { getComunicadosByUnidade } = useComunicados();
  const colors = useColors();

  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const unidadeId = authUser?.unitIds?.[0]?.toString() || '';

  /**
   * Carrega comunicados da unidade do usuário
   */
  useEffect(() => {
    if (unidadeId) {
      const comunicadosList = getComunicadosByUnidade(unidadeId);
      setComunicados(comunicadosList);
    }
  }, [unidadeId, getComunicadosByUnidade]);

  /**
   * Trata scroll do carrossel
   */
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  /**
   * Abre link do comunicado
   */
  const handleComunicadoPress = async (link?: string) => {
    if (link) {
      try {
        const canOpen = await Linking.canOpenURL(link);
        if (canOpen) {
          await Linking.openURL(link);
        }
      } catch (error) {
        console.error('Erro ao abrir link:', error);
      }
    }
  };

  // Se não houver comunicados, não renderiza nada
  if (comunicados.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Carrossel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {comunicados.map((comunicado) => (
          <TouchableOpacity
            key={comunicado.id}
            onPress={() => handleComunicadoPress(comunicado.link)}
            activeOpacity={0.8}
            style={[styles.slide, { width }]}
          >
            {comunicado.tipo === 'texto' ? (
              <View
                style={[
                  styles.textSlide,
                  { backgroundColor: colors.primary, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.title, { color: '#FFFFFF' }]}>
                  {comunicado.titulo}
                </Text>
                <Text style={[styles.content, { color: '#FFFFFF' }]}>
                  {comunicado.conteudo}
                </Text>
                {comunicado.link && (
                  <View style={styles.linkIndicator}>
                    <Text style={styles.linkText}>Toque para saber mais →</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.imageSlide}>
                <Image
                  source={{ uri: comunicado.conteudo }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {comunicado.link && (
                  <View style={styles.linkOverlay}>
                    <Text style={styles.linkText}>Toque para saber mais →</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicadores de página */}
      {comunicados.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {comunicados.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === currentIndex ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  carousel: {
    height: 180,
  },
  slide: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  textSlide: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  imageSlide: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  linkIndicator: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  linkOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
