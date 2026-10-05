import { ReactNode } from "react";

import { cn } from "@/shared/libs";
import { FormDescription, FormLabel, Label } from "@/shared/ui";

// Softer than the body text so the inputs, not their captions, carry the form.
const FORM_ITEM_LABEL_CLASS = "text-slate-600 dark:text-slate-300";

export function FormItemLabel({
  children,
  inForm,
}: {
  children: ReactNode;
  inForm?: boolean;
}) {
  return inForm ? (
    <FormLabel className={FORM_ITEM_LABEL_CLASS}>{children}</FormLabel>
  ) : (
    <Label className={FORM_ITEM_LABEL_CLASS}>{children}</Label>
  );
}

export function FormItemDescription({
  children,
  inForm,
}: {
  children: ReactNode;
  inForm?: boolean;
}) {
  return inForm ? (
    <FormDescription>{children}</FormDescription>
  ) : (
    <p className={cn("text-muted-foreground text-sm")}>{children}</p>
  );
}
