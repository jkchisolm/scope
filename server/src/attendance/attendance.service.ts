import { teamsService } from "#teams/teams.service.js";
import { PrismaClient } from "../../generated/prisma";
import { AttendanceResponse } from "../../lib/types";

const prisma = new PrismaClient();

const getAttendanceForTeam = async (teamId: string, date: string) => {
  const attendance = await prisma.meetingAttendance.findMany({
    where: {
      teamId: teamId,
      date: date,
    },
    include: {
      Member: true,
    },
  });

  // create an array of members with their attendance status. if the member is not in the attendance list, add them w/ attended set to false
  let attendedList: AttendanceResponse[];
  const members = await prisma.member.findMany({
    where: {
      teamId: teamId,
    },
    include: {
      Team: true,
      ActivityMember: true,
    },
  });

  attendedList = members.map((member) => {
    const attendanceStatus = attendance.find(
      (att) => att.memberId === member.id
    );
    return {
      id: attendanceStatus ? attendanceStatus.id : "",
      memberId: member.id,
      date: new Date(date),
      attended: attendanceStatus ? attendanceStatus.attended : false,
      isExcused: attendanceStatus ? attendanceStatus.isExcused : false,
      createdAt: attendanceStatus ? attendanceStatus.createdAt : new Date(),
      updatedAt: attendanceStatus ? attendanceStatus.updatedAt : new Date(),
      member: {
        memberId: member.id,
        name: member.name,
      },
      team: { id: teamId }, // Assuming team object only requires an id
    };
  });

  return attendedList;
};

// This function is stupid but it works don't question it
const getAllAttendanceForTeam = async (teamId: string) => {
  const attendancesByDate: Record<string, AttendanceResponse[]> = {};

  // Get team info
  const team = await teamsService.getTeam(teamId);

  // Create a date object from team.createdAt and set it to midnight
  const startDate = new Date(team.createdAt);
  startDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  const d = new Date(startDate);

  // Loop through each day from startDate until today
  while (d <= today) {
    const day = d.getDay(); // Local day-of-week: 0: Sunday, 1: Monday, etc.
    if (day === 2 || day === 4) {
      dates.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }

  // Optionally include today if it's Tuesday or Thursday.
  if (today.getDay() === 2 || today.getDay() === 4) {
    dates.push(new Date(today));
  }

  // Reverse the array so that the most recent dates come first.
  dates.reverse();

  // Execute all the getAttendanceForTeam calls concurrently.
  const results = await Promise.all(
    dates.map(async (date) => {
      const attendanceForDate = await getAttendanceForTeam(
        teamId,
        date.toISOString()
      );
      return { date: date.toISOString(), attendanceForDate };
    })
  );

  // Populate the results into the object.
  results.forEach(({ date, attendanceForDate }) => {
    attendancesByDate[date] = attendanceForDate;
  });

  return attendancesByDate;
};

const setAttendance = async (
  teamId: string,
  memberId: string,
  status: string,
  date: string
) => {
  const team = await teamsService.getTeam(teamId);
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });

  // console.log(teamId);
  // console.log(team);
  // console.log(memberId);
  // console.log(member);
  if (!team || !member) {
    throw new Error("Team or member not found");
  }

  console.log(status);

  const attended = status === "attended";
  const isExcused = status === "excused";
  const existingAttendance = await prisma.meetingAttendance.findFirst({
    where: {
      memberId: memberId,
      date: {
        equals: new Date(date),
      },
    },
  });

  let attendance;
  if (existingAttendance) {
    attendance = await prisma.meetingAttendance.update({
      where: { id: existingAttendance.id },
      data: {
        attended: attended,
        isExcused: isExcused,
      },
    });

    // if attended and isExcused are both false, then subtract 10 points from the team
    if (!attended && !isExcused) {
      await prisma.team.update({
        where: { id: teamId },
        data: {
          points: team.points - 10,
        },
      });
    } else {
      // if attended is true or isExcused is true, then add 10 points to the team
      await prisma.team.update({
        where: { id: teamId },
        data: {
          points: team.points + 10,
        },
      });
    }
  } else {
    attendance = await prisma.meetingAttendance.create({
      data: {
        memberId: memberId,
        teamId: teamId,
        attended: attended,
        isExcused: isExcused,
        date: new Date(date),
      },
    });

    // add 10 points to the team
    await prisma.team.update({
      where: { id: teamId },
      data: {
        points: team.points + 10,
      },
    });
  }

  return attendance;
};

export const attendanceService = {
  getAttendanceForTeam,
  getAllAttendanceForTeam,
  setAttendance,
};
