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
      attended: !!attendanceStatus,
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

export const attendanceService = {
  getAttendanceForTeam,
};
