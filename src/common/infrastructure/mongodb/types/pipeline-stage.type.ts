import {Query} from "./query";

export type PipelineStage = {
  $match?: Query<unknown>;
  $group?: {_id: string | number | null | Record<string, unknown>} & Record<
    string,
    unknown
  >;
  $sort?: Record<string, 1 | -1>;
  $project?: Record<string, 0 | 1 | string | Record<string, unknown>>;
  $lookup?: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
    pipeline?: PipelineStage[];
  };
  $unwind?: string | {path: string; preserveNullAndEmptyArrays?: boolean};
  $addFields?: Record<string, unknown>;
  $limit?: number; // Fix: Allow number directly
  $skip?: number; // Fix: Allow number directly
  $count?: string;
  $facet?: Record<string, PipelineStage[]>;
  $sample?: {size: number};
  $vectorSearch?: {
    index: string;
    path: string;
    queryVector: number[];
    limit?: number;
    numCandidates?: number;
    [key: string]: unknown;
  };
};
