"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchAdMetrics } from "@/hooks/useFetchAdMetrics";
import useSharedSocket from "@/hooks/useSharedSocket";
import { Activity, DollarSign, Users, View } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const generateData = () => ({
  views: Math.floor(Math.random() * 1000) + 500,
  clicks: Math.floor(Math.random() * 200) + 100,
  revenue: Math.floor(Math.random() * 5000) + 1000,
  ctr: (Math.random() * 5 + 2).toFixed(2),
});

const generatePieData = () => [
  { name: "Desktop", value: Math.floor(Math.random() * 60) + 40 },
  { name: "Mobile", value: Math.floor(Math.random() * 40) + 20 },
  { name: "Tablet", value: Math.floor(Math.random() * 20) + 10 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

export default function Home() {
  const [deviceData, setDeviceData] = useState(generatePieData());

  const {
    data: initialData,
    isLoading,
    isError,
  } = useFetchAdMetrics(`sum(ad_impressions) by (date)`);

  const { data: initialTotalImpressions } =
    useFetchAdMetrics(`sum(ad_impressions)`);

  const [messages, totalImpressions] = useSharedSocket(
    initialData,
    initialTotalImpressions
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceData(generatePieData());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div>Loading initial data...</div>;
  }

  if (isError) {
    return <div>Failed to load initial data.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-teal-600 dark:text-teal-400">
          Ad Performance Dashboard
        </h1>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <View className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalImpressions[0].impressions}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recording Couts
              </CardTitle>
              <Activity className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Ads Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={messages}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="impressions"
                    stroke="green"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="impressions"
                    stroke="red"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-7">
            <CardHeader>
              <CardTitle>Ads by Date</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={messages}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="impressions"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
