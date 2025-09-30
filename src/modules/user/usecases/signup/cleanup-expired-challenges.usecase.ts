// Repositories
import {VerificationChallengeRepository} from "../../repositories/verification-challenge.repository";

export class CleanupExpiredChallengesUseCase {
  constructor(
    private readonly verificationChallengeRepository: VerificationChallengeRepository
  ) {}

  async execute(): Promise<number> {
    console.log(`Cleaning all challenges expiring after expiration interval`);
    
    const result = await this.verificationChallengeRepository.updateMany(
      {
        expiresAt: {$lte: new Date()},
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
        },
      }
    );

    return result.modifiedCount;
  }
}
