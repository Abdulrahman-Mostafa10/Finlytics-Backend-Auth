// Libraries
import {Model} from "mongoose";

// Repositories
import {BaseRepositoryImpl} from "../../../../common/infrastructure/mongodb/repositories/base.repository.impl";
import {VerificationChallengeRepository} from "../../repositories/verification-challenge.repository";

// Entities
import {VerificationChallenge} from "../../entities/verification-challenge.entity";

// Schemas
import {VerificationChallengeDocument} from "../schemas/verification-challenge.schema";

// Mappers
import {VerificationChallengeMapper} from "../mappers/verification-challenge.mapper";

export class VerificationChallengeRepositoryImpl
  extends BaseRepositoryImpl<
    VerificationChallenge,
    VerificationChallengeDocument
  >
  implements VerificationChallengeRepository
{
  constructor(
    verificationChallengeModel: Model<VerificationChallengeDocument>
  ) {
    super(verificationChallengeModel, VerificationChallengeMapper);
  }
}
