import { cn } from "@/shared/libs";
import { FormDescription, FormLabel } from "@/shared/ui/form";
import { Label } from "@/shared/ui/label";
import { ReactNode } from "react";

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
