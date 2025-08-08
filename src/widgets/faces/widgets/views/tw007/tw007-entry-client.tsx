"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { FaceTW007 } from "@/entities/face";
import { useTwinClassFields } from "@/entities/twin";
import { FIRST_ID_EXTRACTOR, isPopulatedString } from "@/shared/libs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";

type Props = {
  faceData?: FaceTW007;
};

const TW007_SCHEMA = z.object({
  classId: FIRST_ID_EXTRACTOR,
});

type TW007FormValues = z.infer<typeof TW007_SCHEMA>;

export function TW007EntryClient({ faceData }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<TW007FormValues>({
    resolver: zodResolver(TW007_SCHEMA),
    defaultValues: {
      classId: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const body = {
      ...values,
    };

    console.log("change class", body);
    // TODO add functional for changing class
    toast.success(`Category is changed successfully!`);
    setIsOpen(false);
  });

  const { twinClassBySearchIdAdapter } = useTwinClassFields(form.control, {
    baseTwinClassId: faceData?.twinClassSearchId,
    twinClassSearchParams: faceData?.twinClassSearchParams,
  });

  const Icon = isPopulatedString(faceData?.iconUrl)
    ? () => (
        <Image
          src={faceData.iconUrl!}
          alt="icon"
          width={16}
          height={16}
          className="mr-2 dark:invert"
        />
      )
    : undefined;

  return (
    <Dialog key={faceData?.id} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger key={faceData?.id} asChild>
        <Button variant="outline" IconComponent={Icon}>
          {faceData?.label}
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton className="flex max-h-[70vh] flex-col">
        <DialogHeader className="p-6">
          <DialogTitle>{faceData?.label}</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            id={`form-${faceData?.id}`}
            className="flex-1 space-y-6 overflow-y-auto px-8 py-6"
            onSubmit={onSubmit}
          >
            <ComboboxFormField
              control={form.control}
              name="classId"
              label={faceData?.classSelectorLabel || "Select class"}
              {...twinClassBySearchIdAdapter}
              required
            />
          </form>
        </FormProvider>

        <DialogFooter className="p-8" showSeparator={true}>
          <Button type="submit" form={`form-${faceData?.id}`}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
