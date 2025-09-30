import {OptionalId} from "mongodb";

export type AnyBulkWriteOperation<T> =
  | {insertOne: {document: OptionalId<T>}}
  | {
      updateOne: {
        filter: Partial<T>;
        update:
          | Partial<T>
          | {$set: Partial<T>}
          | {$unset: Partial<Record<keyof T, 1>>};
        upsert?: boolean;
      };
    }
  | {
      updateMany: {
        filter: Partial<T>;
        update:
          | Partial<T>
          | {$set: Partial<T>}
          | {$unset: Partial<Record<keyof T, 1>>};
        upsert?: boolean;
      };
    }
  | {replaceOne: {filter: Partial<T>; replacement: T; upsert?: boolean}}
  | {deleteOne: {filter: Partial<T>}}
  | {deleteMany: {filter: Partial<T>}};
