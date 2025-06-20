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

export const ERROR_CODE_MAP: Record<string, number> = {
  UUID_UNKNOWN: 10000,
  UUID_ALREADY_EXIST: 10001,
  ENTITY_INVALID: 10002,
  ENTITY_ALREADY_EXIST: 10003,
  UUID_NOT_BE_NULLIFY_MARKER: 10004,
  UUID_IS_NULL: 10005,
  USER_UNKNOWN: 10101,
  USER_LOCALE_UNKNOWN: 10102,
  DOMAIN_UNKNOWN: 10201,
  DOMAIN_TYPE_UNSUPPORTED: 10202,
  DOMAIN_KEY_INCORRECT: 10203,
  DOMAIN_KEY_UNAVAILABLE: 10204,
  DOMAIN_USER_ALREADY_EXISTS: 10205,
  DOMAIN_USER_NOT_EXISTS: 10206,
  DOMAIN_BUSINESS_ACCOUNT_ALREADY_EXISTS: 10207,
  DOMAIN_BUSINESS_ACCOUNT_NOT_EXISTS: 10208,
  DOMAIN_LOCALE_UNKNOWN: 10209,
  DOMAIN_OR_BUSINESS_ACCOUNT_USER_NOT_EXISTS: 10210,
  DOMAIN_LOCALE_INACTIVE: 10211,
  DOMAIN_PERMISSION_DENIED: 10212,
  DOMAIN_BUSINESS_ACCOUNT_LEVEL_NOT_SUPPORTED: 10213,
  NO_REQUIRED_PERMISSION: 10214,
  PERMISSION_SCHEMA_NOT_ALLOWED: 10301,
  PERMISSION_ID_UNKNOWN: 10302,
  TWIN_NOT_PROTECTED: 10303,
  PERMISSION_SCHEMA_NOT_SPECIFIED: 10304,
  PERMISSION_KEY_INCORRECT: 10305,
  TWIN_ID_IS_INCORRECT: 10306,
  PERMISSION_GRANT_USER_ALREADY_EXISTS: 10307,
  TWIN_CLASS_SCHEMA_NOT_ALLOWED: 10401,
  TWIN_CLASS_FIELD_KEY_UNKNOWN: 10402,
  TWIN_CLASS_FIELD_VALUE_TYPE_INCORRECT: 10403,
  TWIN_CLASS_FIELD_VALUE_MULTIPLY_OPTIONS_ARE_NOT_ALLOWED: 10404,
  TWIN_CLASS_FIELD_VALUE_REQUIRED: 10405,
  TWIN_CLASS_FIELD_VALUE_INCORRECT: 10406,
  TWIN_CLASS_FIELD_INCORRECT_TYPE: 10407,
  TWIN_CLASS_FIELD_VALUE_IS_ALREADY_IN_USE: 10408,
  TWIN_CLASS_TAGS_NOT_ALLOWED: 10409,
  TWIN_CLASS_HIERARCHY_ERROR: 10410,
  TWIN_CLASS_ID_UNKNOWN: 10411,
  TWIN_CLASS_KEY_UNKNOWN: 10412,
  TWIN_CLASS_KEY_ALREADY_IN_USE: 10413,
  TWIN_CLASS_KEY_INCORRECT: 10414,
  TWIN_CLASS_FIELD_KEY_INCORRECT: 10415,
  TWIN_CLASS_UPDATE_RESTRICTED: 10416,
  TWIN_CLASS_FIELD_UPDATE_RESTRICTED: 10417,
  FIELD_TYPER_SEARCH_NOT_IMPLEMENTED: 10418,
  TWIN_CLASS_FIELD_TWIN_CLASS_NOT_SPECIFIED: 10419,
  TWIN_CLASS_FIELD_FEATURER_NOT_SPECIFIED: 10420,
  TWIN_CLASS_READ_DENIED: 10421,
  TWIN_CLASS_CYCLE: 10422,
  TWIN_CLASS_IS_ABSTRACT: 10423,
  TWINFLOW_SCHEMA_NOT_ALLOWED: 10501,
  TWINFLOW_SCHEMA_NOT_CONFIGURED: 10502,
  TWINFLOW_TRANSACTION_INCORRECT: 10503,
  TWINFLOW_TRANSACTION_DENIED: 10504,
  TWINFLOW_INIT_STATUS_INCORRECT: 10505,
  TWINFLOW_ERASEFLOW_INCORRECT: 10506,
  TRANSITION_STATUS_INCORRECT: 10506,
  DATALIST_OPTION_IS_NOT_VALID_FOR_LIST: 10601,
  DATALIST_OPTION_IS_NOT_VALID_FOR_BUSINESS_ACCOUNT: 10602,
  DATALIST_LIST_UNKNOWN: 10603,
  DATALIST_NAME_IS_NOT_UNIQUE: 10604,
  DATALIST_OPTION_INVALID_ATTRIBUTE: 10605,
  DATALIST_KEY_INCORRECT: 10606,
  SPACE_TWIN_ID_INCORRECT: 10701,
  HEAD_TWIN_ID_NOT_ALLOWED: 10702,
  HEAD_TWIN_NOT_SPECIFIED: 10703,
  TWIN_ALIAS_UNKNOWN: 10801,
  UNSUPPORTED_ALIAS_TYPE: 10802,
  ERROR_TWIN_ALIASES_CREATION: 10803,
  TWIN_LINK_INCORRECT: 10901,
  TWIN_FIELD_VALUE_INCORRECT: 10902,
  TWIN_BASIC_FIELD_UNKNOWN: 10903,
  TWIN_ASSIGNEE_REQUIRED: 10904,
  TWIN_FIELD_IMMUTABLE: 10905,
  FACTORY_INCORRECT: 11001,
  FACTORY_PIPELINE_STEP_ERROR: 11002,
  FACTORY_MULTIPLIER_ERROR: 11003,
  FACTORY_RESULT_LOCKED: 11004,
  TWIN_STATUS_INCORRECT: 11101,
  TWIN_STATUS_TWIN_CLASS_NOT_SPECIFIED: 11102,
  TWIN_STATUS_KEY_INCORRECT: 11103,
  PAGINATION_ERROR: 11201,
  PAGINATION_LIMIT_ERROR: 11202,
  TWIN_COMMENT_FIELD_TEXT_IS_NULL: 11301,
  TWIN_COMMENT_EDIT_ACCESS_DENIED: 11302,
  TWIN_ATTACHMENT_INCORRECT_COMMENT: 11402,
  TWIN_ATTACHMENT_DELETE_ACCESS_DENIED: 11403,
  TWIN_ATTACHMENT_EMPTY_TWIN_ID: 11404,
  TWIN_ATTACHMENT_CAN_NOT_BE_RELINKED: 11405,
  TWIN_SEARCH_NOT_UNIQ: 11601,
  TWIN_SEARCH_PARAM_MISSED: 11602,
  TWIN_SEARCH_ALIAS_UNKNOWN: 11603,
  TWIN_SEARCH_CONFIG_INCORRECT: 11604,
  TWIN_SEARCH_PARAM_INCORRECT: 11605,
  TWIN_SEARCH_INCORRECT: 11606,
  SHOW_MODE_ACCESS_DENIED: 11701,
  TWIN_CREATE_ACCESS_DENIED: 11801,
  TWIN_ERASE_LOCKED: 11802,
  TWIN_UPDATE_ACCESS_DENIED: 11803,
  TWIN_DELETE_ACCESS_DENIED: 11804,
  TWIN_DRAFT_GENERAL_ERROR: 11901,
  TWIN_DRAFT_CASCADE_ERASE_LIMIT: 11902,
  TWIN_DRAFT_NOT_STARTED: 11903,
  TWIN_DRAFT_NOT_WRITABLE: 11904,
  TWIN_DRAFT_CAN_NOT_BE_COMMITED: 11905,
  TWIN_DRAFT_COMMIT_COUNTERS_MISMATCH: 11906,
  TWIN_ACTION_NOT_AVAILABLE: 12001,
  USER_GROUP_UNKNOWN: 12101,
  USER_GROUP_ENTER_ERROR: 12102,
  USER_GROUP_IS_MANDATORY: 12103,
  BUSINESS_ACCOUNT_UNKNOWN: 12201,
  BUSINESS_ACCOUNT_USER_ALREADY_EXISTS: 12202,
  BUSINESS_ACCOUNT_USER_NOT_EXISTS: 12203,
  TIER_NOT_ALLOWED: 12301,
  TIER_NOT_CONFIGURED_FOR_DOMAIN: 12302,
  LINK_DIRECTION_CLASS_NULL: 12401,
  LINK_UPDATE_RESTRICTED: 12402,
  TIER_SIZE_QUOTA_REACHED: 12501,
  TIER_COUNT_QUOTA_REACHED: 12502,
  ATTACHMENTS_NOT_VALID: 12503,
  POINTER_NON_SINGLE: 12601,
  POINTER_ON_NULL: 12602,
  IDP_IS_NOT_ACTIVE: 12701,
  IDP_PASSWORD_LOGIN_NOT_SUPPORTED: 12702,
  IDP_TOKEN_REFRESH_NOT_SUPPORTED: 12703,
  IDP_LOGOUT_NOT_SUPPORTED: 12704,
  IDP_RESOLVE_TOKEN_NOT_SUPPORTED: 12705,
  IDP_SIGNUP_NOT_SUPPORTED: 12706,
  IDP_UNAUTHORIZED: 12707,
  IDP_EMPTY_USERNAME_OR_PASSWORD: 12708,
  IDP_INCORRECT_REFRESH_TOKEN: 12709,
  IDP_INCORRECT_AUTH_TOKEN: 12710,
  IDP_INCORRECT_CRYPT_KEY: 12711,
  IDP_SIGNUP_EMAIL_ALREADY_REGISTERED: 12712,
  IDP_USER_IS_INACTIVE: 12713,
  IDP_EMAIL_VERIFICATION_CODE_INCORRECT: 12714,
  IDP_EMAIL_VERIFICATION_CODE_EXPIRED: 12715,
  IDP_PROVIDED_TOKEN_IS_NOT_ACTIVE: 12716,
  IDP_REGISTRATION_INCORRECT_PASSWORD_FORMAT: 12717,
  IDP_INVALID_INPUT_DATA: 12718,
  IDP_ACCOUNT_ALREADY_ACTIVATED: 12719,
  IDP_ACCOUNT_ACTIVATION_FAILED: 12720,
  IDP_BAD_REQUEST: 12721,
  IDP_USER_NOT_FOUND: 12722,
  IDP_AUTHENTICATION_EXCEPTION: 12723,
  IDP_SWITCH_ACTIVE_BUSINESS_ACCOUNT_NOT_SUPPORTED: 12724,
  IDP_INTERNAL_SERVER_ERROR: 12725,
  IDP_EMPTY_CLIENT_ID_OR_SECRET: 12726,
  ACT_AS_USER_INCORRECT: 12801,
  NOTIFICATION_CONFIGURATION_ERROR: 12901,
};

