"use client";

import { AutoField, AutoFormValueInfo } from "@/components/auto-field";
import { z } from "zod";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Form } from "@/shared/ui/form";
import { Alert } from "@/shared/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Check, X } from "lucide-react";
import { LoadingSpinner } from "@/shared/ui/loading";
import { InPlaceEditContext } from "./in-place-edit-context";

export interface InPlaceEditProps {
  id: string;
  value: unknown;
  renderView?: (value: unknown) => ReactNode;
  valueInfo: AutoFormValueInfo;
  onSubmit: (value: unknown) => Promise<any>;
  schema?: z.ZodType<any, any>;
}

export function InPlaceEdit({
  id,
  value,
  renderView,
  valueInfo,
  onSubmit,
  schema,
}: InPlaceEditProps) {
  const context = useContext(InPlaceEditContext);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function onValueClick() {
    setIsEdited(true);
    if (context) {
      context.setCurrent(id);
    }
  }

  useEffect(() => {
    if (context && context.current !== id) {
      setIsEdited(false);
    }
  }, [context, id, setIsEdited]);

  const form = useForm({
    defaultValues: {
      value: value,
    },
    resolver: schema ? zodResolver(z.object({ value: schema })) : undefined,
  });

  function cancelEdit() {
    setIsEdited(false);
    form.reset(undefined, { keepDefaultValues: true });
  }

  function internalSubmit(values: { value: unknown }) {
    setIsLoading(true);
    return onSubmit(values.value)
      .then(() => {
        setIsEdited(false);
        setError(null);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.key === "Escape") {
        cancelEdit();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (!isEdited) {
    return (
      <div
        onClick={onValueClick}
        className="hover:bg-muted/50 cursor-pointer h-full min-h-8 flex flex-row items-center"
      >
        {renderView ? renderView(value) : <>{value ?? <div>Empty</div>}</>}
      </div>
    );
  } else {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(internalSubmit)}
          onAbort={cancelEdit}
          className="max-w-80"
        >
          <div className="flex flex-row space-x-2 items-center">
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
              onClick={form.handleSubmit(internalSubmit)}
            >
              {isLoading ? <LoadingSpinner /> : <Check />}
            </Button>
            <Button
              type="reset"
              variant="outline"
              size="iconSm"
              onClick={cancelEdit}
            >
              <X />
            </Button>
          </div>

          {error && <Alert variant="destructive">{error}</Alert>}
        </form>
      </Form>
    );
  }
}
