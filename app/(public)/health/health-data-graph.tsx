"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type HealthData = {
  date: Date;
  weight: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  restingHeartRate?: number;
  sleepHours?: number;
  stressLevel?: number;
};

type HealthDataGraphProps = {
  data: HealthData[];
};

export function HealthDataGraph({ data }: HealthDataGraphProps) {
  const [timeRange, setTimeRange] = useState("30");
  const [metric, setMetric] = useState("weight");

  const filteredData = data.slice(-parseInt(timeRange));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Health Data Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Select onValueChange={setTimeRange} defaultValue={timeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setMetric} defaultValue={metric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="bloodPressureSystolic">
                Blood Pressure (Systolic)
              </SelectItem>
              <SelectItem value="bloodPressureDiastolic">
                Blood Pressure (Diastolic)
              </SelectItem>
              <SelectItem value="restingHeartRate">
                Resting Heart Rate
              </SelectItem>
              <SelectItem value="sleepHours">Sleep Hours</SelectItem>
              <SelectItem value="stressLevel">Stress Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
