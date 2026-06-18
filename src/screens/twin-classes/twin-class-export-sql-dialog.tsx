"use client";

import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FieldIcon } from "@/features/twin-class-field/ui";
import { TwinFlowIcon } from "@/features/twin-flow/ui";
import { TwinStatusIcon } from "@/features/twin-status/ui";
import { PrivateApiContext } from "@/shared/api";
import {
  ExportSqlDialog,
  ExportSqlDialogRef,
  ExportSqlOption,
} from "@/shared/ui";

// Mirrors the include flags accepted by /private/twin_class/export/sql/v1.
const TWIN_CLASS_EXPORT_OPTIONS: ExportSqlOption[] = [
  {
    name: "includeFields",
    label: "Fields",
    description: "Twin class fields",
    icon: FieldIcon,
  },
  {
    name: "includeStatuses",
    label: "Statuses",
    description: "Statuses of the twin class",
    icon: TwinStatusIcon,
  },
  {
    name: "includeTwinflow",
    label: "Twinflow",
    description: "Twinflows with transitions",
    icon: TwinFlowIcon,
  },
];

export type TwinClassExportSqlDialogRef = {
  open: (twinClassItem: TwinClass_DETAILED) => void;
};

type Props = {
  onSuccess?: () => void;
};

export const TwinClassExportSqlDialog = forwardRef(Component);

function Component(
  { onSuccess }: Props,
  ref: ForwardedRef<TwinClassExportSqlDialogRef>
) {
  const api = useContext(PrivateApiContext);
  const dialogRef = useRef<ExportSqlDialogRef>(null);
  const itemRef = useRef<TwinClass_DETAILED | null>(null);

  useImperativeHandle(ref, () => ({
    open: (twinClassItem: TwinClass_DETAILED) => {
      itemRef.current = twinClassItem;
      dialogRef.current?.open({ name: twinClassItem.name });
    },
  }));

  async function handleExport(flags: Record<string, boolean>): Promise<string> {
    const item = itemRef.current;
    if (!item) throw new Error("No twin class selected");

    const { data, error } = await api.twinClass.exportSql({
      body: {
        twinClassIds: [item.id],
        includeFields: flags.includeFields,
        includeStatuses: flags.includeStatuses,
        includeTwinflow: flags.includeTwinflow,
      },
    });

    if (error || typeof data !== "string") {
      throw error ?? new Error("Export sql response is empty");
    }

    return data;
  }

  return (
    <ExportSqlDialog
      ref={dialogRef}
      title="Export SQL"
      options={TWIN_CLASS_EXPORT_OPTIONS}
      onExport={handleExport}
      onSuccess={onSuccess}
    />
  );
}
