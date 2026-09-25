"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

import { isPopulatedString } from "@/shared/libs";
import { Button, Form } from "@/shared/ui";

import {
  OpenCascadeCreateArgs,
  SidePanelsContext,
  SidePanelsContextValue,
} from "./context";
import { CascadeCreateConfig } from "./create-entities";
import { CASCADE_CREATE_DEFINITIONS } from "./create-registry";

/**
 * Creates the entity a combobox picks from, without leaving the form that
 * needed it. Whatever it creates is handed back through `onCreated`, which is
 * what selects it in the combobox that opened this panel.
 */
export function CascadeCreatePanel({
  panelKey,
  config,
  label,
  openKeys,
  appliedCounts,
  onCreated,
  onOpenFilters,
  onOpenCreate,
  onClose,
}: {
  panelKey: string;
  config: CascadeCreateConfig;
  label?: ReactNode;
  openKeys: string[];
  appliedCounts: Record<string, number>;
  onCreated: (id?: string) => void | Promise<void>;
  onOpenFilters: (key: string, info: AutoFormComplexComboboxValueInfo) => void;
  onOpenCreate: (key: string, args: OpenCascadeCreateArgs) => void;
  onClose: () => void;
}) {
  const definition = CASCADE_CREATE_DEFINITIONS[config.entity];

  const form = useForm<FieldValues>({
    resolver: zodResolver(definition.schema),
    defaultValues: { ...definition.defaultValues, ...config.defaultValues },
  });

  // The panel is mounted per entity (keyed by `panelKey`), so the definition —
  // and with it this hook — never changes under it.
  const create = definition.useCreate();

  const contextValue: SidePanelsContextValue = useMemo(
    () => ({
      openAdvancedFilters: onOpenFilters,
      openCascadeCreate: onOpenCreate,
      cascadeCreateEnabled: true,
      path: panelKey,
      openKeys,
      appliedCounts,
    }),
    [onOpenFilters, onOpenCreate, panelKey, openKeys, appliedCounts]
  );

  async function handleSubmit(values: FieldValues) {
    try {
      const id = await create(values);
      toast.success(`${definition.title.replace(/^Create /, "")} created!`);
      // No id back from the API just means the new entity can't be preselected;
      // the list is still refreshed so the user can pick it themselves.
      await onCreated(isPopulatedString(id) ? id : undefined);
      onClose();
    } catch (error) {
      console.error("Cascade create failed:", error);
      toast.error("Action failed");
    }
  }

  return (
    <div className="border-border flex w-[400px] shrink-0 flex-col border-l">
      <Form {...form}>
        <form
          className="flex h-full flex-col"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex items-center gap-2 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onClose}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-base font-semibold">{definition.title}</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6">
            <SidePanelsContext.Provider value={contextValue}>
              {label && (
                <div className="text-muted-foreground text-xs">
                  Will be selected as&nbsp;
                  <span className="text-foreground font-medium">{label}</span>
                </div>
              )}

              <definition.FormFields control={form.control} />
            </SidePanelsContext.Provider>
          </div>

          <div className="border-border flex justify-end gap-2 border-t px-6 py-4">
            <Button type="submit" loading={form.formState.isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
