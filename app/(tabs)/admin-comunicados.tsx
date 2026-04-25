import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAppAuth, UNITS } from '@/lib/auth-context';
import { useComunicados, Comunicado, ComunicadoTipo } from '@/lib/comunicados-context';
import { useColors } from '@/hooks/use-colors';

/**
 * Tela de administração de comunicados
 */
export default function AdminComunicadosScreen() {
  const { user } = useAppAuth();
  const { state, addComunicado, updateComunicado, removeComunicado, reorderComunicados, loadComunicados } = useComunicados();
  const colors = useColors();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tipo, setTipo] = useState<ComunicadoTipo>('texto');
  const [link, setLink] = useState('');
  const [selectedUnidades, setSelectedUnidades] = useState<string[]>([]);

  // Carrega comunicados ao montar
  useEffect(() => {
    loadComunicados();
  }, [loadComunicados]);

  // Verifica se é admin
  if (user?.appRole !== 'admin') {
    return (
      <ScreenContainer className="p-4 justify-center items-center">
        <Text style={{ color: colors.foreground, fontSize: 16 }}>
          Acesso restrito a administradores
        </Text>
      </ScreenContainer>
    );
  }

  /**
   * Alterna seleção de unidade
   */
  const toggleUnidade = (unidadeId: string) => {
    if (unidadeId === 'TODAS') {
      setSelectedUnidades(selectedUnidades.includes('TODAS') ? [] : ['TODAS']);
    } else {
      const updated = selectedUnidades.filter((u) => u !== 'TODAS');
      if (updated.includes(unidadeId)) {
        setSelectedUnidades(updated.filter((u) => u !== unidadeId));
      } else {
        setSelectedUnidades([...updated, unidadeId]);
      }
    }
  };

  /**
   * Reseta formulário
   */
  const resetForm = () => {
    setTitulo('');
    setConteudo('');
    setTipo('texto');
    setLink('');
    setSelectedUnidades([]);
    setEditingId(null);
    setShowForm(false);
  };

  /**
   * Salva comunicado
   */
  const handleSave = async () => {
    if (!titulo.trim() || !conteudo.trim() || selectedUnidades.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (link.trim() && !isValidUrl(link.trim())) {
      Alert.alert('Erro', 'Link inválido');
      return;
    }

    try {
      const ordem = state.comunicados.length;

      if (editingId) {
        // Atualizar
        const comunicado = state.comunicados.find((c) => c.id === editingId);
        if (comunicado) {
          await updateComunicado({
            ...comunicado,
            titulo,
            conteudo,
            tipo,
            link: link.trim() || undefined,
            unidades: selectedUnidades,
          });
        }
      } else {
        // Criar novo
        await addComunicado({
          titulo,
          conteudo,
          tipo,
          link: link.trim() || undefined,
          unidades: selectedUnidades,
          ordem,
        });
      }

      Alert.alert('Sucesso', 'Comunicado salvo com sucesso');
      resetForm();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar comunicado');
    }
  };

  /**
   * Remove comunicado
   */
  const handleRemove = (id: string) => {
    Alert.alert('Confirmar', 'Deseja remover este comunicado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeComunicado(id);
            Alert.alert('Sucesso', 'Comunicado removido');
          } catch (error) {
            Alert.alert('Erro', 'Falha ao remover comunicado');
          }
        },
      },
    ]);
  };

  /**
   * Valida URL
   */
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Renderiza item de comunicado
   */
  const renderComunicado = ({ item }: { item: Comunicado }) => (
    <View
      style={[
        styles.comunicadoItem,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.comunicadoHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.comunicadoTitulo, { color: colors.foreground }]}>
            {item.titulo}
          </Text>
          <Text style={[styles.comunicadoTipo, { color: colors.muted }]}>
            {item.tipo === 'texto' ? 'Texto' : 'Imagem'} • {item.unidades.join(', ')}
          </Text>
        </View>
      </View>

      <View style={styles.comunicadoActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            setEditingId(item.id);
            setTitulo(item.titulo);
            setConteudo(item.conteudo);
            setTipo(item.tipo);
            setLink(item.link || '');
            setSelectedUnidades(item.unidades);
            setShowForm(true);
          }}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={() => handleRemove(item.id)}
        >
          <Text style={styles.actionButtonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Gerenciar Comunicados
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {state.comunicados.length} comunicado(s)
          </Text>
        </View>

        {/* Botão Novo Comunicado */}
        {!showForm && (
          <TouchableOpacity
            style={[styles.newButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Text style={styles.newButtonText}>+ Novo Comunicado</Text>
          </TouchableOpacity>
        )}

        {/* Formulário */}
        {showForm && (
          <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>
              {editingId ? 'Editar Comunicado' : 'Novo Comunicado'}
            </Text>

            {/* Título */}
            <Text style={[styles.label, { color: colors.foreground }]}>Título</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.foreground }]}
              placeholder="Digite o título"
              placeholderTextColor={colors.muted}
              value={titulo}
              onChangeText={setTitulo}
            />

            {/* Conteúdo */}
            <Text style={[styles.label, { color: colors.foreground }]}>Conteúdo</Text>
            <TextInput
              style={[styles.input, styles.textarea, { borderColor: colors.border, color: colors.foreground }]}
              placeholder="Digite o conteúdo ou URL da imagem (Google Drive)"
              placeholderTextColor={colors.muted}
              value={conteudo}
              onChangeText={setConteudo}
              multiline
            />

            {/* Tipo */}
            <Text style={[styles.label, { color: colors.foreground }]}>Tipo</Text>
            <View style={styles.typeSelector}>
              {(['texto', 'imagem'] as ComunicadoTipo[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: tipo === t ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setTipo(t)}
                >
                  <Text style={[styles.typeButtonText, { color: tipo === t ? '#FFF' : colors.foreground }]}>
                    {t === 'texto' ? 'Texto' : 'Imagem'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Link */}
            <Text style={[styles.label, { color: colors.foreground }]}>Link (Opcional)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.foreground }]}
              placeholder="https://exemplo.com"
              placeholderTextColor={colors.muted}
              value={link}
              onChangeText={setLink}
            />

            {/* Unidades */}
            <Text style={[styles.label, { color: colors.foreground }]}>Unidades</Text>
            <TouchableOpacity
              style={[
                styles.unidadeButton,
                {
                  backgroundColor: selectedUnidades.includes('TODAS') ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => toggleUnidade('TODAS')}
            >
              <Text
                style={[
                  styles.unidadeButtonText,
                  { color: selectedUnidades.includes('TODAS') ? '#FFF' : colors.foreground },
                ]}
              >
                ✓ TODAS
              </Text>
            </TouchableOpacity>

            {!selectedUnidades.includes('TODAS') && (
              <View style={styles.unidadesGrid}>
                {UNITS.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={[
                      styles.unidadeButton,
                      {
                        backgroundColor: selectedUnidades.includes(unit.id.toString())
                          ? colors.primary
                          : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => toggleUnidade(unit.id.toString())}
                  >
                    <Text
                      style={[
                        styles.unidadeButtonText,
                        {
                          color: selectedUnidades.includes(unit.id.toString()) ? '#FFF' : colors.foreground,
                        },
                      ]}
                    >
                      {selectedUnidades.includes(unit.id.toString()) ? '✓' : ''} {unit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Botões */}
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.muted }]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Lista de Comunicados */}
        {state.comunicados.length > 0 && !showForm && (
          <View>
            <Text style={[styles.listTitle, { color: colors.foreground }]}>Comunicados Existentes</Text>
            <FlatList
              data={state.comunicados}
              renderItem={renderComunicado}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {state.comunicados.length === 0 && !showForm && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.muted }]}>
              Nenhum comunicado criado ainda
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  newButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  newButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unidadesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  unidadeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  unidadeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 20,
  },
  comunicadoItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  comunicadoHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  comunicadoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  comunicadoTipo: {
    fontSize: 12,
  },
  comunicadoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
  },
});
