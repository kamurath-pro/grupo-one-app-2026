import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Tipo de comunicado: 'texto' ou 'imagem'
 */
export type ComunicadoTipo = 'texto' | 'imagem';

/**
 * Estrutura de um comunicado
 */
export interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string; // Texto ou URL do Google Drive
  tipo: ComunicadoTipo;
  link?: string; // Link opcional (URL)
  unidades: string[]; // IDs das unidades ou 'TODAS'
  ordem: number;
  criadoEm: number; // timestamp
}

/**
 * Estado do contexto de comunicados
 */
interface ComunicadosState {
  comunicados: Comunicado[];
  loading: boolean;
  error: string | null;
}

/**
 * Ações do reducer
 */
type ComunicadosAction =
  | { type: 'SET_COMUNICADOS'; payload: Comunicado[] }
  | { type: 'ADD_COMUNICADO'; payload: Comunicado }
  | { type: 'UPDATE_COMUNICADO'; payload: Comunicado }
  | { type: 'REMOVE_COMUNICADO'; payload: string }
  | { type: 'REORDER_COMUNICADOS'; payload: Comunicado[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

/**
 * Contexto de comunicados
 */
export const ComunicadosContext = createContext<{
  state: ComunicadosState;
  addComunicado: (comunicado: Omit<Comunicado, 'id' | 'criadoEm'>) => Promise<void>;
  updateComunicado: (comunicado: Comunicado) => Promise<void>;
  removeComunicado: (id: string) => Promise<void>;
  reorderComunicados: (comunicados: Comunicado[]) => Promise<void>;
  loadComunicados: () => Promise<void>;
  getComunicadosByUnidade: (unidadeId: string) => Comunicado[];
}>({
  state: { comunicados: [], loading: false, error: null },
  addComunicado: async () => {},
  updateComunicado: async () => {},
  removeComunicado: async () => {},
  reorderComunicados: async () => {},
  loadComunicados: async () => {},
  getComunicadosByUnidade: () => [],
});

/**
 * Reducer para gerenciar estado de comunicados
 */
function comunicadosReducer(state: ComunicadosState, action: ComunicadosAction): ComunicadosState {
  switch (action.type) {
    case 'SET_COMUNICADOS':
      return { ...state, comunicados: action.payload, loading: false };
    case 'ADD_COMUNICADO':
      return { ...state, comunicados: [...state.comunicados, action.payload] };
    case 'UPDATE_COMUNICADO':
      return {
        ...state,
        comunicados: state.comunicados.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'REMOVE_COMUNICADO':
      return {
        ...state,
        comunicados: state.comunicados.filter((c) => c.id !== action.payload),
      };
    case 'REORDER_COMUNICADOS':
      return { ...state, comunicados: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

/**
 * Provider de comunicados
 */
export function ComunicadosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(comunicadosReducer, {
    comunicados: [],
    loading: false,
    error: null,
  });

  /**
   * Carrega comunicados do AsyncStorage
   */
  const loadComunicados = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const stored = await AsyncStorage.getItem('comunicados');
      if (stored) {
        const comunicados = JSON.parse(stored);
        dispatch({ type: 'SET_COMUNICADOS', payload: comunicados });
      }
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Erro ao carregar comunicados',
      });
    }
  }, []);

  /**
   * Adiciona novo comunicado
   */
  const addComunicado = useCallback(
    async (comunicado: Omit<Comunicado, 'id' | 'criadoEm'>) => {
      try {
        const newComunicado: Comunicado = {
          ...comunicado,
          id: Date.now().toString(),
          criadoEm: Date.now(),
        };

        dispatch({ type: 'ADD_COMUNICADO', payload: newComunicado });

        const updated = [...state.comunicados, newComunicado];
        await AsyncStorage.setItem('comunicados', JSON.stringify(updated));
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Erro ao adicionar comunicado',
        });
      }
    },
    [state.comunicados]
  );

  /**
   * Atualiza comunicado existente
   */
  const updateComunicado = useCallback(
    async (comunicado: Comunicado) => {
      try {
        dispatch({ type: 'UPDATE_COMUNICADO', payload: comunicado });

        const updated = state.comunicados.map((c) =>
          c.id === comunicado.id ? comunicado : c
        );
        await AsyncStorage.setItem('comunicados', JSON.stringify(updated));
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Erro ao atualizar comunicado',
        });
      }
    },
    [state.comunicados]
  );

  /**
   * Remove comunicado
   */
  const removeComunicado = useCallback(
    async (id: string) => {
      try {
        dispatch({ type: 'REMOVE_COMUNICADO', payload: id });

        const updated = state.comunicados.filter((c) => c.id !== id);
        await AsyncStorage.setItem('comunicados', JSON.stringify(updated));
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Erro ao remover comunicado',
        });
      }
    },
    [state.comunicados]
  );

  /**
   * Reordena comunicados
   */
  const reorderComunicados = useCallback(
    async (comunicados: Comunicado[]) => {
      try {
        dispatch({ type: 'REORDER_COMUNICADOS', payload: comunicados });
        await AsyncStorage.setItem('comunicados', JSON.stringify(comunicados));
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Erro ao reordenar comunicados',
        });
      }
    },
    []
  );

  /**
   * Retorna comunicados de uma unidade específica
   */
  const getComunicadosByUnidade = useCallback(
    (unidadeId: string): Comunicado[] => {
      return state.comunicados
        .filter((c) => c.unidades.includes('TODAS') || c.unidades.includes(unidadeId))
        .sort((a, b) => a.ordem - b.ordem);
    },
    [state.comunicados]
  );

  return (
    <ComunicadosContext.Provider
      value={{
        state,
        addComunicado,
        updateComunicado,
        removeComunicado,
        reorderComunicados,
        loadComunicados,
        getComunicadosByUnidade,
      }}
    >
      {children}
    </ComunicadosContext.Provider>
  );
}

/**
 * Hook para usar contexto de comunicados
 */
export function useComunicados() {
  const context = React.useContext(ComunicadosContext);
  if (!context) {
    throw new Error('useComunicados deve ser usado dentro de ComunicadosProvider');
  }
  return context;
}
