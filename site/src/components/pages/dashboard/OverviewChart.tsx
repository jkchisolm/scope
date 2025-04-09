import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type Props = {
  chartConfig: ChartConfig;
  dailyPoints: {
    [key: string]: string | number;
    date: string;
  }[];
};

const SortedLegend = ({ chartConfig, dailyPoints }: Props) => {
  // Retrieve final day’s data (assumes data is already sorted by date)
  const finalDayData = dailyPoints[dailyPoints.length - 1];

  // Get the team keys from your configuration object.
  const teamKeys = Object.keys(chartConfig);

  // Sort the keys based on final day scores (highest to lowest)
  teamKeys.sort((a, b) => Number(finalDayData[b]) - Number(finalDayData[a]));

  return (
    <ul className="w-full flex flex-row justify-center gap-4 mt-1">
      {teamKeys.map((teamKey) => (
        <li
          key={teamKey}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem", // Spacing between color box and text
          }}
        >
          {/* Color box */}
          <span
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: chartConfig[teamKey].color,
              display: "inline-block",
              borderRadius: "2px",
            }}
          />

          {/* Team label (you could add finalDayData[teamKey] here if you wish) */}
          <span style={{ color: "#000" }}>{chartConfig[teamKey].label}</span>
        </li>
      ))}
    </ul>
  );
};

export const OverviewChart = ({ chartConfig, dailyPoints }: Props) => {
  console.log("dailyPoints", dailyPoints);
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Team Overview</CardTitle>
        <CardDescription>
          Point history for all teams, from the start of scope cup.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={dailyPoints}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
            <ChartLegend
              content={
                <SortedLegend
                  chartConfig={chartConfig}
                  dailyPoints={dailyPoints}
                />
              }
            />
            {/** make a new line for each entry in chartConfig */}
            {Object.entries(chartConfig).map(([key, value]) => {
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={value.color}
                  strokeWidth={2}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
