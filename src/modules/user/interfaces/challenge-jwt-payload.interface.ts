export interface ChallengeJWTPayload {
  challengeId: string;
  email: string;
  purpose: string;
  iat: number;
}
