// IN the future, a monorepo setup could help better
// for now we stick server types here

// Team

export interface Team {
  id: string;
  name: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  color: string;
  dailyPoints: { date: string; value: number }[];
  Member: Member[];
  Activity: Activity[];
}

export interface CreateTeamInput {
  name: string;
  active: boolean;
  members: CreateMemberInput[];
}

export interface DailyPoints {
  date: string;
  value: number;
}

// Member

export type Member = {
  id: string;
  name: string;
  email?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  team: Team;
  teamId: string;
  activities: ActivityMember[];
};

export enum Role {
  MEMBER = "MEMBER",
  EBOARD = "EBOARD",
}

export interface CreateMemberInput {
  name: string;
  teamId: number;
  email?: string;
  role: "EBOARD" | "MEMBER";
}

// Activity

export type Activity = {
  id: string;
  name: string;
  points: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  Team: Team;
  teamId: string;
  category: ActivityCategory;
  categoryId: string;
  participants: ActivityMember[];
};

export type ActivityCategory = {
  id: string;
  name: string;
  description: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  activities: Activity[];
};

export type ActivityMember = {
  id: string;
  member: Member;
  memberId: string;
  activity: Activity;
  activityId: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateActivityBody {
  name: string;
  points: number;
  date: string;
  teamId: string;
  categoryId: string;
  members?: {
    memberId: string;
    points: number;
  }[];
}

export interface CreateBatchActivityBody {
  list: CreateActivityBody[];
}

export interface CreateCategoryBody {
  name: string;
  description: string;
  points: number;
}
