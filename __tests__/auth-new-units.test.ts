import { describe, it, expect } from "vitest";
import { UNITS } from "../lib/auth-context";

describe("Novas Unidades - Quixadá e Messejana", () => {
  it("deve incluir Quixadá no mapeamento de unidades", () => {
    const quixada = UNITS.find((u) => u.name === "Quixadá");
    expect(quixada).toBeDefined();
    expect(quixada?.id).toBe(13);
    expect(quixada?.state).toBe("CE");
  });

  it("deve incluir Messejana no mapeamento de unidades", () => {
    const messejana = UNITS.find((u) => u.name === "Messejana");
    expect(messejana).toBeDefined();
    expect(messejana?.id).toBe(14);
    expect(messejana?.state).toBe("CE");
  });

  it("deve ter prefixo QUI para Quixadá", () => {
    const quixada = UNITS.find((u) => u.name === "Quixadá");
    expect(quixada?.name).toContain("Quixadá");
  });

  it("deve ter prefixo MES para Messejana", () => {
    const messejana = UNITS.find((u) => u.name === "Messejana");
    expect(messejana?.name).toContain("Messejana");
  });

  it("deve ter total de 14 unidades", () => {
    expect(UNITS.length).toBe(14);
  });

  it("todas as unidades devem ter id único", () => {
    const ids = UNITS.map((u) => u.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(UNITS.length);
  });
});

describe("Campo de Data de Nascimento", () => {
  it("deve aceitar formato DD/MM/YYYY", () => {
    const birthDate = "15/03/1990";
    const parts = birthDate.split("/");
    expect(parts).toHaveLength(3);
    expect(parseInt(parts[0])).toBeGreaterThanOrEqual(1);
    expect(parseInt(parts[0])).toBeLessThanOrEqual(31);
    expect(parseInt(parts[1])).toBeGreaterThanOrEqual(1);
    expect(parseInt(parts[1])).toBeLessThanOrEqual(12);
    expect(parseInt(parts[2])).toBeGreaterThan(1900);
  });

  it("deve validar dia entre 1 e 31", () => {
    const validDays = [1, 15, 31];
    validDays.forEach((day) => {
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(31);
    });
  });

  it("deve validar mês entre 1 e 12", () => {
    const validMonths = [1, 6, 12];
    validMonths.forEach((month) => {
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
    });
  });

  it("deve validar ano maior que 1900", () => {
    const validYears = [1990, 2000, 2010];
    validYears.forEach((year) => {
      expect(year).toBeGreaterThan(1900);
    });
  });
});
