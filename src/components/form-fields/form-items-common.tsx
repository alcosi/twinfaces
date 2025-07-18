import { ReactNode } from "react";

import { cn } from "@/shared/libs";
import { FormDescription, FormLabel, Label } from "@/shared/ui";

export function FormItemLabel({
  children,
  inForm,
}: {
  children: ReactNode;
  inForm?: boolean;
}) {
  return inForm ? <FormLabel>{children}</FormLabel> : <Label>{children}</Label>;
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
    <p className={cn("text-sm text-muted-foreground")}>{children}</p>
  );
}
