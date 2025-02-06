import { createEnum } from "@/shared/libs";
import { TwinClassLink } from "../api";

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

export const LINK_TYPE_TYPES = ["ManyToOne", "ManyToMany", "OneToOne"] as const;

export const LINK_STRENGTH_TYPES = [
  "MANDATORY",
  "OPTIONAL",
  "OPTIONAL_BUT_DELETE_CASCADE",
] as const;
