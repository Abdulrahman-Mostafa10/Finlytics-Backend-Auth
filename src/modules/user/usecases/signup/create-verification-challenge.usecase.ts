import jwt from "jsonwebtoken";
import {VerificationChallengeRepository} from "../../repositories/verification-challenge.repository";
import {CleanupExpiredChallengesUseCase} from "./cleanup-expired-challenges.usecase";
import {VerificationChallengePurposes} from "../../../../common/enums/verification-challenge-purposes.enum";
import {ChallengeJWTPayload} from "../../interfaces/challenge-jwt-payload.interface";
// Config
import {config} from "../../../../config/config";

type CreateVerificationChallengeUseCaseInput = {
  email: string;
  verificationCode: string;
};

type CreateVerificationChallengeUseCaseOutput = {
  challengeToken: string;
  challengeId: string;
  expiresIn: number;
};

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
}

export class CreateVerificationChallengeUseCase {
  constructor(
    private readonly verificationChallengeRepository: VerificationChallengeRepository,
    private readonly cleanupExpiredChallengeUseCase: CleanupExpiredChallengesUseCase
  ) {}

  async execute(
    data: CreateVerificationChallengeUseCaseInput
  ): Promise<CreateVerificationChallengeUseCaseOutput> {
    log("Creating a verification challenge", {email: data.email});
    data.email = data.email.toLowerCase();
    const expiresIn = 15 * 60 * 1000; // 15 min in ms
    const expiresAt = new Date(Date.now() + expiresIn);

    try {
      log("Marking old challenges as deleted");
      await this.verificationChallengeRepository.updateMany(
        {email: data.email, isUsed: false, isDeleted: false},
        {$set: {isDeleted: true}}
      );
      log("Old challenges updated");
    } catch (err) {
      log("Error updating old challenges", err);
      throw err;
    }

    let challenge;
    try {
      log("Creating new challenge entry in DB");
      challenge = await this.verificationChallengeRepository.createOne({
        email: data.email,
        verificationCode: data.verificationCode,
        isUsed: false,
        expiresAt,
      });
      log("Challenge created", {id: challenge.id});
    } catch (err) {
      log("Error creating challenge in DB", err);
      throw err;
    }

    const tokenPayload: ChallengeJWTPayload = {
      challengeId: challenge.id,
      email: data.email,
      purpose: VerificationChallengePurposes.EMAIL_VERIFICATION,
      iat: Math.floor(Date.now() / 1000),
    };

    let challengeToken: string;
    try {
      log("Signing JWT challenge token");
      challengeToken = jwt.sign(
        tokenPayload,
        config.auth.verificationTokenSecret!,
        {expiresIn: "15m"} // let jwt handle exp
      );
      log("JWT token signed successfully");
    } catch (err) {
      log("Error signing JWT token", err);
      throw err;
    }

    // Schedule cleanup of expired challenges
    setTimeout(async () => {
      try {
        log("Running scheduled cleanup of expired challenges");
        await this.cleanupExpiredChallengeUseCase.execute();
      } catch (err) {
        log("Error during scheduled cleanup", err);
      }
    }, expiresIn + 60000);

    return {
      challengeId: challenge.id,
      challengeToken,
      expiresIn,
    };
  }
}
