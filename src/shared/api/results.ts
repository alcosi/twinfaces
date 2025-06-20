import { isUndefined } from "../libs";
import { Result } from "./types";

export abstract class Results {
  static ok(): Result<void, never>;
  static ok<T>(value: T): Result<T, never>;

  static ok<T>(value?: T): Result<T | void, never> {
    if (isUndefined(value)) {
      return { ok: true } as Result<void, never>;
    } else {
      return { ok: true, value } as Result<T, never>;
    }
  }

  static error<E>(error: E): Result<never, E> {
    return { ok: false, error };
  }
}
