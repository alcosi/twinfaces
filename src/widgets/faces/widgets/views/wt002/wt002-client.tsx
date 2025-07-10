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

type ButtonWithModalData = {
  button: FaceWT002Button;
  modalData?: FaceTC;
};

export function WT002Client({
  createButtonsData,
}: {
  createButtonsData: ButtonWithModalData[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { createTwin } = useCreateTwin();

  return (
    <>
      {createButtonsData.map(({ button, modalData }) => {
        const Icon = isPopulatedString(button.icon)
          ? () => (
              <Image
                src={button.icon!}
                alt="icon"
                width={16}
                height={16}
                className="mr-2 dark:invert"
              />
            )
          : undefined;

        const isOpen = openId === button.id;

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
          console.log("Submit for button", button.label, values);

          const body: TwinCreateRq = {
            ...values,
            fields: filteredFields,
          };

          await createTwin({ body });
          toast.success(`Twin ${body.name} is created successfully!`);
          setOpenId(null);
        });

        return (
          <Dialog
            key={button.id}
            open={isOpen}
            onOpenChange={(o) => setOpenId(o ? (button.id ?? null) : null)}
          >
            <DialogTrigger asChild>
              <Button variant="outline" IconComponent={Icon}>
                {button.label}
              </Button>
            </DialogTrigger>

            {modalData && (
              <DialogContent
                showCloseButton
                className="flex max-h-[70vh] flex-col"
              >
                <DialogHeader className="p-6">
                  <DialogTitle>{button.label ?? "Create modal"}</DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                  <form
                    id={`form-${button.id}`}
                    className="flex-1 space-y-6 overflow-y-auto px-8 py-6"
                    onSubmit={onSubmit}
                  >
                    <TCForm
                      control={form.control}
                      modalCreateData={modalData}
                    />
                  </form>
                </FormProvider>

                <DialogFooter className="p-8" showSeparator={true}>
                  <Button type="submit" form={`form-${button.id}`}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
        );
      })}
    </>
  );
}
