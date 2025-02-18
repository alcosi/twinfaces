import { createEnum } from "@/shared/libs";
import { Link } from "../api";

export type LinkType = NonNullable<Link["type"]>;
export const LINK_TYPES: LinkType[] = [
  "ManyToOne",
  "ManyToMany",
  "OneToOne",
] as const;
export const LinkTypesEnum = createEnum<LinkType>(LINK_TYPES);

export type LinkStrength = NonNullable<Link["linkStrengthId"]>;
export const LINK_STRENGTHS: LinkStrength[] = [
  "MANDATORY",
  "OPTIONAL",
  "OPTIONAL_BUT_DELETE_CASCADE",
];
export const LinkStrengthEnum = createEnum<LinkStrength>(LINK_STRENGTHS);
