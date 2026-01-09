/**
 * Serviço de integração com Monday.com para buscar aniversariantes
 * 
 * Estrutura do quadro "Aniversariantes" (ID: 7432669882):
 * - name: Nome da colaboradora
 * - label__1: Unidade (prefixo: ARA, ST, GUS, CZ, VSA, LIV, MUR, VIL, COR, FOR, MACS, MACE)
 * - date: Data de aniversário (formato: YYYY-MM-DD)
 * - arquivos__1: Foto da colaboradora (URL do arquivo)
 */

export interface MondayBirthday {
  id: string;
  name: string;
  unitPrefix: string;
  unitName: string;
  birthDate: Date;
  photoUrl: string | null;
}

// Mapeamento de prefixos para nomes de unidades
const UNIT_PREFIX_MAP: Record<string, string> = {
  "ARA": "Araripina",
  "ST": "Serra Talhada",
  "GUS": "Garanhuns",
  "CZ": "Cajazeiras",
  "VSA": "Vitória de Sto Antão",
  "LIV": "Santana do Livramento",
  "MUR": "Muriaé",
  "VIL": "Vilhena",
  "COR": "Corumbá",
  "FOR": "Fortaleza",
  "MACS": "Shopping Plaza Macaé",
  "MACE": "Centro Macaé",
};

// ID do quadro de Aniversariantes no Monday.com
const BOARD_ID = 7432669882;

// Dados mockados para desenvolvimento (serão substituídos pela API real)
// Estes dados foram extraídos do Monday.com via MCP
const MOCK_BIRTHDAYS: MondayBirthday[] = [
  { id: "10725664009", name: "Narcisa", unitPrefix: "MACE", unitName: "Centro Macaé", birthDate: new Date("2026-07-18"), photoUrl: null },
  { id: "10725696065", name: "Maria Larissa", unitPrefix: "MACE", unitName: "Centro Macaé", birthDate: new Date("2026-11-12"), photoUrl: null },
  { id: "10725668995", name: "Mariane", unitPrefix: "MACE", unitName: "Centro Macaé", birthDate: new Date("2026-08-15"), photoUrl: null },
  { id: "10725669913", name: "Aylane", unitPrefix: "MACE", unitName: "Centro Macaé", birthDate: new Date("2026-03-24"), photoUrl: null },
  { id: "10725660326", name: "Ana Carla", unitPrefix: "MACE", unitName: "Centro Macaé", birthDate: new Date("2026-12-21"), photoUrl: "https://agencia087.monday.com/protected_static/25296793/resources/2605879490/WhatsApp%20Image%202025-12-08%20at%2012.02.20.jpeg" },
  { id: "10719896400", name: "Renata", unitPrefix: "MACS", unitName: "Shopping Plaza Macaé", birthDate: new Date("2026-06-08"), photoUrl: null },
  { id: "10719883938", name: "Nathalya", unitPrefix: "MACS", unitName: "Shopping Plaza Macaé", birthDate: new Date("2026-06-12"), photoUrl: null },
  { id: "10719887093", name: "Davi", unitPrefix: "MACE", unitName: "Centro Macaé", birthDate: new Date("2026-05-05"), photoUrl: null },
  { id: "10719883578", name: "Luana", unitPrefix: "MACS", unitName: "Shopping Plaza Macaé", birthDate: new Date("2026-04-15"), photoUrl: null },
  { id: "10719883395", name: "Deborah", unitPrefix: "MACS", unitName: "Shopping Plaza Macaé", birthDate: new Date("2026-09-22"), photoUrl: null },
  // Adicionar aniversariante de janeiro para teste
  { id: "test-jan-09", name: "Natália", unitPrefix: "ARA", unitName: "Araripina", birthDate: new Date("2026-01-09"), photoUrl: null },
  { id: "test-jan-15", name: "Fernanda", unitPrefix: "ST", unitName: "Serra Talhada", birthDate: new Date("2026-01-15"), photoUrl: null },
  { id: "test-jan-20", name: "Juliana", unitPrefix: "GUS", unitName: "Garanhuns", birthDate: new Date("2026-01-20"), photoUrl: null },
  { id: "test-jan-25", name: "Camila", unitPrefix: "CZ", unitName: "Cajazeiras", birthDate: new Date("2026-01-25"), photoUrl: null },
];

/**
 * Busca todos os aniversariantes do Monday.com
 * Por enquanto usa dados mockados, mas a estrutura está pronta para integração real
 */
export async function fetchBirthdaysFromMonday(): Promise<MondayBirthday[]> {
  // TODO: Implementar chamada real à API do Monday.com via servidor
  // A integração real requer um endpoint no servidor que use o MCP do Monday.com
  
  // Por enquanto, retorna dados mockados
  return MOCK_BIRTHDAYS;
}

/**
 * Filtra aniversariantes do mês atual
 */
export function getBirthdaysThisMonth(birthdays: MondayBirthday[]): MondayBirthday[] {
  const currentMonth = new Date().getMonth();
  return birthdays.filter(b => b.birthDate.getMonth() === currentMonth);
}

/**
 * Verifica se hoje é o aniversário de alguém
 */
export function isBirthdayToday(birthday: MondayBirthday): boolean {
  const today = new Date();
  return (
    birthday.birthDate.getDate() === today.getDate() &&
    birthday.birthDate.getMonth() === today.getMonth()
  );
}

/**
 * Obtém o nome da unidade a partir do prefixo
 */
export function getUnitNameFromPrefix(prefix: string): string {
  return UNIT_PREFIX_MAP[prefix] || prefix;
}

/**
 * Exporta as constantes para uso em outros módulos
 */
export { UNIT_PREFIX_MAP, BOARD_ID };
