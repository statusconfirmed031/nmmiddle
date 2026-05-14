import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// Read the cities data JSON file
const citiesPath = path.resolve(__dirname, "../client/src/data/cities.json");
const citiesData = JSON.parse(fs.readFileSync(citiesPath, "utf-8"));

describe("AstroMap - City Data Validation", () => {
  describe("City Data", () => {
    it("should load 53 cities from the data file", () => {
      expect(citiesData).toHaveLength(53);
    });

    it("should have all required fields for each city", () => {
      citiesData.forEach((city: any) => {
        expect(city).toHaveProperty("name");
        expect(city).toHaveProperty("country");
        expect(city).toHaveProperty("category");
        expect(city).toHaveProperty("lat");
        expect(city).toHaveProperty("lng");
        expect(city).toHaveProperty("energy");
        expect(city).toHaveProperty("interpretation");
      });
    });

    it("should have valid category values (1, 2, or 3)", () => {
      citiesData.forEach((city: any) => {
        expect([1, 2, 3]).toContain(city.category);
      });
    });

    it("should have valid latitude and longitude", () => {
      citiesData.forEach((city: any) => {
        expect(city.lat).toBeGreaterThanOrEqual(-90);
        expect(city.lat).toBeLessThanOrEqual(90);
        expect(city.lng).toBeGreaterThanOrEqual(-180);
        expect(city.lng).toBeLessThanOrEqual(180);
      });
    });

    it("should have correct category distribution", () => {
      const favorable = citiesData.filter((c: any) => c.category === 1).length;
      const caution = citiesData.filter((c: any) => c.category === 2).length;
      const dangerous = citiesData.filter((c: any) => c.category === 3).length;

      expect(favorable).toBe(22);
      expect(caution).toBe(12);
      expect(dangerous).toBe(19);
    });
  });

  describe("City Categories", () => {
    it("should have at least one city in each category", () => {
      const hasCategory1 = citiesData.some((c: any) => c.category === 1);
      const hasCategory2 = citiesData.some((c: any) => c.category === 2);
      const hasCategory3 = citiesData.some((c: any) => c.category === 3);

      expect(hasCategory1).toBe(true);
      expect(hasCategory2).toBe(true);
      expect(hasCategory3).toBe(true);
    });

    it("should have unique city names", () => {
      const names = citiesData.map((c: any) => c.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(citiesData.length);
      expect(uniqueNames.size).toBe(53);
    });
  });

  describe("Data Integrity", () => {
    it("should have non-empty strings for name, country, energy, and interpretation", () => {
      citiesData.forEach((city: any) => {
        expect(city.name).toBeTruthy();
        expect(city.country).toBeTruthy();
        expect(city.energy).toBeTruthy();
        expect(city.interpretation).toBeTruthy();
      });
    });

    it("should have interpretation text longer than 10 characters", () => {
      citiesData.forEach((city: any) => {
        expect(city.interpretation.length).toBeGreaterThan(10);
      });
    });
  });
});
