import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AutoField, AutoFormValueInfo } from "@/components/auto-field";

import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Form } from "@/shared/ui/form";

export interface AutoEditDialogSettings {
  title: string;
  value: { [key: string]: any };
  valuesInfo: { [key: string]: AutoFormValueInfo };
  onSubmit: (values: { [key: string]: any }) => Promise<any>;
  schema?: z.ZodObject<{ [key: string]: z.ZodType<any, any> }>;
}

export interface EditFieldDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => any;
  settings?: AutoEditDialogSettings;
}

export function AutoDialog({
  open,
  onOpenChange,
  settings,
}: EditFieldDialogProps) {
  const [error, setError] = useState<string | null>(null);

  function onOpenChangeInternal(newOpen: boolean) {
    onOpenChange?.(newOpen);
  }

  useEffect(() => {
    if (open) {
      if (settings?.value) {
        form.reset({
          ...settings.value,
        });
      } else {
        form.reset();
      }
    }
  }, [open]);

  const form = useForm({
    defaultValues: {
      value: { ...settings?.value },
    },
    resolver: settings?.schema ? zodResolver(settings.schema) : undefined,
  });

  const { keys } = useMemo(() => {
    return { keys: Object.keys(settings?.value ?? {}) };
  }, [settings?.value]);

  function renderField(key: string, value: any) {
    if (!settings?.valuesInfo) return null;
    const info = settings.valuesInfo[key];
    if (!info) {
      return null;
    }
    return (
      <AutoField key={key} info={info} name={key} control={form.control} />
    );
  }

  async function internalSubmit(newValue: object) {
    setError(null);
    try {
      await settings?.onSubmit(newValue);
      onOpenChangeInternal(false);
    } catch (e) {
      console.error("Failed to update auto edit form values", e);
      setError("Failed to update values");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeInternal}>
      <DialogContent className="sm:max-w-md max-h-[100%] sm:max-h-[80%]">
        <DialogTrigger asChild>Open</DialogTrigger>
        <DialogHeader>
          {settings?.title && <DialogTitle>{settings.title}</DialogTitle>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(internalSubmit)}>
            <div className="space-y-8 overflow-y-auto max-h-[60vh] px-8 py-6">
              {settings?.value &&
                keys.map((key) => renderField(key, settings.value[key]))}

              {error && <Alert variant="destructive">{error}</Alert>}
            </div>

            <DialogFooter className="sm:justify-end p-6">
              <Button type="submit" loading={form.formState.isSubmitting}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
