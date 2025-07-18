import { z } from "zod";
import {
  LinkStrength,
  LinkStrengthEnum,
  LinkType,
  LinkTypesEnum,
} from "./types";

export const LINK_TYPES_SCHEMA = z.enum(
  [LinkTypesEnum.ManyToMany, LinkTypesEnum.ManyToOne, LinkTypesEnum.OneToOne],
  { message: "Invalid type" }
);

export const LINK_STRENGTH_SCHEMA = z.enum(
  [
    LinkStrengthEnum.MANDATORY,
    LinkStrengthEnum.OPTIONAL,
    LinkStrengthEnum.OPTIONAL_BUT_DELETE_CASCADE,
  ],
  { message: "Invalid link strength" }
);

export const LINK_TYPES_ENUM: Array<{
  id: LinkType;
  label: string;
}> = [
  { id: LinkTypesEnum.OneToOne, label: "OneToOne" },
  { id: LinkTypesEnum.ManyToMany, label: "ManyToMany" },
  { id: LinkTypesEnum.ManyToOne, label: "ManyToOne" },
] as const;

export const LINK_STRENGTH_ENUM: Array<{
  id: LinkStrength;
  label: string;
}> = [
  { id: LinkStrengthEnum.MANDATORY, label: "Mandatory" },
  { id: LinkStrengthEnum.OPTIONAL, label: "Optional" },
  {
    id: LinkStrengthEnum.OPTIONAL_BUT_DELETE_CASCADE,
    label: "Optional but Delete Cascade",
  },
] as const;
