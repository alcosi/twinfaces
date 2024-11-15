"use client";

import { AutoField, AutoFormValueInfo } from "@/components/auto-field";
import { z } from "zod";
import {ReactNode, useEffect, useState} from "react";
import { Form } from "@/components/base/form";
import { Alert } from "@/components/base/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/base/button";
import { Check, Cross, X } from "lucide-react";

export interface InPlaceFieldProps {
  value: unknown;
  renderView?: (value: unknown) => ReactNode;
  valueInfo: AutoFormValueInfo;
  onSubmit: (value: unknown) => Promise<any>;
  schema?: z.ZodType<any, any>;
}

export function InPlaceField({
  value,
  renderView,
  valueInfo,
  onSubmit,
  schema,
}: InPlaceFieldProps) {
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function onValueClick() {
    setIsEdited(true);
  }

  const form = useForm({
    defaultValues: {
      value: value,
    },
    resolver: schema ? zodResolver(z.object({ value: schema })) : undefined,
  });

  function cancelEdit() {
    setIsEdited(false);
    form.reset(undefined, {keepDefaultValues: true});
  }

  function internalSubmit(values: { value: unknown }) {
    console.log("internalSubmit", values);
    return onSubmit(values.value)
      .then(() => {
        setIsEdited(false);
      })
      .catch((e) => {
        setError(e.message);
      });
  }

  useEffect(() => {
    const handleEsc = (event: any) => {
      if (event.key === 'Escape') {
        console.log('Close')
        cancelEdit()
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (!isEdited) {
    return (
      <div onClick={onValueClick} className="hover:bg-muted/50 cursor-pointer h-full">
        {renderView ? renderView(value) : <>{value}</>}
      </div>
    );
  } else {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(internalSubmit)} onAbort={cancelEdit} className="max-w-80">
          <div className="flex flex-row space-x-2">
            <AutoField
              info={valueInfo}
              onChange={(newFieldValue) =>
                console.log(
                  "updateValueOfField",
                  valueInfo.label,
                  newFieldValue
                )
              }
              name={"value"}
              control={form.control}
              autoFocus
              // TODO auto cancel edit on lost focus/on closed for popups
              // TODO implement context for keeping only 1 item open at the time inside context
            />

            <Button
              variant="outline"
              size="icon"
              onClick={form.handleSubmit(internalSubmit)}
            >
              <Check />
            </Button>
            <Button
              variant="outline"
              size="icon"
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
