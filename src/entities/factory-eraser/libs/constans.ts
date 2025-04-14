import { FactoryEraser } from "../api";

export const ERASE_ACTION_TYPES: NonNullable<FactoryEraser["action"]>[] = [
  "RESTRICT",
  "ERASE_IRREVOCABLE",
  "ERASE_CANDIDATE",
] as const;
