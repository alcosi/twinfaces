"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FaceTC001ViewRs as FaceTC, FaceWT002Button } from "@/entities/face";
import { TWIN_SCHEMA, TwinFormValues, useCreateTwin } from "@/entities/twin";
import { TwinCreateRq } from "@/entities/twin/server";
import { isPopulatedString } from "@/shared/libs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";

import { TCForm } from "../tc";

type Props = {
  trigger: FaceWT002Button;
  faceData?: FaceTC;
};

export function WT002EntryClient({ trigger, faceData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { createTwin } = useCreateTwin();

  const Icon = isPopulatedString(trigger.icon)
    ? () => (
        <Image
          src={trigger.icon!}
          alt="icon"
          width={16}
          height={16}
          className="mr-2 dark:invert"
        />
      )
    : undefined;

  const form = useForm<TwinFormValues>({
    resolver: zodResolver(TWIN_SCHEMA),
    defaultValues: {
      classId: "",
      name: "",
      description: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    // TODO there may be unnecessary filtering if backends do not send static fields that do not relate to dynamic fields
    const filteredFields = Object.fromEntries(
      Object.entries(values.fields ?? {}).filter(
        ([key]) => !key.startsWith("base_")
      )
    );
    console.log("Submit for trigger", trigger.label, values);

    const body: TwinCreateRq = {
      ...values,
      fields: filteredFields,
    };

    await createTwin({ body });
    toast.success(`Twin ${body.name} is created successfully!`);
    setIsOpen(false);
  });

  console.log("foobar DAT", { trigger, faceData });
  return (
    <Dialog key={trigger.key} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger key={trigger.key} asChild>
        <Button variant="outline" IconComponent={Icon}>
          {trigger.label}
        </Button>
      </DialogTrigger>

      {faceData && (
        <DialogContent showCloseButton className="flex max-h-[70vh] flex-col">
          <DialogHeader className="p-6">
            {/* Use headerLabel from face. trigger.label is for trigger-button */}
            {/* @ts-ignore */}
            <DialogTitle>{faceData.faceTwinCreate?.headerLabel}</DialogTitle>
          </DialogHeader>

          {/* TODO: reworkd form input. Currently there are none */}
          <FormProvider {...form}>
            <form
              id={`form-${trigger.id}`}
              className="flex-1 space-y-6 overflow-y-auto px-8 py-6"
              onSubmit={onSubmit}
            >
              <TCForm control={form.control} modalCreateData={faceData} />
            </form>
          </FormProvider>

          <DialogFooter className="p-8" showSeparator={true}>
            <Button type="submit" form={`form-${trigger.id}`}>
              {faceData.faceTwinCreate?.saveButtonLabel ?? "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
