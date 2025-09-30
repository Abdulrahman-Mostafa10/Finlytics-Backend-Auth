// Entities
import {User} from "../entities/user.entity";

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

// User Repository Interface
export interface UserRepository {
  createOne(data: Partial<User>): Promise<User>;

  updateOne(
    filter: Query<User>,
    data: Partial<User> & MongoUpdateOperators<User>,
    options?: UpdateOptions
  ): Promise<User | null>;

  updateMany(
    filter: Query<User>,
    data: Partial<User> & MongoUpdateOperators<User>,
    options?: UpdateOptions
  ): Promise<UpdateManyResult>;

  getOne(
    filter: Query<User>,
    selections?: string,
    populateList?: PopulateOptions[]
  ): Promise<User | null>;

  getMany(
    filter: Query<User>,
    selections?: string,
    populateList?: PopulateOptions[],
    page?: number,
    limit?: number
  ): Promise<User[]>;

  bulkWrite(
    operations: AnyBulkWriteOperation<User>[]
  ): Promise<BulkWriteSummary>;

  aggregate<T = User>(pipeline: PipelineStage[]): Promise<T[]>;
}
