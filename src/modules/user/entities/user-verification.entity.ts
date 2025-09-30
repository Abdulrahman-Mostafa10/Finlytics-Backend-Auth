// Entities
import {VerificationChallenge} from "./verification-challenge.entity";

export interface IUserVerification {
  id: string;
  email: string;
  challengeId: string | VerificationChallenge;
  verificationCode: string;
  isVerified: boolean;
  expiresAt: Date;
  isDeleted?: boolean;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserVerification implements IUserVerification {
  constructor(probs: IUserVerification) {
    Object.assign(this, probs);
  }

  id: string;
  email: string;
  verificationCode: string;
  challengeId: string | VerificationChallenge;
  isVerified: boolean;
  expiresAt: Date;
  isDeleted?: boolean;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
