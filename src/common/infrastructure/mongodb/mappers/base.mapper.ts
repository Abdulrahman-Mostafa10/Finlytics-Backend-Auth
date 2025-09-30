// Types
import {Query} from "../types/query";
import {RootFilterQuery, FilterQuery} from "mongoose";

/**
 * Maps a domain filter to a MongoDB filter, converting `id` to `_id`.
 */
export class BaseMapper {
  static filterMapper<T>(
    filter: Query<T> | RootFilterQuery<any>
  ): FilterQuery<unknown> {
    const {id, ...rest} = filter as any;

    if (id === undefined) {
      return rest;
    }

    return {_id: id, ...rest};
  }
}
