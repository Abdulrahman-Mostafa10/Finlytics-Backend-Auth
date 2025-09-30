type Maybe<T> =
  | T
  | undefined
  | null
  | QueryOperators<T>
  | QueryOperators<T>[]
  | Record<string, unknown>
  | string;

export type QueryOperators<T> = {
  $in?: Maybe<T>[] | unknown[];
  $nin?: Maybe<T>[] | unknown[];
  $ne?: Maybe<T>;
  $gt?: Maybe<T>;
  $lt?: Maybe<T>;
  $gte?: Maybe<T>;
  $lte?: Maybe<T>;
  $regex?: T extends string ? string : never;
  $options?: T extends string ? string : never;
  $exists?: boolean;
  $not?: QueryOperators<T> | Maybe<T>;
  $elemMatch?: Record<string, unknown>;
  $all?: Maybe<T>[];
  $size?: number;
  $mod?: T extends number ? [number, number] : never;
  $type?: string | number;
};

// Enhanced Query type to handle arrays and MongoDB operators properly
export type Query<T> = {
  [K in keyof T]?:
    | Maybe<T[K]>
    | QueryOperators<NonNullable<T[K]>>
    | (T[K] extends readonly (infer U)[] ? U[] | QueryOperators<U> : never);
} & {
  $and?: Query<T>[];
  $or?: Query<T>[];
  $nor?: Query<T>[];
  $not?: Query<T>;
  _id?: Maybe<string> | QueryOperators<string>;
  [key: string]: any;
};
