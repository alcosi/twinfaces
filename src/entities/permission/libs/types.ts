import { z } from "zod";

import { PERMISSION_SCHEMA } from "./constants";

export type PermissionFormValues = z.infer<typeof PERMISSION_SCHEMA>;
