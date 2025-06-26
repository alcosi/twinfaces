import { isUndefined } from "../libs";
import { Result } from "./types";

export abstract class Results {
  static ok<T>(data?: T): Result<T, never> {
    if (isUndefined(data)) {
      return { ok: true } as Result<T, never>;
    } else {
      return { ok: true, data } as Result<T, never>;
    }
  }

  static error<E>(error: E): Result<never, E> {
    return { ok: false, error };
  }
}
