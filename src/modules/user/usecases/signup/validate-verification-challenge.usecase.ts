// Libs
import jwt from "jsonwebtoken";

// Repositories
import {VerificationChallengeRepository} from "../../repositories/verification-challenge.repository";

// Interfaces
import {ChallengeJWTPayload} from "../../interfaces/challenge-jwt-payload.interface";

// Errors
import {ErrorResponse} from "../../../../common/responses/error-response";

// Enums
import {AuthErrorCodes} from "../../../../common/enums/errors/auth-error-codes.enum";


// Config
import {config} from "../../../../config/config";

type ValidateVerificationChallengeUseCaseOutput = {
  valid: boolean;
  challengeId?: string;
};

type ValidateVerificationChallengeUseCaseInput = {
  email: string;
  challengeToken: string;
  verificationCode: string;
};

export class ValidateVerificationChallengeUseCase {
  constructor(
    private readonly verificationChallengeRepository: VerificationChallengeRepository
  ) {}

  async execute(
    data: ValidateVerificationChallengeUseCaseInput
  ): Promise<ValidateVerificationChallengeUseCaseOutput> {
    console.log(`Validating the signed JWT challenges`);

    const decoded = jwt.verify(
      data.challengeToken,

      config.auth.verificationTokenSecret!

    ) as ChallengeJWTPayload;

    const {challengeId, email: tokenEmail} = decoded;

    const challenge = await this.verificationChallengeRepository.getOne({
      id: challengeId,
    });

    if (!challenge) {
      throw new ErrorResponse(
        "Challenge with that id does not exist",
        AuthErrorCodes.USER_VERIFICATION_CHALLENGE_NOT_FOUND_ERROR
      );
    }

    if (challenge.email !== data.email || tokenEmail !== data.email) {
      throw new ErrorResponse(
        "Email enterred is not found",
        AuthErrorCodes.USER_VERIFICATION_EMAIL_MISMATCH_ERROR
      );
    }

    if (challenge.verificationCode !== data.verificationCode) {
      throw new ErrorResponse(
        "Invalid verification code",
        AuthErrorCodes.USER_VERIFICATION_INVALID_VERIFICATION_CODE_ERROR
      );
    }

    if (new Date() > challenge.expiresAt) {
      const verificationChallenge =
        await this.verificationChallengeRepository.updateOne(
          {
            id: challengeId,
          },
          {isDeleted: true}
        );

      if (!verificationChallenge) {
        throw new ErrorResponse(
          "Verification Challenge not updated successfully",
          AuthErrorCodes.USER_VERIFICATION_UPDATE_FAILURE_ERROR
        );
      }

      throw new ErrorResponse(
        "Verification Challenge has expired",
        AuthErrorCodes.USER_VERIFICATION_UPDATE_FAILURE_ERROR
      );
    }

    this.verificationChallengeRepository.updateOne(
      {id: challengeId},
      {
        $set: {
          isUsed: true,
        },
      }
    );

    return {valid: true, challengeId};
  }
}
