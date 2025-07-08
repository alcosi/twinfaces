import { z } from "zod";

import { TWIN_CLASS_FIELD_SCHEMA } from "./constants";

export type TwinClassFieldFormValues = z.infer<typeof TWIN_CLASS_FIELD_SCHEMA>;
