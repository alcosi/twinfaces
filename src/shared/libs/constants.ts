import { z } from "zod";

import { isPopulatedArray } from "./types";

export const NULLIFY_UUID_VALUE: string =
  "ffffffff-ffff-ffff-ffff-ffffffffffff";

export const REGEX_PATTERNS = {
  UUID: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,

  ALPHANUMERIC_WITH_DASHES: /^[a-zA-Z0-9_-]+$/,

  TWIN_CLASS_KEY: /^[a-zA-Z0-9_\s]+$/,

  URL_REGEX:
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/,

  /**
   * Extracts path segments (before any '?'):
   * - `[^/?]+`  one or more chars except `/` or `?`
   * - `(?=/|$)` must be followed by `/` or end of string
   *
   * e.g. "/a/b/123?x" → ["a","b","123"]
   */
  PATH_SEGMENTS: /[^/?]+(?=\/|$)/,
};

// Reference: Unicode symbols
// Source: https://en.wikipedia.org/wiki/List_of_Unicode_characters#:~:text=assigned%20code%20points-,Unicode%20symbols,-%5Bedit%5D
export const UNICODE_SYMBOLS = {
  // dashes & lines
  enDash: "\u2013",
  emDash: "\u2014",
  horizontalBar: "\u2015",
  lowLine: "\u2017",

  // single quotation marks / apostrophe
  apostrophe: "\u0027",
  leftSingleQuote: "\u2018",
  rightSingleQuote: "\u2019",
  singleLow9Quote: "\u201A",
  singleHighReversed9Quote: "\u201B",

  // double quotation marks
  leftDoubleQuote: "\u201C",
  rightDoubleQuote: "\u201D",
  doubleLow9Quote: "\u201E",

  // punctuation & symbols
  dagger: "\u2020",
  doubleDagger: "\u2021",
  bullet: "\u2022",
  ellipsis: "\u2026",
  perMille: "\u2030",
  prime: "\u2032",
  doublePrime: "\u2033",
  singleLeftAngleQuote: "\u2039",
  singleRightAngleQuote: "\u203A",
  doubleExclamation: "\u203C",
  overline: "\u203E",
  fractionSlash: "\u2044",
  tironianEt: "\u204A",
};

export const FIRST_ID_EXTRACTOR = z
  .array(z.object({ id: z.string().uuid("Please enter a valid UUID") }))
  .min(1, "Required")
  .transform((arr) => (isPopulatedArray<{ id: string }>(arr) ? arr[0].id : ""));

export const FIRST_USER_ID_EXTRACTOR = z
  .array(z.object({ userId: z.string().uuid("Please enter a valid UUID") }))
  .min(1, "Required")
  .transform((arr) =>
    isPopulatedArray<{ userId: string }>(arr) ? arr[0].userId : ""
  );

export const POSITION_MAP: Record<
  "top-left" | "top-right" | "bottom-right" | "bottom-left",
  string
> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
};
