export interface IVerificationChallenge {
  id: string;
  email: string;
  verificationCode: string;
  expiresAt: Date;
  isUsed: boolean;
  purpose?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class VerificationChallenge implements IVerificationChallenge {
  constructor(probs: IVerificationChallenge) {
    Object.assign(this, probs);
  }
  id: string;
  email: string;
  verificationCode: string;
  isUsed: boolean;
  expiresAt: Date;
  purpose?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
