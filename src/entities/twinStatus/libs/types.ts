import { z } from "zod";
import { TWIN_CLASS_STATUS_SCHEMA } from "@/entities/twinStatus";

export type TwinClassStatusFormValues = z.infer<
  typeof TWIN_CLASS_STATUS_SCHEMA
>;
