import { z } from "zod";

import { isPopulatedArray } from "../types";

// Mirrors FIRST_ID_EXTRACTOR for fields the API marks as optional. Comboboxes
// hand us `[]` when nothing is picked and `""` as their initial value, and both
// have to collapse to `undefined` so the request omits the key instead of
// sending an empty string where the spec expects a uuid.
export const OPTIONAL_FIRST_ID_EXTRACTOR = z
  .union([
    z.literal(""),
    z.array(z.object({ id: z.string().uuid("Please enter a valid UUID") })),
    z.string().uuid("Please enter a valid UUID"),
  ])
  .optional()
  .transform((value) => {
    if (isPopulatedArray<{ id: string }>(value)) return value[0].id;
    return typeof value === "string" && value.length > 0 ? value : undefined;
  });
