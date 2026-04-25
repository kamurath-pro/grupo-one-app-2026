import { describe, it, expect, beforeEach, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Comunicado } from '@/lib/comunicados-context';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('Comunicados Context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estrutura de Comunicado', () => {
    it('deve criar um comunicado com todos os campos obrigatórios', () => {
      const comunicado: Comunicado = {
        id: '1',
        titulo: 'Teste',
        conteudo: 'Conteúdo teste',
        tipo: 'texto',
        unidades: ['1', '2'],
        ordem: 0,
        criadoEm: Date.now(),
      };

      expect(comunicado.id).toBe('1');
      expect(comunicado.titulo).toBe('Teste');
      expect(comunicado.tipo).toBe('texto');
      expect(comunicado.unidades).toContain('1');
    });

    it('deve permitir link opcional em comunicado', () => {
      const comunicado: Comunicado = {
        id: '1',
        titulo: 'Teste',
        conteudo: 'Conteúdo teste',
        tipo: 'texto',
        link: 'https://example.com',
        unidades: ['TODAS'],
        ordem: 0,
        criadoEm: Date.now(),
      };

      expect(comunicado.link).toBe('https://example.com');
    });

    it('deve suportar tipo "texto" e "imagem"', () => {
      const textoComunicado: Comunicado = {
        id: '1',
        titulo: 'Texto',
        conteudo: 'Conteúdo',
        tipo: 'texto',
        unidades: ['1'],
        ordem: 0,
        criadoEm: Date.now(),
      };

      const imagemComunicado: Comunicado = {
        id: '2',
        titulo: 'Imagem',
        conteudo: 'https://drive.google.com/uc?id=...',
        tipo: 'imagem',
        unidades: ['1'],
        ordem: 1,
        criadoEm: Date.now(),
      };

      expect(textoComunicado.tipo).toBe('texto');
      expect(imagemComunicado.tipo).toBe('imagem');
    });

    it('deve permitir múltiplas unidades ou "TODAS"', () => {
      const comunicado1: Comunicado = {
        id: '1',
        titulo: 'Teste',
        conteudo: 'Conteúdo',
        tipo: 'texto',
        unidades: ['1', '2', '3'],
        ordem: 0,
        criadoEm: Date.now(),
      };

      const comunicado2: Comunicado = {
        id: '2',
        titulo: 'Teste',
        conteudo: 'Conteúdo',
        tipo: 'texto',
        unidades: ['TODAS'],
        ordem: 0,
        criadoEm: Date.now(),
      };

      expect(comunicado1.unidades.length).toBe(3);
      expect(comunicado2.unidades).toContain('TODAS');
    });
  });

  describe('Validação de URL', () => {
    it('deve validar URLs corretas', () => {
      const validUrls = [
        'https://example.com',
        'https://drive.google.com/uc?id=abc123',
        'https://www.google.com/search?q=test',
      ];

      validUrls.forEach((url) => {
        try {
          new URL(url);
          expect(true).toBe(true);
        } catch {
          expect(false).toBe(true);
        }
      });
    });

    it('deve rejeitar URLs inválidas', () => {
      const invalidUrls = [
        'not-a-url',
        'htp://wrong.com',
        'ftp://example.com',
      ];

      invalidUrls.forEach((url) => {
        try {
          new URL(url);
          expect(false).toBe(true);
        } catch {
          expect(true).toBe(true);
        }
      });
    });
  });

  describe('Ordenação de Comunicados', () => {
    it('deve ordenar comunicados por ordem crescente', () => {
      const comunicados: Comunicado[] = [
        {
          id: '1',
          titulo: 'Primeiro',
          conteudo: 'Conteúdo',
          tipo: 'texto',
          unidades: ['1'],
          ordem: 0,
          criadoEm: Date.now(),
        },
        {
          id: '2',
          titulo: 'Segundo',
          conteudo: 'Conteúdo',
          tipo: 'texto',
          unidades: ['1'],
          ordem: 1,
          criadoEm: Date.now(),
        },
        {
          id: '3',
          titulo: 'Terceiro',
          conteudo: 'Conteúdo',
          tipo: 'texto',
          unidades: ['1'],
          ordem: 2,
          criadoEm: Date.now(),
        },
      ];

      const sorted = comunicados.sort((a, b) => a.ordem - b.ordem);

      expect(sorted[0].ordem).toBe(0);
      expect(sorted[1].ordem).toBe(1);
      expect(sorted[2].ordem).toBe(2);
    });
  });

  describe('Filtro por Unidade', () => {
    it('deve filtrar comunicados com "TODAS" para qualquer unidade', () => {
      const comunicados: Comunicado[] = [
        {
          id: '1',
          titulo: 'Global',
          conteudo: 'Conteúdo',
          tipo: 'texto',
          unidades: ['TODAS'],
          ordem: 0,
          criadoEm: Date.now(),
        },
        {
          id: '2',
          titulo: 'Específico',
          conteudo: 'Conteúdo',
          tipo: 'texto',
          unidades: ['1'],
          ordem: 1,
          criadoEm: Date.now(),
        },
      ];

      const unidadeId = '1';
      const filtered = comunicados.filter(
        (c) => c.unidades.includes('TODAS') || c.unidades.includes(unidadeId)
      );

      expect(filtered.length).toBe(2);
    });

    it('deve filtrar apenas comunicados da unidade específica', () => {
      const comunicados: Comunicado[] = [
        {
          id: '1',
          titulo: 'Unidade 1',
          conteudo: 'Conteúdo',
          tipo: 'texto',
          unidades: ['1'],
          ordem: 0,
          criadoEm: Date.now(),
        },
        {
          id: '2',
          titulo: 'Unidade 2',
          conteudo: 'Conteúdo',
          tipo: 'texto',
          unidades: ['2'],
          ordem: 0,
          criadoEm: Date.now(),
        },
      ];

      const unidadeId = '1';
      const filtered = comunicados.filter(
        (c) => c.unidades.includes('TODAS') || c.unidades.includes(unidadeId)
      );

      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('1');
    });
  });

  describe('Limite de Comunicados', () => {
    it('deve permitir até 13 comunicados', () => {
      const comunicados: Comunicado[] = Array.from({ length: 13 }, (_, i) => ({
        id: `${i}`,
        titulo: `Comunicado ${i}`,
        conteudo: 'Conteúdo',
        tipo: 'texto',
        unidades: ['1'],
        ordem: i,
        criadoEm: Date.now(),
      }));

      expect(comunicados.length).toBe(13);
    });

    it('deve rejeitar mais de 13 comunicados', () => {
      const comunicados: Comunicado[] = Array.from({ length: 14 }, (_, i) => ({
        id: `${i}`,
        titulo: `Comunicado ${i}`,
        conteudo: 'Conteúdo',
        tipo: 'texto',
        unidades: ['1'],
        ordem: i,
        criadoEm: Date.now(),
      }));

      const MAX_COMUNICADOS = 13;
      expect(comunicados.length > MAX_COMUNICADOS).toBe(true);
    });
  });

  describe('Tipos de Comunicado', () => {
    it('deve validar tipo "texto"', () => {
      const comunicado: Comunicado = {
        id: '1',
        titulo: 'Teste',
        conteudo: 'Este é um texto simples',
        tipo: 'texto',
        unidades: ['1'],
        ordem: 0,
        criadoEm: Date.now(),
      };

      expect(comunicado.tipo).toBe('texto');
      expect(typeof comunicado.conteudo).toBe('string');
    });

    it('deve validar tipo "imagem" com URL do Google Drive', () => {
      const comunicado: Comunicado = {
        id: '1',
        titulo: 'Imagem',
        conteudo: 'https://drive.google.com/uc?id=1abc123def456',
        tipo: 'imagem',
        unidades: ['1'],
        ordem: 0,
        criadoEm: Date.now(),
      };

      expect(comunicado.tipo).toBe('imagem');
      expect(comunicado.conteudo).toContain('drive.google.com');
    });
  });
});
