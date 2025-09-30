import type {
  Query,
  MongoUpdateOperators,
  BulkWriteSummary,
  AnyBulkWriteOperation,
  PipelineStage,
  PopulateOptions,
  UpdateOptions,
  UpdateManyResult,
} from "../types";

// Generic Repository Interface
export interface BaseRepository<T> {
  createOne(data: Partial<T>): Promise<T>;

  createMany(data: Partial<T>[]): Promise<T[]>;

  updateOne(
    filter: Query<T>,
    data: Partial<T> & MongoUpdateOperators<T>,
    options?: UpdateOptions
  ): Promise<T | null>;

  updateMany(
    filter: Query<T>,
    data: Partial<T> & MongoUpdateOperators<T>,
    options?: UpdateOptions
  ): Promise<UpdateManyResult>;

  getOne(
    filter: Query<T>,
    selections?: string,
    populateList?: PopulateOptions[]
  ): Promise<T | null>;

  getMany(
    filter: Query<T>,
    selections?: string,
    populateList?: PopulateOptions[],
    page?: number,
    limit?: number
  ): Promise<T[]>;

  bulkWrite(operations: AnyBulkWriteOperation<T>[]): Promise<BulkWriteSummary>;

  aggregate<U = T>(pipeline: PipelineStage[]): Promise<U[]>;
}