export const ERROR_CODE_LIST: Record<number, string> = {
  10000: "uuid is unknown",
  10001: "uuid is already exist",
  10002: "entity invalid",
  10003: "entity is already exist in db. Please check unique keys",
  10004: "uuid not be ffffffff-ffff-ffff-ffff-ffffffffffff",
  10005: "uuid is null",

  10101: "unknown user",
  10102: "unknown locale",

  10201: "unknown domain",
  10202: "domain type unsupported",
  10203: "domain key is incorrect",
  10204: "domain key is already in use",
  10205: "domain user already exists",
  10206: "domain user is not registered",
  10207: "domain business_account already exists",
  10208: "domain business_account is not registered",
  10209: "unknown locale",
  10210: "domain or business_account user not exists",
  10211: "Local is not active",
  10212: "No permission to delete record in another domain",
  10213: "Current domain type does not supports business account",
  10214: "No required permissions to perform this operation",

  10301: "permission schema is not allowed",
  10302: "permission id unknown",
  10303: "Twin is not protected by permission",
  10304: "permission schema is not specified",
  10305: "permission key is incorrect",
  10306: "twin id is invalid",
  10307: "permission grant user already exists", // выбран второй вариант

  10401: "twin class schema is not allowed",
  10402: "twin class field key is unknown",
  10403: "twin class field value type is incorrect",

  10501: "Twin class schema is not allowed",
  10502: "Twin class not found",
  10503: "Twin class already exists",
  10504: "Twin class schema key already exists",

  10601: "twin field type is unknown",
  10602: "twin field value is incorrect",

  10701: "unknown twin",
  10702: "twin not found",
  10703: "twin data incorrect",
  10704: "twin entity already exists",
  10705: "twin has invalid relationships",
  10706: "twin is not owned by business_account",
  10707: "twin is not owned by user",
  10708: "twin is already protected",
  10709: "twin is already unprotected",
  10710: "twin is not protected",
  10711: "twin is not active",
  10712: "twin already exists",

  10801: "schema field type is incorrect",
  10802: "schema field key is invalid",
  10803: "schema type is unsupported",

  10901: "invalid email format",
  10902: "invalid phone format",

  11001: "object_id is null or empty",
  11002: "action is null or empty",
  11003: "payload is null",
  11004: "payload is too large",
  11005: "action is not supported",

  11101: "business account already exists",
  11102: "business account not found",
  11103: "business account is not active",
  11104: "user is not a member of business account",
  11105: "user already in business account",
  11106: "user not in business account",
  11107: "cannot delete the only admin",

  11201: "file format is invalid",
  11202: "file size is too large",
  11203: "file not found",
  11204: "file upload failed",
  11205: "unsupported file type",

  11301: "invitation code is invalid",
  11302: "invitation code expired",
  11303: "invitation already used",

  11401: "feature is disabled",
  11402: "feature not available for current plan",
  11403: "feature usage limit exceeded",

  11501: "subscription plan not found",
  11502: "subscription is expired",
  11503: "subscription limit reached",

  11601: "payment method is invalid",
  11602: "payment failed",
  11603: "refund failed",

  11701: "token is invalid",
  11702: "token is expired",
  11703: "token is already used",

  11801: "rate limit exceeded",
  11802: "too many requests",
  11803: "retry later",

  11901: "internal server error",
  11902: "service temporarily unavailable",

  12001: "configuration not found",
  12002: "configuration invalid",

  12101: "API key is invalid",
  12102: "API key is expired",
  12103: "API key not authorized",

  12201: "resource locked",
  12202: "resource is in use",

  12301: "invalid credentials",
  12302: "account is locked",
  12303: "account is inactive",

  12401: "not enough permissions",
  12402: "action not allowed",

  12501: "required field missing",
  12502: "invalid field value",
  12503: "unknown field",

  12601: "operation timeout",
  12602: "external service error",

  12701: "session expired",
  12702: "session not found",
  12703: "session already exists",
  12704: "session is invalid",
  12705: "cannot logout from expired session",
  12706: "password is too weak",
  12707: "incorrect username or password",
  12708: "email is not verified",
  12709: "verification code is invalid",
  12710: "verification code expired",
  12711: "too many verification attempts",
  12712: "email is already registered",
};
