"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AutoField, AutoFormValueInfo } from "@/components/auto-field";

import { isFalsy } from "@/shared/libs";
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
}

export function InPlaceEdit<T>({
  id,
  value,
  renderPreview,
  valueInfo,
  onSubmit,
  schema,
}: InPlaceEditProps<T>) {
  const context = useContext(InPlaceEditContext);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  if (isFalsy(isEdited)) {
    return (
      <div
        onClick={handleEdit}
        className="flex min-h-8 cursor-pointer flex-row items-center rounded-sm px-1.5 hover:bg-muted/50"
      >
        {renderPreview ? (
          renderPreview(value)
        ) : (
          <>
            {(value as ReactNode) || (
              <div className="font-light italic text-gray-700">None</div>
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
        className="max-w-80"
      >
        <div className="flex flex-row items-center space-x-2">
          <AutoField
            info={valueInfo}
            name={"value"}
            control={form.control}
            autoFocus
            // TODO auto cancel edit on lost focus/on closed for popups
          />

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
          >
            <X />
          </Button>
        </div>
      </form>
    </Form>
  );
}
