import { Link } from "@/entities/link";
import type { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";

export type TwinLink = components["schemas"]["TwinLinkV1"];

export type TwinLink_DETAILED = TwinLink & {
  link?: Link;
  srcTwin?: Twin;
  dstTwin?: Twin;
  createdByUser?: User;
};

export type TwinLinkSearchRq = components["schemas"]["TwinLinkSearchRqV1"];

/** Server-supported sort fields for `/private/twin_link/search/v1`. */
export type TwinLinkSortField = NonNullable<TwinLinkSearchRq["sortField"]>;

export type TwinLinkCountRq = components["schemas"]["TwinLinkCountRqV1"];

/** Server-supported group-by fields for `/private/twin_link/search/count/v1`. */
export type TwinLinkCountGroupField = NonNullable<
  TwinLinkCountRq["groupFields"]
>[number];

export type TwinLinkCount = components["schemas"]["TwinLinkCountV1"];

export type TwinLinkFilterKeys =
  | "idList"
  | "srcTwinIdList"
  | "dstTwinIdList"
  | "linkIdList"
  | "createdByUserIdList"
  | "createdAt";

export type TwinLinkFilters = Partial<
  Pick<components["schemas"]["TwinLinkSearchDTOv1"], TwinLinkFilterKeys>
>;
