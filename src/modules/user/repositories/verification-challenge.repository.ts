// Entities
import {VerificationChallenge} from "../entities/verification-challenge.entity";

// Types
import {
  Query,
  MongoUpdateOperators,
  BulkWriteSummary,
  AnyBulkWriteOperation,
  PipelineStage,
  PopulateOptions,
  UpdateOptions,
  UpdateManyResult,
} from "../../../common/infrastructure/mongodb/types";

// VerificationChallenge Repository Interface
export interface VerificationChallengeRepository {
  createOne(
    data: Partial<VerificationChallenge>
  ): Promise<VerificationChallenge>;

  updateOne(
    filter: Query<VerificationChallenge>,
    data: Partial<VerificationChallenge> &
      MongoUpdateOperators<VerificationChallenge>,
    options?: UpdateOptions
  ): Promise<VerificationChallenge | null>;

  updateMany(
    filter: Query<VerificationChallenge>,
    data: Partial<VerificationChallenge> &
      MongoUpdateOperators<VerificationChallenge>,
    options?: UpdateOptions
  ): Promise<UpdateManyResult>;

  getOne(
    filter: Query<VerificationChallenge>,
    selections?: string,
    populateList?: PopulateOptions[]
  ): Promise<VerificationChallenge | null>;

  getMany(
    filter: Query<VerificationChallenge>,
    selections?: string,
    populateList?: PopulateOptions[],
    page?: number,
    limit?: number
  ): Promise<VerificationChallenge[]>;

  bulkWrite(
    operations: AnyBulkWriteOperation<VerificationChallenge>[]
  ): Promise<BulkWriteSummary>;

  aggregate<T = VerificationChallenge>(pipeline: PipelineStage[]): Promise<T[]>;
}
