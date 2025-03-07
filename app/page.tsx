"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchAdMetrics } from "@/hooks/useFetchAdMetrics";
import useSharedSocket from "@/hooks/useSharedSocket";
import { Activity, View } from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function Home() {
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
                {totalImpressions[0]?.impressions || 0}
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
          <Card className="col-span-7">
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
