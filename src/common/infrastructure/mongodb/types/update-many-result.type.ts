import {ObjectId} from "mongodb";

export type UpdateManyResult<T = {_id: ObjectId}> = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: T extends {_id: infer IdType} ? IdType | null : ObjectId | null;
};
