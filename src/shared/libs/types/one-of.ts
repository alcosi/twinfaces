// Enforces that only one type from a union is allowed at a time
// Inspired by: https://github.com/typed-rocks/typescript/blob/main/one_of.ts

type MergeTypes<T extends any[], Result = {}> = T extends [
  infer Head,
  ...infer Tail,
]
  ? MergeTypes<Tail, Result & Head>
  : Result;

type OnlyFirst<First, All> = First & {
  [Key in keyof Omit<All, keyof First>]?: never;
};

export type OneOf<
  T extends any[],
  Result = never,
  Combined = MergeTypes<T>,
> = T extends [infer Head, ...infer Tail]
  ? OneOf<Tail, Result | OnlyFirst<Head, Combined>, Combined>
  : Result;
