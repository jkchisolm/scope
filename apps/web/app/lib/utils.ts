import type { DailyPoints } from "@workspace/shared";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Combines multiple teams’ daily points into one array grouped by day.
 *
 * @param teamDailyPoints An array where each element is a team’s DailyPoints array.
 * @param teamKeys A string array of keys to label each team (e.g. ["team1", "team2", "team3", "team4"]).
 * @returns An array of objects. Each object represents one day and contains the date and the cumulative value for each team.
 */
export function getDailyCombinedPoints(
  teamDailyPoints: DailyPoints[][],
  teamKeys: string[]
) {
  // Object to group by each day.
  const dailyMap: {
    [date: string]: { date: string; [key: string]: number | string };
  } = {};

  // Loop through each team’s daily points.
  teamDailyPoints.forEach((teamArray, teamIndex) => {
    const key = teamKeys[teamIndex];
    teamArray.forEach(({ date, value }) => {
      if (!dailyMap[date]) {
        dailyMap[date] = { date };
      }
      dailyMap[date][key] = value;
    });
  });

  // Convert the grouped results into an array and sort them by date.
  return Object.values(dailyMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
