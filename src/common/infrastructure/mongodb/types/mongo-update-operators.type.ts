export type MongoUpdateOperators<T> = {
  $pull?: Partial<Record<keyof T, any>> & Record<string, any>;
  $push?: Partial<Record<keyof T, any>> & Record<string, any>;
  $addToSet?: Partial<Record<keyof T, any>> & Record<string, any>;
  $set?: Partial<T> & Record<string, any>;
  $unset?: Partial<Record<keyof T, 1>> & Record<string, 1>;
};
