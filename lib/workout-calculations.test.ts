import { ExerciseMode } from '@prisma/client';

import { ExerciseSummary } from '@/app/actions/workouts';
import {
  calculateImprovements,
  calculateNextWorkoutWeight,
  isPersonalBest,
} from '@/lib/workout-calculations';

describe('Workout Calculations', () => {
  describe('calculateImprovements', () => {
    it('should return zero improvements if no previous performance', () => {
      const currentPerformance: ExerciseSummary = {
        id: '1',
        exerciseId: '1',
        name: 'Squat',
        weight: 100,
        reps: 10,
        time: 0,
        distance: 0,
        targetReps: 10,
        targetRounds: 3,
        targetWeight: 100,
        targetReached: true,
        improvement: {
          reps: 0,
          weight: 0,
          time: 0,
          distance: 0,
          totalWeight: 0,
        },
        nextWorkoutWeight: 100,
        performanceByRound: [],
        mode: ExerciseMode.REPS,
      };

      const result = calculateImprovements(currentPerformance, null);
      expect(result).toEqual({
        reps: 0,
        weight: 0,
        time: 0,
        distance: 0,
        totalWeight: 0,
      });
    });

    it('should calculate improvements correctly', () => {
      const currentPerformance: ExerciseSummary = {
        id: '1',
        exerciseId: '1',
        name: 'Squat',
        weight: 110,
        reps: 12,
        time: 60,
        distance: 0,
        targetReps: 10,
        targetRounds: 3,
        targetWeight: 100,
        targetReached: true,
        improvement: {
          reps: 0,
          weight: 0,
          time: 0,
          distance: 0,
          totalWeight: 0,
        },
        nextWorkoutWeight: 110,
        performanceByRound: [],
        mode: ExerciseMode.REPS,
      };

      const previousPerformance: ExerciseSummary = {
        id: '1',
        exerciseId: '1',
        name: 'Squat',
        weight: 100,
        reps: 10,
        time: 55,
        distance: 0,
        targetReps: 10,
        targetRounds: 3,
        targetWeight: 100,
        targetReached: true,
        improvement: {
          reps: 0,
          weight: 0,
          time: 0,
          distance: 0,
          totalWeight: 0,
        },
        nextWorkoutWeight: 100,
        performanceByRound: [],
        mode: ExerciseMode.REPS,
      };

      const result = calculateImprovements(currentPerformance, previousPerformance);
      expect(result).toEqual({
        reps: 2,
        weight: 10,
        time: 5,
        distance: 0,
        totalWeight: 320,
      });
    });
  });

  describe('calculateNextWorkoutWeight', () => {
    it('should increase weight by 5% and round to nearest 2.5 if target reached', () => {
      expect(calculateNextWorkoutWeight(100, true)).toBe(105);
      expect(calculateNextWorkoutWeight(101, true)).toBe(107.5);
    });

    it('should keep the same weight if target not reached', () => {
      expect(calculateNextWorkoutWeight(100, false)).toBe(100);
      expect(calculateNextWorkoutWeight(101, false)).toBe(101);
    });
  });

  describe('isPersonalBest', () => {
    const basePerformance: ExerciseSummary = {
      id: '1',
      exerciseId: '1',
      name: 'Exercise',
      weight: 100,
      reps: 10,
      time: 60,
      distance: 100,
      targetReps: 10,
      targetRounds: 3,
      targetWeight: 100,
      targetReached: true,
      improvement: {
        reps: 0,
        weight: 0,
        time: 0,
        distance: 0,
        totalWeight: 0,
      },
      nextWorkoutWeight: 100,
      performanceByRound: [],
      mode: ExerciseMode.REPS,
    };

    it('should return true if there is no previous best', () => {
      expect(isPersonalBest(basePerformance, null)).toBe(true);
    });

    it('should return true if reps are higher for REPS mode', () => {
      const current = { ...basePerformance, reps: 11, mode: ExerciseMode.REPS };
      const previous = { ...basePerformance, reps: 10, mode: ExerciseMode.REPS };
      expect(isPersonalBest(current, previous)).toBe(true);
    });

    it('should return false if reps are lower for REPS mode', () => {
      const current = { ...basePerformance, reps: 9, mode: ExerciseMode.REPS };
      const previous = { ...basePerformance, reps: 10, mode: ExerciseMode.REPS };
      expect(isPersonalBest(current, previous)).toBe(false);
    });

    it('should return true if time is higher for TIME mode', () => {
      const current = { ...basePerformance, time: 70, mode: ExerciseMode.TIME };
      const previous = { ...basePerformance, time: 60, mode: ExerciseMode.TIME };
      expect(isPersonalBest(current, previous)).toBe(true);
    });

    it('should return false if time is lower for TIME mode', () => {
      const current = { ...basePerformance, time: 50, mode: ExerciseMode.TIME };
      const previous = { ...basePerformance, time: 60, mode: ExerciseMode.TIME };
      expect(isPersonalBest(current, previous)).toBe(false);
    });

    it('should return true if distance is higher for DISTANCE mode', () => {
      const current = { ...basePerformance, distance: 110, mode: ExerciseMode.DISTANCE };
      const previous = { ...basePerformance, distance: 100, mode: ExerciseMode.DISTANCE };
      expect(isPersonalBest(current, previous)).toBe(true);
    });

    it('should return false if distance is lower for DISTANCE mode', () => {
      const current = { ...basePerformance, distance: 90, mode: ExerciseMode.DISTANCE };
      const previous = { ...basePerformance, distance: 100, mode: ExerciseMode.DISTANCE };
      expect(isPersonalBest(current, previous)).toBe(false);
    });

    it('should return false for unknown exercise mode', () => {
      const current = { ...basePerformance, mode: 'UNKNOWN' as ExerciseMode };
      const previous = { ...basePerformance, mode: 'UNKNOWN' as ExerciseMode };
      expect(isPersonalBest(current, previous)).toBe(false);
    });
  });
});
