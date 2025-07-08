import { z } from "zod";

import { TWIN_CLASSES_SCHEMA } from "./constants";

// Form Types
export type TwinClassFieldValues = z.infer<typeof TWIN_CLASSES_SCHEMA>;
