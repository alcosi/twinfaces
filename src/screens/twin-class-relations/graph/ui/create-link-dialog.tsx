"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  CreateLinkRequestBody,
  LINK_SCHEMA,
  LinkStrengthEnum,
  LinkTypesEnum,
  useCreateLink,
} from "@/entities/link";
import {
  CrudDataTableDialog,
  CrudDataTableDialogRef,
} from "@/widgets/crud-data-table";

import { CreateLinkFormFields } from "../../../links";
import { LinkSide } from "../model";

export type CreateLinkDialogRef = {
  open: (side: LinkSide) => void;
};

type LinkFormValues = z.infer<typeof LINK_SCHEMA>;

const DEFAULT_VALUES: LinkFormValues = {
  srcTwinClassId: "",
  dstTwinClassId: "",
  name: "",
  type: LinkTypesEnum.OneToOne,
  linkStrength: LinkStrengthEnum.MANDATORY,
};

/**
 * The create sheet the graph's "Add forward link" / "Add backward link"
 * placeholders open: the Relations tab's own form, with the class this graph is
 * about already in the source slot for a forward link and in the destination
 * slot for a backward one.
 */
export const CreateLinkDialog = forwardRef(Component);

function Component(
  {
    twinClassId,
    onCreated,
  }: {
    twinClassId: string;
    onCreated: () => void;
  },
  ref: ForwardedRef<CreateLinkDialogRef>
) {
  const dialogRef = useRef<CrudDataTableDialogRef>(null);
  const { createLink } = useCreateLink();

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(LINK_SCHEMA),
    defaultValues: DEFAULT_VALUES,
  });

  useImperativeHandle(ref, () => ({
    open: (side) =>
      dialogRef.current?.open({
        ...DEFAULT_VALUES,
        ...(side === "forward"
          ? { srcTwinClassId: twinClassId }
          : { dstTwinClassId: twinClassId }),
      }),
  }));

  async function handleCreate(values: unknown) {
    const { name, ...rest } = values as LinkFormValues;
    const nameI18n = name ? { translations: { en: name } } : undefined;
    const body: CreateLinkRequestBody = {
      ...rest,
      forwardNameI18n: nameI18n,
      backwardNameI18n: nameI18n,
    };

    await createLink(body);
    toast.success("Link created successfully!");
  }

  return (
    <CrudDataTableDialog
      ref={dialogRef}
      title="Create link"
      dialogForm={form}
      renderFormFields={() => <CreateLinkFormFields control={form.control} />}
      onCreateSubmit={handleCreate}
      onSubmitSuccess={onCreated}
    />
  );
}
