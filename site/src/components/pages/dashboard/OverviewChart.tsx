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
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
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
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      }}
    >
      {/* Date / Title */}
      <p style={{ margin: 0, fontWeight: "bold", marginBottom: "0.5rem" }}>
        {dateLabel}
      </p>

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
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
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.25rem",
                gap: "0.5rem",
              }}
            >
              {/* Color box */}
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: color,
                  display: "inline-block",
                  borderRadius: "2px",
                }}
              />
              {/* Team name (slightly faded) and bold score */}
              <span style={{ color: "#666" }}>
                {labelText}{" "}
                <span style={{ fontWeight: "bold", color: "#000" }}>
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
