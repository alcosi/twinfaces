import { components } from "@/shared/api/generated/schema";

export type ValidatorSet = components["schemas"]["TwinValidatorSetV1"];

export type ValidatorSet_DETAILED = Required<ValidatorSet> & {};

export type ValidatorSetSearchRq =
  components["schemas"]["TwinValidatorSetSearchRqV1"];

export type ValidatorSetCreateRq =
  components["schemas"]["TwinValidatorSetCreateRqV1"];

export type ValidatorSetUpdateRq =
  components["schemas"]["TwinValidatorSetUpdateRqV1"];

export type ValidatorSetFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "invert";

export type ValidatorSetFilters = Partial<
  Pick<ValidatorSetSearchRq, ValidatorSetFilterKeys>
>;
