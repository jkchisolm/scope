/*
  Warnings:

  - Added the required column `attended` to the `MeetingAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeetingAttendance" ADD COLUMN     "attended" BOOLEAN NOT NULL;
