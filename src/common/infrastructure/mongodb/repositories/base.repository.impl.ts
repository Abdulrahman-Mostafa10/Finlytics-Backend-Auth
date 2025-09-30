// Lib
import {Model, PipelineStage as MongoosePipeLine} from "mongoose";

// Mappers
import {BaseMapper} from "../mappers/base.mapper";

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
} from "../types";
import {BaseRepository} from "./base.repository";

// Generic Repository Implementation
export abstract class BaseRepositoryImpl<T, D> implements BaseRepository<T> {
  constructor(
    protected readonly model: Model<D>,
    protected readonly mapper: {toDomain: (doc: D) => T}
  ) {}

  async createOne(data: Partial<T>): Promise<T> {
    const document = await this.model.create(data);
    return this.mapper.toDomain(document);
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    const documents = (await this.model.insertMany(data)) as unknown as D[];
    return documents.map(this.mapper.toDomain);
  }

  async updateOne(
    filter: Query<T>,
    data: Partial<T> & MongoUpdateOperators<T>,
    options: UpdateOptions = {runValidators: true, new: true}
  ): Promise<T | null> {
    filter = BaseMapper.filterMapper(filter);
    const document = await this.model
      .findOneAndUpdate({...filter, isDeleted: false}, data, options)
      .exec();
    return document ? this.mapper.toDomain(document) : null;
  }

  async updateMany(
    filter: Query<T>,
    data: Partial<T> & MongoUpdateOperators<T>,
    options: UpdateOptions = {runValidators: true, new: true}
  ): Promise<UpdateManyResult> {
    filter = BaseMapper.filterMapper(filter);

    const result = await this.model
      .updateMany({...filter}, data, options)
      .exec();

    return result as UpdateManyResult;
  }

  async getOne(
    filter: Query<T>,
    selections: string = "",
    populateList: PopulateOptions[] = []
  ): Promise<T | null> {
    filter = BaseMapper.filterMapper(filter); // <-- use BaseMapper
    const document = await this.model
      .findOne(filter)
      .select(selections)
      .populate(populateList)
      .exec();
    return document ? this.mapper.toDomain(document) : null;
  }

  async getMany(
    filter: Query<T>,
    selections: string = "",
    populateList: PopulateOptions[] = [],
    page?: number,
    limit?: number
  ): Promise<T[]> {
    filter = BaseMapper.filterMapper(filter);
    let query = this.model
      .find(filter)
      .select(selections)
      .populate(populateList);

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const documents = await query.exec();
    return documents.map((doc) => this.mapper.toDomain(doc));
  }

  async bulkWrite(
    operations: AnyBulkWriteOperation<T>[]
  ): Promise<BulkWriteSummary> {
    const formattedOperations = operations
      .map((op) => {
        if ("updateOne" in op) {
          const filter = BaseMapper.filterMapper(op.updateOne.filter);
          return {
            updateOne: {
              filter: {...filter, isDeleted: false},
              update: op.updateOne.update,
              upsert: op.updateOne.upsert ?? false,
            },
          };
        } else if ("updateMany" in op) {
          const filter = BaseMapper.filterMapper(op.updateMany.filter);
          return {
            updateMany: {
              filter: {...filter, isDeleted: false},
              update: op.updateMany.update,
              upsert: op.updateMany.upsert ?? false,
            },
          };
        } else if ("insertOne" in op) {
          return {
            insertOne: {
              document: op.insertOne.document,
            },
          };
        }
        return null;
      })
      .filter((op): op is NonNullable<typeof op> => op !== null);

    if (formattedOperations.length === 0) {
      return {
        modifiedCount: 0,
        deletedCount: 0,
        upsertedCount: 0,
      };
    }

    const result = await this.model.bulkWrite(formattedOperations);
    return {
      modifiedCount: result.modifiedCount,
      deletedCount: result.deletedCount,
      upsertedCount: result.upsertedCount,
    };
  }

  async aggregate<U = T>(pipeline: PipelineStage[]): Promise<U[]> {
    return this.model.aggregate(pipeline as MongoosePipeLine[]).exec();
  }
}
