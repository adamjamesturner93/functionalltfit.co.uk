'use server';

import { Measurement } from '@prisma/client';
import {
  differenceInYears,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';

import { prisma } from '@/lib/prisma';
import {
  AggregatedMeasurement,
  MeasurementInput,
  MeasurementType,
  TimePeriod,
} from '@/types/measurements';

export async function logMeasurement(userId: string, data: MeasurementInput) {
  try {
    const measurement = await prisma.measurement.create({
      data: {
        userId,
        ...data,
        date: data.date || new Date(),
      },
    });
    return { success: true, measurement };
  } catch (error) {
    console.error('Error logging measurement:', error);
    return { error: 'Failed to log measurement' };
  }
}

export async function deleteMeasurement(userId: string, measurementId: string) {
  try {
    await prisma.measurement.deleteMany({
      where: {
        id: measurementId,
        userId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting measurement:', error);
    return { error: 'Failed to delete measurement' };
  }
}

export async function getMeasurementHistory(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<{ measurements: Measurement[]; total: number }> {
  const skip = (page - 1) * pageSize;

  const [measurements, total] = await Promise.all([
    prisma.measurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.measurement.count({ where: { userId } }),
  ]);

  return { measurements, total };
}
export async function getMeasurementsAggregated(userId: string, timePeriod: TimePeriod) {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = endOfDay(now);
  let aggregationType: 'daily' | 'weekly' | 'monthly' | 'yearly';

  switch (timePeriod) {
    case '1w':
      startDate = startOfDay(subWeeks(now, 1));
      aggregationType = 'daily';
      break;
    case '1m':
      startDate = startOfMonth(subMonths(now, 1));
      aggregationType = 'weekly';
      break;
    case '3m':
    case '6m':
      startDate = startOfMonth(subMonths(now, timePeriod === '3m' ? 3 : 6));
      aggregationType = 'monthly';
      break;
    case '12m':
      startDate = startOfMonth(subMonths(now, 12));
      aggregationType = 'monthly';
      break;
    case 'all':
      const earliestMeasurement = await prisma.measurement.findFirst({
        where: { userId },
        orderBy: { date: 'asc' },
      });
      startDate = earliestMeasurement ? startOfDay(earliestMeasurement.date) : startOfDay(now);
      aggregationType = differenceInYears(now, startDate) >= 2 ? 'yearly' : 'monthly';
      break;
    default:
      return { error: 'Invalid time period' };
  }

  const measurements = await prisma.measurement.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  let aggregatedData;
  switch (aggregationType) {
    case 'daily':
      aggregatedData = aggregateDaily(measurements, startDate, endDate);
      break;
    case 'weekly':
      aggregatedData = aggregateWeekly(measurements, startDate, endDate);
      break;
    case 'monthly':
      aggregatedData = aggregateMonthly(measurements, startDate, endDate);
      break;
    case 'yearly':
      aggregatedData = aggregateYearly(measurements, startDate, endDate);
      break;
  }

  return { success: true, data: aggregatedData };
}

export async function getLatestMeasurement(userId: string) {
  try {
    const latestMeasurement = await prisma.measurement.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return { success: true, measurement: latestMeasurement };
  } catch (error) {
    console.error('Error fetching latest measurement:', error);
    return { error: 'Failed to fetch latest measurement' };
  }
}

export async function getMeasurements(userId: string, limit: number = 10, offset: number = 0) {
  try {
    const measurements = await prisma.measurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.measurement.count({
      where: { userId },
    });

    return { success: true, measurements, total };
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return { error: 'Failed to fetch measurements' };
  }
}

function aggregateDaily(
  measurements: Measurement[],
  startDate: Date,
  endDate: Date,
): AggregatedMeasurement[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days
    .map((day) => {
      const dayMeasurements = measurements.filter(
        (m) => m.date >= startOfDay(day) && m.date < endOfDay(day),
      );
      return aggregateMeasurements(dayMeasurements, day);
    })
    .filter((measurement): measurement is AggregatedMeasurement => measurement !== null);
}

function aggregateWeekly(
  measurements: Measurement[],
  startDate: Date,
  endDate: Date,
): AggregatedMeasurement[] {
  const weeks = eachWeekOfInterval({ start: startDate, end: endDate });

  return weeks
    .map((week) => {
      const weekStart = startOfWeek(week);
      const weekEnd = endOfWeek(week);
      const weekMeasurements = measurements.filter((m) => m.date >= weekStart && m.date <= weekEnd);
      return aggregateMeasurements(weekMeasurements, weekStart);
    })
    .filter((measurement): measurement is AggregatedMeasurement => measurement !== null);
}

function aggregateMonthly(
  measurements: Measurement[],
  startDate: Date,
  endDate: Date,
): AggregatedMeasurement[] {
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  return months
    .map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthMeasurements = measurements.filter(
        (m) => m.date >= monthStart && m.date <= monthEnd,
      );
      return aggregateMeasurements(monthMeasurements, monthStart);
    })
    .filter((measurement): measurement is AggregatedMeasurement => measurement !== null);
}

function aggregateYearly(
  measurements: Measurement[],
  startDate: Date,
  endDate: Date,
): AggregatedMeasurement[] {
  const years = eachYearOfInterval({ start: startDate, end: endDate });

  return years
    .map((year) => {
      const yearStart = startOfDay(new Date(+year, 0, 1));
      const yearEnd = endOfDay(new Date(+year, 11, 31));
      const yearMeasurements = measurements.filter((m) => m.date >= yearStart && m.date <= yearEnd);
      return aggregateMeasurements(yearMeasurements, yearStart);
    })
    .filter((measurement): measurement is AggregatedMeasurement => measurement !== null);
}

function aggregateMeasurements(
  measurements: Measurement[],
  date: Date,
): AggregatedMeasurement | null {
  const aggregated: { [key in MeasurementType]?: number } = {};
  const count: { [key in MeasurementType]?: number } = {};

  measurements.forEach((m) => {
    (Object.keys(m) as Array<keyof typeof m>).forEach((key) => {
      if (
        Object.values(MeasurementType).includes(key as MeasurementType) &&
        typeof m[key] === 'number'
      ) {
        if (!aggregated[key as MeasurementType]) {
          aggregated[key as MeasurementType] = 0;
          count[key as MeasurementType] = 0;
        }
        aggregated[key as MeasurementType]! += m[key] as number;
        count[key as MeasurementType]! += 1;
      }
    });
  });

  // If no measurements were aggregated, return null
  if (Object.keys(aggregated).length === 0) {
    return null;
  }

  Object.keys(aggregated).forEach((key) => {
    if (count[key as MeasurementType]! > 0) {
      aggregated[key as MeasurementType] = Number(
        (aggregated[key as MeasurementType]! / count[key as MeasurementType]!).toFixed(2),
      );
    }
  });

  return {
    date: date.toISOString(),
    ...aggregated,
  };
}
