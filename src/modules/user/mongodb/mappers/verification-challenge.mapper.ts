// Lib
import {Types} from "mongoose";

// Entities
import {VerificationChallenge} from "../../entities/verification-challenge.entity";

// Schemas
import {VerificationChallengeDocument} from "../../mongodb/schemas/verification-challenge.schema";

export class VerificationChallengeMapper {
  static toDomain(
    verificationChallengeDoc: VerificationChallengeDocument
  ): VerificationChallenge {
    return new VerificationChallenge({
      id: verificationChallengeDoc.id,
      email: verificationChallengeDoc.email,
      verificationCode: verificationChallengeDoc.verificationCode,
      isUsed: verificationChallengeDoc.isUsed,
      expiresAt: verificationChallengeDoc.expiresAt,
      purpose: verificationChallengeDoc.purpose,
      isDeleted: verificationChallengeDoc.isDeleted,
      createdAt: verificationChallengeDoc.createdAt,
      updatedAt: verificationChallengeDoc.updatedAt,
    });
  }

  static toPersistence(
    verificationChallenge: VerificationChallenge
  ): Partial<VerificationChallengeDocument> {
    return {
      _id: verificationChallenge.id
        ? new Types.ObjectId(verificationChallenge.id as string)
        : undefined,
      email: verificationChallenge.email,
      verificationCode: verificationChallenge.verificationCode,
      isUsed: verificationChallenge.isUsed,
      expiresAt: verificationChallenge.expiresAt,
      purpose: verificationChallenge.purpose,
      isDeleted: verificationChallenge.isDeleted,
      createdAt: verificationChallenge.createdAt,
      updatedAt: verificationChallenge.updatedAt,
    };
  }
}
