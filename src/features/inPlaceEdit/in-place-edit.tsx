"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AutoField, AutoFormValueInfo } from "@/components/auto-field";

import { cn, isFalsy, usePermissionsAccess } from "@/shared/libs";
import { Form } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import { LoadingSpinner } from "@/shared/ui/loading";

import { InPlaceEditContext } from "./in-place-edit-context";

export interface InPlaceEditProps<T = unknown> {
  id: string;
  value: T;
  renderPreview?: (value: T) => ReactNode;
  valueInfo: AutoFormValueInfo;
  onSubmit: (value: T) => Promise<void>;
  schema?: z.ZodType<any, any>;
  className?: string;
  canUpdate?: boolean;
}

export function InPlaceEdit<T>({
  id,
  value,
  renderPreview,
  valueInfo,
  onSubmit,
  schema,
  className,
  canUpdate: canUpdateProp,
}: InPlaceEditProps<T>) {
  const context = useContext(InPlaceEditContext);
  const { canForCurrentRoute } = usePermissionsAccess();
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const canUpdate = canUpdateProp ?? canForCurrentRoute("UPDATE");
  const form = useForm({
    defaultValues: {
      value: value,
    },
    resolver: schema ? zodResolver(z.object({ value: schema })) : undefined,
  });

  useEffect(() => {
    if (context && context.current !== id) {
      setIsEdited(false);
    }
  }, [context, id, setIsEdited]);

  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function handleEdit() {
    if (!canUpdate) return;
    setIsEdited(true);
    if (context) {
      context.setCurrent(id);
    }
  }

  function handleConfirm(values: { value: T }) {
    setIsLoading(true);
    return onSubmit(values.value)
      .then(() => {
        setIsEdited(false);
      })
      .catch((e) => {
        toast.error(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCancel() {
    setIsEdited(false);
    form.reset(undefined, { keepDefaultValues: true });
  }

  if (isFalsy(isEdited) || !canUpdate) {
    return (
      <div
        onClick={canUpdate ? handleEdit : undefined}
        className={cn(
          "flex min-h-10 flex-row items-center rounded-md",
          // The editable-chip chrome (padding, dashed border, hover) is applied
          // only when the field is editable. Without it, the read-only preview
          // sits flush with plain cells instead of being offset by px-3 —
          // otherwise the fields' margins visibly drift when there is no
          // update permission.
          canUpdate &&
            "border-border hover:bg-muted/50 cursor-pointer border border-dashed px-3",
          className
        )}
      >
        {renderPreview ? (
          renderPreview(value)
        ) : (
          <>
            {(value as ReactNode) || (
              <div className="text-muted-foreground font-light italic">
                None
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    // TODO: inner form does not allow using html-validations
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleConfirm)}
        onAbort={handleCancel}
        className="flex w-full min-w-full flex-col space-y-1.5"
      >
        <AutoField
          info={valueInfo}
          name="value"
          control={form.control}
          autoFocus
          // TODO auto cancel edit on lost focus/on closed for popups
        />

        <div className="flex w-full space-x-1">
          <Button
            type="submit"
            variant="outline"
            size="iconSm"
            onClick={form.handleSubmit(handleConfirm)}
          >
            {isLoading ? <LoadingSpinner /> : <Check />}
          </Button>
          <Button
            type="reset"
            variant="outline"
            size="iconSm"
            onClick={handleCancel}
            className="shadow-md"
          >
            <X />
          </Button>
        </div>
      </form>
    </Form>
  );
}
