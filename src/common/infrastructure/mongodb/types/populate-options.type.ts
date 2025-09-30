export type PopulateOptions = {
  path: string;
  select?: string | string[] | Record<string, 0 | 1>;
  match?: Record<string, unknown>;
  model?: string;
  populate?: PopulateOptions | PopulateOptions[];
  options?: {sort?: Record<string, 1 | -1>; limit?: number; skip?: number};
};
