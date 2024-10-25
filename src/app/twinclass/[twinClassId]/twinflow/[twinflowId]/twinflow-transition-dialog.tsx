import {
  TwinFlow,
  TwinFlowTransition,
  TwinFlowTransitionCreateRq,
  TwinFlowTransitionUpdateRq,
} from "@/lib/api/api-types";
import { z } from "zod";
import { useContext, useEffect, useMemo, useState } from "react";
import { ApiContext } from "@/lib/api/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import { Form } from "@/components/base/form";
import { Input } from "@/components/base/input";
import { ComboboxFormField } from "@/components/form-fields/combobox-form-field";
import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import { Alert } from "@/components/base/alert";
import { Button } from "@/components/base/button";
import { useClassStatuses } from "@/lib/useClassStatuses";

export interface TwinflowTransitionCreateEditDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => any;
  twinClassId: string;
  twinFlow?: TwinFlow;
  transition: TwinFlowTransition | null;
  onSuccess?: () => any;
}

const twinFlowTransitionSchema = z.object({
  srcStatusId: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  dstStatusId: z.string().min(1, "Destination status is required"),
  name: z
    .string()
    .min(0)
    .max(100)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  description: z
    .string()
    .min(0)
    .max(100)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  alias: z.string().min(1, "Alias is required").max(100),
  permissionId: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export function TwinflowTransitionCreateEditDialog({
  open,
  onOpenChange,
  twinClassId,
  twinFlow,
  transition,
  onSuccess,
}: TwinflowTransitionCreateEditDialogProps) {
  const api = useContext(ApiContext);

  const [error, setError] = useState<string | null>(null);

  const { getStatusesBySearch, findStatusById } = useClassStatuses({
    twinClassId,
  });

  const existingAliases = useMemo(() => {
    if (!twinFlow) return [];
    const transitions = Object.values(twinFlow.transitions ?? {});
    const aliases = transitions.filter((x) => x.alias).map((x) => x.alias!);
    console.log("existingAliases", aliases);
    return aliases;
  }, [twinFlow]);

  function onOpenChangeInternal(newOpen: boolean) {
    console.log(
      "TwinflowTransitionCreateEditDialog onOpenChangeInternal",
      newOpen
    );
    if (!newOpen && form.formState.isSubmitting) {
      return;
    }

    onOpenChange?.(newOpen);
  }

  useEffect(() => {
    console.log(
      "TwinflowTransitionCreateEditDialog useEffect open",
      open,
      transition
    );
    if (!open) return;

    if (transition) {
      form.reset(
        {
          srcStatusId: transition.srcTwinStatusId,
          dstStatusId: transition.dstTwinStatusId,
          name: transition.name,
          description: transition.description,
          alias: transition.alias,
          permissionId: transition.permissionId,
        },
        { keepDefaultValues: true }
      );
      console.log(form.getValues());
    } else {
      console.log(
        "CreateEditTwinFieldDialog useEffect reset",
        form.formState.defaultValues
      );
      form.reset();
    }
    setError(null);
  }, [open]);

  const form = useForm<z.infer<typeof twinFlowTransitionSchema>>({
    resolver: zodResolver(twinFlowTransitionSchema),
    defaultValues: {
      srcStatusId: "",
      dstStatusId: "",
      name: "",
      description: "",
      alias: "",
      permissionId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof twinFlowTransitionSchema>) {
    setError(null);

    const { name, description, ...withoutI18 } = data;
    if (!transition) {
      const requestBody: TwinFlowTransitionCreateRq = {
        nameI18n: {
          translationInCurrentLocale: name,
        },
        descriptionI18n: {
          translationInCurrentLocale: description,
        },
        ...data,
      };
      try {
        const { data: response, error } = await api.twinflow.createTransition({
          twinFlowId: twinFlow!.id!,
          data: requestBody,
        });
        if (error) {
          console.error("failed to create field", error);
          const errorMessage = error?.msg;
          setError("Failed to create field: " + errorMessage ?? error);
          return;
        }
      } catch (e) {
        console.error("exception while creating field", e);
        toast.error("Failed to create field");
        return;
      }
    } else {
      const requestBody: TwinFlowTransitionUpdateRq = {
        nameI18n: {
          translationInCurrentLocale: name,
        },
        descriptionI18n: {
          translationInCurrentLocale: description,
        },
        ...withoutI18,
      };
      try {
        const { data: response, error } = await api.twinflow.updateTransition({
          transitionId: transition.id!,
          data: requestBody,
        });
        if (error) {
          console.error("failed to create field", error);
          const errorMessage = error?.msg;
          setError("Failed to create field: " + errorMessage ?? error);
          return;
        }
      } catch (e) {
        console.error("exception while creating field", e);
        toast.error("Failed to create field");
        return;
      }
    }

    onOpenChange?.(false);
    onSuccess?.();
  }

  if (!twinFlow?.id) {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeInternal}>
      <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[100%] sm:max-h-[80%]">
        <DialogHeader>
          <DialogTitle>
            {transition ? "Edit transition" : "Create transition"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {transition?.id && <Input value={transition?.id} disabled />}

            <ComboboxFormField
              control={form.control}
              name="srcStatusId"
              label="Source status"
              getById={findStatusById}
              getItems={getStatusesBySearch}
              getItemKey={(c) => c?.id?.toLowerCase() ?? ""}
              getItemLabel={(c) => {
                let label = c?.key ?? "";
                if (c.name) label += ` (${c.name})`;
                return label;
              }}
              selectPlaceholder={"Select status..."}
              searchPlaceholder={"Search status..."}
              noItemsText={"No statuses found"}
            />

            <ComboboxFormField
              control={form.control}
              name="dstStatusId"
              label="Destination status"
              getById={findStatusById}
              required={true}
              getItems={getStatusesBySearch}
              getItemKey={(c) => c?.id?.toLowerCase() ?? ""}
              getItemLabel={(c) => {
                let label = c?.key ?? "";
                if (c.name) label += ` (${c.name})`;
                return label;
              }}
              selectPlaceholder={"Select status..."}
              searchPlaceholder={"Search status..."}
              noItemsText={"No statuses found"}
            />

            <TextFormField control={form.control} name="name" label="Name" />

            <TextAreaFormField
              control={form.control}
              name="description"
              label="Description"
            />

            <TextFormField
              control={form.control}
              name="alias"
              label="Alias"
              required={true}
              idPrefix="create-edit-transition"
              suggestions={existingAliases}
            />

            <TextFormField
              control={form.control}
              name="permissionId"
              label="Permission ID"
            />

            {error && <Alert variant="destructive">{error}</Alert>}

            {Object.values(form.formState.errors).length > 0 && (
              <Alert variant="destructive">There are errors in the form</Alert>
            )}

            <DialogFooter className="sm:justify-end">
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
