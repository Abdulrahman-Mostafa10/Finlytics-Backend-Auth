import {UserVerification} from "../entities/user-verification.entity";
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

export interface UserVerificationRepository {
  createOne(data: Partial<UserVerification>): Promise<UserVerification>;

  updateOne(
    filter: Query<UserVerification>,
    data: Partial<UserVerification> & MongoUpdateOperators<UserVerification>,
    options?: UpdateOptions
  ): Promise<UserVerification | null>;

  updateMany(
    filter: Query<UserVerification>,
    data: Partial<UserVerification> & MongoUpdateOperators<UserVerification>,
    options?: UpdateOptions
  ): Promise<UpdateManyResult>;

  getOne(
    filter: Query<UserVerification>,
    selections?: string,
    populateList?: PopulateOptions[]
  ): Promise<UserVerification | null>;

  getMany(
    filter: Query<UserVerification>,
    selections?: string,
    populateList?: PopulateOptions[],
    page?: number,
    limit?: number
  ): Promise<UserVerification[]>;

  bulkWrite(
    operations: AnyBulkWriteOperation<UserVerification>[]
  ): Promise<BulkWriteSummary>;

  aggregate<T = UserVerification>(pipeline: PipelineStage[]): Promise<T[]>;
}
