import { z } from "zod";
import { TWIN_SCHEMA } from "./constants";

export type TwinFormValues = z.infer<typeof TWIN_SCHEMA>;
