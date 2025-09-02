import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ComboboxFormField, TextFormField } from "@/components/form-fields";

import { useCreateTwin, useTwinClassFields } from "@/entities/twin";
import { TwinCreateRq } from "@/entities/twin/server";
import { FIRST_ID_EXTRACTOR, cn } from "@/shared/libs";
import { Button } from "@/shared/ui";

type Props = {
  onBack: () => void;
  baseTwinClassId?: string;
};

export const CREATE_PRODUCT_SCHEMA = z.object({
  classId: FIRST_ID_EXTRACTOR,
  name: z.string().min(1, "Name is required"),
  isSketch: z.boolean().optional(),
  fields: z.object({
    ean: z
      .string()
      .trim()
      .min(1, "EAN is required")
      .regex(/^(?:\d{8}|\d{13})$/, "EAN must be 8 or 13 digits"),
    sku: z.string().min(1, "SKU is required"),
  }),
});

export function CreateProduct({ onBack, baseTwinClassId }: Props) {
  const { createTwin } = useCreateTwin();

  const form = useForm<z.infer<typeof CREATE_PRODUCT_SCHEMA>>({
    resolver: zodResolver(CREATE_PRODUCT_SCHEMA),
    mode: "onChange",
    defaultValues: {
      classId: "",
      name: "",
      isSketch: true,
      fields: {
        ean: "",
        sku: "",
      },
    },
  });

  const { twinClassAdapter } = useTwinClassFields(form.control, {
    baseTwinClassId,
  });

  async function handleOnCreateSubmit(
    formValues: z.infer<typeof CREATE_PRODUCT_SCHEMA>
  ) {
    const body: TwinCreateRq = { ...formValues };

    await createTwin({ body });
    onBack();
    toast.success(`Product ${body.name} is created successfully!`);
  }

  return (
    <div className="relative flex h-screen flex-1 flex-col py-4">
      <div className="bg-background flex h-[56px] items-center rounded-t-[20px] px-6 shadow-[0_1px_0_0_#D9DEE9]">
        <div className="font-rubik text-[16px] leading-[1.1] font-medium text-[#0D114E]">
          Create new On Shelves product
        </div>
      </div>

      <div
        className={cn(
          "bg-background border-border mt-[1px] flex flex-1 justify-center rounded-b-[20px] border-t p-6"
        )}
      >
        <div className="mt-4 flex w-[760px] flex-col gap-4">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnCreateSubmit)}
              className="flex flex-col gap-4"
            >
              <TextFormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Name"
              />
              <TextFormField
                control={form.control}
                name="fields.ean"
                label="EAN"
                placeholder="EAN"
              />
              <TextFormField
                control={form.control}
                name="fields.sku"
                label="SKU"
                placeholder="SKU"
              />
              <ComboboxFormField
                control={form.control}
                name="classId"
                label="Product type"
                selectPlaceholder="Product type"
                searchPlaceholder="Search product types..."
                noItemsText="No product types found"
                {...twinClassAdapter}
              />

              <div className="mt-5 flex justify-end gap-4">
                <Button
                  className={cn(
                    "border-ons-blue-500 hover:border-ons-blue-700 text-ons-blue-500 hover:text-ons-blue-700 hover:bg-ons-blue-700 h-[40px] w-[200px] rounded-[8px] border bg-white text-[14px] font-normal hover:bg-white"
                  )}
                  onClick={onBack}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    "bg-primary hover:bg-ons-blue-700 h-[40px] w-[200px] rounded-[8px] text-[14px] font-normal text-white",
                    !form.formState.isValid &&
                      "bg-ons-brand-50 hover:bg-ons-brand-50 hover:text-ons-blue-700 text-[#8B8DAA]"
                  )}
                >
                  Create new product
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      <Image
        width={480}
        height={480}
        src="/logo-512.png"
        alt="logo-ons"
        className="absolute bottom-4 left-0 rounded-bl-[20px]"
      />
    </div>
  );
}
