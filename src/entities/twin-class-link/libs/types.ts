import { createEnum } from "@/shared/libs";
import { TwinClassLink } from "../api";

export type LinkType = NonNullable<TwinClassLink["type"]>;
export const LINK_TYPES: LinkType[] = [
  "ManyToOne",
  "ManyToMany",
  "OneToOne",
] as const;
export const LinkTypesEnum = createEnum<LinkType>(LINK_TYPES);

export type LinkStrength = NonNullable<TwinClassLink["linkStrengthId"]>;
export const LINK_STRENGTHS: LinkStrength[] = [
  "MANDATORY",
  "OPTIONAL",
  "OPTIONAL_BUT_DELETE_CASCADE",
];
export const LinkStrengthEnum = createEnum<LinkStrength>(LINK_STRENGTHS);
