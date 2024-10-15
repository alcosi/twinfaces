import { components } from "@/lib/api/generated/schema";
import { TwinClassLinkTypes } from "./types";

type TwinClassLink = components["schemas"]["TwinClassLinkV1"];

export const TWIN_CLASS_LINK_TYPES: Array<{
  id: NonNullable<TwinClassLink["type"]>;
  label: string;
}> = [
  { id: TwinClassLinkTypes.OneToOne, label: "OneToOne" },
  { id: TwinClassLinkTypes.ManyToMany, label: "ManyToMany" },
  { id: TwinClassLinkTypes.ManyToOne, label: "ManyToOne" },
] as const;

export const TWIN_CLASS_LINK_STRENGTH: Array<{
  id: NonNullable<TwinClassLink["linkStrengthId"]>;
  label: string;
}> = [
  { id: "MANDATORY", label: "Mandatory" },
  { id: "OPTIONAL", label: "Optional" },
  {
    id: "OPTIONAL_BUT_DELETE_CASCADE",
    label: "Optional but Delete Cascade",
  },
] as const;
