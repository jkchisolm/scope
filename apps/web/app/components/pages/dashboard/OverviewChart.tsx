import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "~/components/ui/chart";
import dayjs from "dayjs";
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
        <li key={teamKey} className="flex items-center gap-2">
          {/* Color box */}
          <span
            className="w-[12px] h-[12px] rounded-xs inline-block"
            style={{
              backgroundColor: chartConfig[teamKey].color,
            }}
          />

          {/* Team label (you could add finalDayData[teamKey] here if you wish) */}
          <span className="text-black">{chartConfig[teamKey].label}</span>
        </li>
      ))}
    </ul>
  );
};

const SortedTooltip: React.FC<{
  active?: boolean;
  payload?: { dataKey: string; value: number; color?: string }[];
  label?: string;
  chartConfig: ChartConfig;
}> = ({ active, payload, label, chartConfig }) => {
  // If no data to show, return null (the tooltip won't display)
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Sort the payload array by the value in descending order
  const sortedPayload = [...payload].sort(
    (a, b) => (b as { value: number }).value - (a as { value: number }).value
  );

  // Format the label as a date string (optional).
  // If your 'label' is a string like "2025-03-15", this can parse that.
  // Adjust the date format to your preference.
  const dateLabel = dayjs(label).isValid()
    ? dayjs(label).format("MMM D, YYYY")
    : label;

  return (
    <div className="bg-white border-[0.5px] border-gray-300 rounded-md shadow-xs p-4">
      {/* Date / Title */}
      <p className="m-0 font-bold mb-2">{dateLabel}</p>

      <ul className="m-0 p-0 list-none w-full">
        {sortedPayload.map((item) => {
          const { dataKey, value } = item as {
            dataKey: string;
            value: number;
            color?: string;
          };
          const config = chartConfig[dataKey];
          // fallback to item.color if needed
          const color = config?.color ?? item.color;
          const labelText = config?.label ?? dataKey;
          const formattedValue =
            typeof value === "number" ? value.toLocaleString() : value;

          return (
            <li
              key={dataKey}
              className="flex items-center justify-between mb-1 gap-2 w-full"
            >
              {/* Color box */}
              <span
                className="w-3 h-3 inline-block rounded-xs"
                style={{
                  backgroundColor: color,
                }}
              />
              {/* Team name (slightly faded) and bold score */}
              <span className="w-full" style={{ color: "#666" }}>
                {labelText}{" "}
                <span className="font-bold text-black text-right">
                  {formattedValue}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const OverviewChart = ({ chartConfig, dailyPoints }: Props) => {
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
              content={<SortedTooltip chartConfig={chartConfig} />}
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
