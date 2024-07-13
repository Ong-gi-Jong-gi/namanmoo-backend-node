export type ChallengeStatus = "idle" | "ongoing" | "finished";
export type TotalRooms = {
  [key: string]: { users: string[]; challengeStatus: ChallengeStatus };
};
