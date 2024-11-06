import { Unit } from "@prisma/client";

export function convertWeight(weight: number, unit: Unit): number {
  if (unit === Unit.IMPERIAL) {
    // Convert kg to lbs
    return Math.round(weight * 2.20462 * 2) / 2; // Round to nearest 0.5 lbs
  }
  // Default to metric (kg)
  return Math.round(weight * 10) / 10; // Round to 1 decimal place
}

export function formatWeight(weight: number, unit: Unit): string {
  const convertedWeight = convertWeight(weight, unit);
  return `${convertedWeight} ${unit === Unit.IMPERIAL ? "lbs" : "kg"}`;
}

export function convertDistance(distance: number, unit: Unit): number {
  if (unit === Unit.IMPERIAL) {
    // Convert km to miles
    return Math.round((distance / 1.60934) * 10) / 10; // Round to 1 decimal place
  }
  // Default to metric (km)
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

export function formatDistance(distance: number, unit: Unit): string {
  const convertedDistance = convertDistance(distance, unit);
  return `${convertedDistance} ${unit === Unit.IMPERIAL ? "mi" : "km"}`;
}
