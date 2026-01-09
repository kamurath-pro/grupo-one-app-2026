// Configuração das planilhas de métricas por unidade
// Cada planilha do Google Sheets contém dados de tráfego pago em tempo real

export interface UnidadeMetricas {
  id: string;
  nome: string;
  sheetId: string; // ID da planilha do Google Sheets
  sheetUrl: string; // URL completa da planilha
}

// Mapeamento das unidades com suas respectivas planilhas de métricas
export const UNIDADES_METRICAS: UnidadeMetricas[] = [
  {
    id: "araripina",
    nome: "Araripina",
    sheetId: "1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI/edit?usp=sharing",
  },
  {
    id: "vitoria",
    nome: "Vitória Sto Antão",
    sheetId: "1bZYM4-Iw-7TWMtNcgX1apj5jrSpR1pBPXKAVxciSOWo",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1bZYM4-Iw-7TWMtNcgX1apj5jrSpR1pBPXKAVxciSOWo/edit?usp=sharing",
  },
  // Outras unidades serão adicionadas conforme os links forem fornecidos
  // Serra Talhada, Garanhuns, Cajazeiras, Livramento, Muriaé, Vilhena, Corumbá, Fortaleza, Macaé Plaza, Macaé Centro
];

// Função para extrair o ID da planilha a partir da URL
export function extractSheetId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Função para obter a URL de exportação CSV da planilha
export function getSheetCsvUrl(sheetId: string, gid: string = "0"): string {
  return "https://docs.google.com/spreadsheets/d/" + sheetId + "/export?format=csv&gid=" + gid;
}

// Função para obter a URL da API pública do Google Sheets (requer planilha pública)
export function getSheetApiUrl(sheetId: string, range: string = "A:Z"): string {
  return "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:json&range=" + range;
}
