// Libs
import {Types} from "mongoose";


// Entities
import {UserVerification} from "../../entities/user-verification.entity";

// Schemas
import {UserVerificationDocument} from "../../mongodb/schemas/user-verification.schema";
import {VerificationChallengeDocument} from "../schemas/verification-challenge.schema";

// Mappers
import {VerificationChallengeMapper} from "./verification-challenge.mapper";

export class UserVerificationMapper {
  static toDomain(
    userVerificationDoc: UserVerificationDocument
  ): UserVerification {
    return new UserVerification({
      id: userVerificationDoc.id,
      email: userVerificationDoc.email,
      verificationCode: userVerificationDoc.verificationCode,
      challengeId: userVerificationDoc.challengeId
        ? userVerificationDoc.challengeId instanceof Types.ObjectId
          ? userVerificationDoc.challengeId.toString()
          : VerificationChallengeMapper.toDomain(
              userVerificationDoc.challengeId as VerificationChallengeDocument
            )
        : undefined,
      isVerified: userVerificationDoc.isVerified,
      isDeleted: userVerificationDoc.isDeleted,
      verifiedAt: userVerificationDoc.verifiedAt,
      expiresAt: userVerificationDoc.expiresAt,
      createdAt: userVerificationDoc.createdAt,
      updatedAt: userVerificationDoc.updatedAt,
    });
  }

  static toPersistence(
    userVerification: UserVerification
  ): Partial<UserVerificationDocument> {
    return {
      _id: userVerification.id
        ? new Types.ObjectId(userVerification.id as string)
        : undefined,
      email: userVerification.email,
      verificationCode: userVerification.verificationCode,
      challengeId: userVerification.challengeId
        ? Types.ObjectId.createFromHexString(
            userVerification.challengeId as string
          )
        : undefined,
      isVerified: userVerification.isVerified,
      isDeleted: userVerification.isDeleted,
      expiresAt: userVerification.expiresAt,
      createdAt: userVerification.createdAt,
      updatedAt: userVerification.updatedAt,
    };
  }
}
