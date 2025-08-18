"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { FaceTW007 } from "@/entities/face";
import {
  TwinClass,
  useTwinClassBySearchIdSelectAdapter,
} from "@/entities/twin-class";
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
  twinClass: TwinClass;
  onChange: (newTwinClassId: string) => Promise<void>;
};

const TW007_SCHEMA = z.object({
  newTwinClassId: FIRST_ID_EXTRACTOR,
});

type TW007FormValues = z.infer<typeof TW007_SCHEMA>;

export function TW007EntryClient({ faceData, twinClass, onChange }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const twinClassBySearchIdAdapter = useTwinClassBySearchIdSelectAdapter();
  const router = useRouter();

  const form = useForm<TW007FormValues>({
    resolver: zodResolver(TW007_SCHEMA),
    defaultValues: {
      newTwinClassId: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await onChange(values.newTwinClassId);

    toast.success(`Category is changed successfully!`);
    router.refresh();
    setIsOpen(false);
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
            {twinClass && (
              <div className="text-muted-foreground">
                Current category:&nbsp;
                <span className="text-foreground">{twinClass.name}</span>
              </div>
            )}

            <ComboboxFormField
              control={form.control}
              name="newTwinClassId"
              label={faceData?.classSelectorLabel || "Select class"}
              {...twinClassBySearchIdAdapter}
              getItems={(search: string) =>
                twinClassBySearchIdAdapter.getItems(
                  faceData?.twinClassSearchId!,
                  {
                    search,
                    params: faceData?.twinClassSearchParams,
                  }
                )
              }
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
