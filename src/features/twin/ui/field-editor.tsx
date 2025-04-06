"use client";

import { useRouter } from "next/navigation";
import { useCallback, useContext } from "react";
import { ZodType, z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { TwinUpdateRq } from "@/entities/twin/server";
import { PrivateApiContext } from "@/shared/api";
import { TableCell, TableRow } from "@/shared/ui";

import { InPlaceEdit, InPlaceEditProps } from "../../inPlaceEdit";

type Props = {
  id: string;
  twinId: string;
  label?: string;
  fieldKey: string;
  fieldValue: string;
  schema?: ZodType;
  onSuccess?: () => void;
};

export function TwinFieldEditor({
  id,
  twinId,
  label,
  fieldKey,
  fieldValue,
  schema,
  onSuccess,
}: Props) {
  const api = useContext(PrivateApiContext);
  const router = useRouter();

  const updateTwin = useCallback(
    async (body: TwinUpdateRq) => {
      try {
        await api.twin.update({ id: twinId, body });
        onSuccess?.() || router.refresh();
      } catch (e) {
        console.error("Failed to update twin:", e);
        throw e;
      }
    },
    [api.twin, twinId, router, onSuccess]
  );

  const editProps: InPlaceEditProps<string> = {
    id,
    value: fieldValue,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: schema ?? z.string().min(1),
    onSubmit: (value) =>
      updateTwin({
        [fieldKey]: value,
      }),
  };

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell className="cursor-pointer">
        <InPlaceEdit {...editProps} />
      </TableCell>
    </TableRow>
  );
}
