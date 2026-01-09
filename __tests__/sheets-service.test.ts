import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatCurrency, formatNumber } from "../lib/sheets-service";
import { extractSheetId as extractId } from "../lib/metricas-config";

describe("Sheets Service", () => {
  describe("formatCurrency", () => {
    it("should format number as BRL currency", () => {
      expect(formatCurrency(46.06)).toMatch(/R\$\s*46,06/);
      expect(formatCurrency(1000)).toMatch(/R\$\s*1\.000,00/);
      expect(formatCurrency(0)).toMatch(/R\$\s*0,00/);
    });
  });

  describe("formatNumber", () => {
    it("should format small numbers normally", () => {
      expect(formatNumber(58)).toBe("58");
      expect(formatNumber(999)).toBe("999");
    });

    it("should format thousands with K suffix", () => {
      expect(formatNumber(1000)).toBe("1.0K");
      expect(formatNumber(12942)).toBe("12.9K");
      expect(formatNumber(43473)).toBe("43.5K");
    });

    it("should format millions with M suffix", () => {
      expect(formatNumber(1000000)).toBe("1.0M");
      expect(formatNumber(2500000)).toBe("2.5M");
    });
  });
});

describe("Metricas Config", () => {
  describe("extractSheetId", () => {
    it("should extract sheet ID from Google Sheets URL", () => {
      const url = "https://docs.google.com/spreadsheets/d/1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI/edit?usp=sharing";
      expect(extractId(url)).toBe("1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI");
    });

    it("should return null for invalid URL", () => {
      expect(extractId("https://google.com")).toBeNull();
      expect(extractId("invalid")).toBeNull();
    });
  });
});
