import { z } from "zod";

import { FIRST_ID_EXTRACTOR } from "@/shared/libs/constants";

export const TWIN_FLOW_SCHEMA = z.object({
  twinClassId: z.string().uuid().nullable().or(FIRST_ID_EXTRACTOR),
  name: z.string().min(1, "Name can not be empty"),
  description: z.string(),
  initialStatus: z.string().uuid("Select status").or(FIRST_ID_EXTRACTOR),
});
