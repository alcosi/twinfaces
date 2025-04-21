export interface Identifiable {
  id?: string | number;
}

export type RequireFields<Type, Keys extends keyof Type> = Omit<Type, Keys> &
  Required<Pick<Type, Keys>>;
export type PartialFields<Type, Keys extends keyof Type> = Omit<Type, Keys> &
  Partial<Pick<Type, Keys>>;

export type Falsy = false | 0 | "" | null | undefined | typeof NaN;

export type Redefine<T, R> = Omit<T, keyof R> & R;
