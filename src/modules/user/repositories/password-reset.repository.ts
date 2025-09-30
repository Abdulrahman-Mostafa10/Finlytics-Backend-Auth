// Entities
import { PasswordReset } from "../entities/password-reset.entity";

import {
  AnyBulkWriteOperation,
  BulkWriteSummary,
  MongoUpdateOperators,
  PipelineStage,
  PopulateOptions,
  Query,
  UpdateManyResult,
  UpdateOptions,
} from "../../../common/infrastructure/mongodb/types";


export interface PasswordResetRepository {
  createOne(data: Partial<PasswordReset>): Promise<PasswordReset>;

  updateOne(
    filter: Query<PasswordReset>,
    data: Partial<PasswordReset> & MongoUpdateOperators<PasswordReset>,
    options?: UpdateOptions
  ): Promise<PasswordReset | null>;

  updateMany(
    filter: Query<PasswordReset>,
    data: Partial<PasswordReset> & MongoUpdateOperators<PasswordReset>,
    options?: UpdateOptions
  ): Promise<UpdateManyResult>;

  getOne(
    filter: Query<PasswordReset>,
    selections?: string,
    populateList?: PopulateOptions[]
  ): Promise<PasswordReset | null>;

  getMany(
    filter: Query<PasswordReset>,
    selections?: string,
    populateList?: PopulateOptions[],
    page?: number,
    limit?: number
  ): Promise<PasswordReset[]>;

  bulkWrite(
    operations: AnyBulkWriteOperation<PasswordReset>[]
  ): Promise<BulkWriteSummary>;

  aggregate<T = PasswordReset>(pipeline: PipelineStage[]): Promise<T[]>;
}
