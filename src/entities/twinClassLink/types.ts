import { TwinClassLink } from "@/lib/api/api-types";
import { components } from "@/lib/api/generated/schema";
import { createEnum } from "@/shared/helpers";

export type LinkTypes = NonNullable<TwinClassLink["type"]>;
export const LinkTypesEnum = createEnum<LinkTypes>([
  "ManyToOne",
  "ManyToMany",
  "OneToOne",
] as const);

export type LinkStrength = NonNullable<TwinClassLink["linkStrengthId"]>;
export const LinkStrengthEnum = createEnum<LinkStrength>([
  "MANDATORY",
  "OPTIONAL",
  "OPTIONAL_BUT_DELETE_CASCADE",
] as const);

export type CreateLinkRequestBody = components["schemas"]["LinkCreateV1"];
export type UpdateLinkRequestBody = components["schemas"]["LinkUpdateV1"];
