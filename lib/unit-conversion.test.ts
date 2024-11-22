import { Unit } from '@prisma/client';

import {
  convertDistance,
  convertWeight,
  formatDistance,
  formatWeight,
} from '@/lib/unit-conversion';

describe('Unit Conversion', () => {
  describe('convertWeight', () => {
    it('should convert kg to lbs for imperial units', () => {
      expect(convertWeight(10, Unit.IMPERIAL)).toBe(22);
      expect(convertWeight(5.5, Unit.IMPERIAL)).toBe(12);
    });

    it('should round to nearest 0.5 lbs for imperial units', () => {
      expect(convertWeight(10.2, Unit.IMPERIAL)).toBe(22.5);
      expect(convertWeight(10, Unit.IMPERIAL)).toBe(22);
    });

    it('should round to 1 decimal place for metric units', () => {
      expect(convertWeight(10.26, Unit.METRIC)).toBe(10.3);
      expect(convertWeight(10.24, Unit.METRIC)).toBe(10.2);
    });
  });

  describe('formatWeight', () => {
    it('should format weight with correct unit for imperial', () => {
      expect(formatWeight(10, Unit.IMPERIAL)).toBe('22 lbs');
    });

    it('should format weight with correct unit for metric', () => {
      expect(formatWeight(10.2, Unit.METRIC)).toBe('10.2 kg');
    });
  });

  describe('convertDistance', () => {
    it('should convert km to miles for imperial units', () => {
      expect(convertDistance(10, Unit.IMPERIAL)).toBe(6.2);
      expect(convertDistance(5, Unit.IMPERIAL)).toBe(3.1);
    });

    it('should round to 1 decimal place for both units', () => {
      expect(convertDistance(10.26, Unit.IMPERIAL)).toBe(6.4);
      expect(convertDistance(10.24, Unit.METRIC)).toBe(10.2);
    });
  });

  describe('formatDistance', () => {
    it('should format distance with correct unit for imperial', () => {
      expect(formatDistance(10, Unit.IMPERIAL)).toBe('6.2 mi');
    });

    it('should format distance with correct unit for metric', () => {
      expect(formatDistance(10.2, Unit.METRIC)).toBe('10.2 km');
    });
  });
});
