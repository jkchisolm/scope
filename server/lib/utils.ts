import { Activity, Team } from "../generated/prisma";
import { DailyPoints } from "./types";

export function getTeamCumulativePoints(
  team: Team & { activities: Array<Activity> }
): DailyPoints[] {
  const result: DailyPoints[] = [];
  let cumulative = 0;

  // Normalize the team's creation date to the start of the day.
  const startDate = new Date(team.createdAt);
  startDate.setHours(0, 0, 0, 0);

  // Use today's date as the end date.
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  // Iterate day-by-day from team creation to today.
  for (
    let current = new Date(startDate);
    current <= endDate;
    current.setDate(current.getDate() + 1)
  ) {
    const dateStr = current.toISOString().split("T")[0] || "";

    // Calculate the sum of points for activities on the current day.
    const dailyPoints = team.activities
      .filter((activity) => {
        const actDate = new Date(activity.date);
        actDate.setHours(0, 0, 0, 0);
        return actDate.getTime() === current.getTime();
      })
      .reduce((sum, activity) => sum + activity.points, 0);

    cumulative += dailyPoints;
    result.push({ date: dateStr, value: cumulative });
  }

  return result;
}
