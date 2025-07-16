export interface Identifiable {
  id?: string | number;
}

export type RequireFields<Type, Keys extends keyof Type> = Omit<Type, Keys> &
  Required<Pick<Type, Keys>>;
export type PartialFields<Type, Keys extends keyof Type> = Omit<Type, Keys> &
  Partial<Pick<Type, Keys>>;

export type Falsy = false | 0 | "" | null | undefined | typeof NaN;

/**
 * Creates a new type by replacing properties in `T` with those from `R`.
 *
 * Removes from `T` any keys present in `R`, then merges `R` in — effectively overriding fields.
 *
 * @template T - Base type.
 * @template R - Overrides.
 *
 * @example
 * type Original = { a: number; b: string };
 * type Override = { b: boolean };
 * type Result = Redefine<Original, Override>; // { a: number; b: boolean }
 */
export type Redefine<T, R> = Omit<T, keyof R> & R;
