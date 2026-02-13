"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "Радарный график по этапам разработки";

const chartData = [
  { tech: "Прототип", readiness: 100 },
  { tech: "База данных", readiness: 70 },
  { tech: "Бэкенд", readiness: 80 },
  { tech: "Фронтенд", readiness: 90 },
  { tech: "CI/CD", readiness: 85 },
  { tech: "Полный цикл", readiness: 100 },
];

const chartConfig = {
  readiness: {
    label: "Готовность",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StackRadarChart() {
  return (
    <Card className="h-full w-full rounded-none border-0 shadow-none">
      <CardHeader className="items-center pb-4">
        <CardTitle>Этапы разработки — готовность</CardTitle>
        <CardDescription>Берём отдельный этап или весь цикл целиком</CardDescription>
      </CardHeader>
      <CardContent className="pb-0 flex-1 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[420px] max-w-[420px]"
        >
          <RadarChart data={chartData} margin={{ top: 24, right: 32, bottom: 24, left: 32 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="tech" tick={{ fontSize: 12 }} tickMargin={12} />
            <Radar
              dataKey="readiness"
              fill="var(--color-readiness)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default StackRadarChart;
