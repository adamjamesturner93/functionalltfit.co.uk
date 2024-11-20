'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type BodyMeasurement = {
  date: Date;
  weight: number;
  calve: number | null;
  thigh: number | null;
  waist: number | null;
  hips: number | null;
  butt: number | null;
  chest: number | null;
  arm: number | null;
};

type BodyMeasurementGraphProps = {
  data: BodyMeasurement[];
};

export function BodyMeasurementGraph({ data }: BodyMeasurementGraphProps) {
  const [timeRange, setTimeRange] = useState('30');
  const [metric, setMetric] = useState('weight');

  const formattedData = data.slice(-parseInt(timeRange)).map((measurement) => ({
    ...measurement,
    date: format(new Date(measurement.date), 'MMM d'),
    totalCm:
      (measurement.calve || 0) +
      (measurement.thigh || 0) +
      (measurement.waist || 0) +
      (measurement.hips || 0) +
      (measurement.butt || 0) +
      (measurement.chest || 0) +
      (measurement.arm || 0),
  }));

  const metrics = {
    weight: { label: 'Weight', color: 'hsl(var(--chart-1))' },
    totalCm: { label: 'Total cm', color: 'hsl(var(--chart-2))' },
    calve: { label: 'Calve', color: 'hsl(var(--chart-3))' },
    thigh: { label: 'Thigh', color: 'hsl(var(--chart-4))' },
    waist: { label: 'Waist', color: 'hsl(var(--chart-5))' },
    hips: { label: 'Hips', color: 'hsl(var(--chart-6))' },
    butt: { label: 'Butt', color: 'hsl(var(--chart-7))' },
    chest: { label: 'Chest', color: 'hsl(var(--chart-8))' },
    arm: { label: 'Arm', color: 'hsl(var(--chart-9))' },
  };

  return (
    <>
      <div className="mb-4 flex space-x-4">
        <Select onValueChange={setTimeRange} defaultValue={timeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="180">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setMetric} defaultValue={metric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(metrics).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={{
          [metric]: {
            label: metrics[metric as keyof typeof metrics].label,
            color: metrics[metric as keyof typeof metrics].color,
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey={metric}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
}
