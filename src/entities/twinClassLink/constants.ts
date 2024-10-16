import {
  LinkStrength,
  LinkStrengthEnum,
  LinkTypes,
  LinkTypesEnum,
} from "./types";

export const TWIN_CLASS_LINK_TYPES: Array<{
  id: LinkTypes;
  label: string;
}> = [
  { id: LinkTypesEnum.OneToOne, label: "OneToOne" },
  { id: LinkTypesEnum.ManyToMany, label: "ManyToMany" },
  { id: LinkTypesEnum.ManyToOne, label: "ManyToOne" },
] as const;

export const TWIN_CLASS_LINK_STRENGTH: Array<{
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
