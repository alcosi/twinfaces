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
