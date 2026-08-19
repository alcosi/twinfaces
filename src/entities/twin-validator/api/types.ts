import { Featurer } from "@/entities/featurer";
import { ValidatorSet } from "@/entities/validator-set";
import { components } from "@/shared/api/generated/schema";

import { ExtendedFeaturerParam } from "../../../features/featurer/utils/helpers";

export type TwinValidator = components["schemas"]["TwinValidatorBaseV1"];

export type TwinValidator_DETAILED = Required<TwinValidator> & {
  twinValidatorSet?: ValidatorSet;
  validatorFeaturer?: Featurer;
  validatorDetailedParams?: ExtendedFeaturerParam[];
};

export type TwinValidatorSearchRq =
  components["schemas"]["TwinValidatorSearchRqV1"];

/** Inner payload of a search request — filters live under its `search` key. */
export type TwinValidatorSearch =
  components["schemas"]["TwinValidatorSearchV1"];

export type TwinValidatorFilterKeys =
  | "idList"
  | "twinValidatorSetIdList"
  | "validatorFeaturerIdList"
  | "descriptionLikeList"
  | "invert"
  | "active";

export type TwinValidatorFilters = Partial<
  Pick<TwinValidatorSearch, TwinValidatorFilterKeys>
>;

export type TwinValidatorSortField = NonNullable<
  TwinValidatorSearchRq["sortField"]
>;

export type TwinValidatorCountRq =
  components["schemas"]["TwinValidatorCountRqV1"];

export type TwinValidatorCountGroupField = NonNullable<
  TwinValidatorCountRq["groupFields"]
>[number];
