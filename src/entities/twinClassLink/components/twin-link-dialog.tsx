import { Button } from "@/components/base/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import { Form } from "@/components/base/form";
import { ComboboxFormField } from "@/components/form-fields/combobox-form-field";
import { TextFormField } from "@/components/form-fields/text-form-field";
import {
  CreateLinkRequestBody,
  LinkStrengthEnum,
  LinkTypesEnum,
  TWIN_CLASS_LINK_STRENGTH,
  TWIN_CLASS_LINK_TYPES,
} from "@/entities/twinClassLink";
import { ApiContext } from "@/lib/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TwinLinkDialogProps {
  open: boolean;
  srcTwinClassId?: string;
  dstTwinClassId?: string;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const twinLinkSchema = z.object({
  twinClassId: z.string().uuid("Twin Class ID must be a valid UUID"),
  nameI18n: z.string().min(1, "Name must not be empty"),
  type: z.enum(
    [LinkTypesEnum.ManyToMany, LinkTypesEnum.ManyToOne, LinkTypesEnum.OneToOne],
    { message: "Invalid type" }
  ),
  linkStrength: z.enum(
    [
      LinkStrengthEnum.MANDATORY,
      LinkStrengthEnum.OPTIONAL,
      LinkStrengthEnum.OPTIONAL_BUT_DELETE_CASCADE,
    ],
    { message: "Invalid link strength" }
  ),
});

export const TwinClassLinkDialog = ({
  open,
  srcTwinClassId,
  dstTwinClassId,
  onOpenChange,
  onSuccess,
}: TwinLinkDialogProps) => {
  const api = useContext(ApiContext);

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen && form.formState.isSubmitting) {
      return;
    }

    onOpenChange?.(newOpen);
  }

  const form = useForm<z.infer<typeof twinLinkSchema>>({
    resolver: zodResolver(twinLinkSchema),
    defaultValues: {
      twinClassId: "",
      nameI18n: "",
      type: LinkTypesEnum.OneToOne,
      linkStrength: LinkStrengthEnum.MANDATORY,
    },
  });

  async function onSubmit(formValues: z.infer<typeof twinLinkSchema>) {
    const body: CreateLinkRequestBody = {
      srcTwinClassId: srcTwinClassId ?? formValues.twinClassId,
      dstTwinClassId: dstTwinClassId ?? formValues.twinClassId,
      forwardNameI18n: {
        translations: {
          en: formValues.nameI18n,
        },
      },
      backwardNameI18n: {
        translations: {
          en: formValues.nameI18n,
        },
      },
      type: formValues.type,
      linkStrength: formValues.linkStrength,
    };

    try {
      const { data, error } = await api.twinClassLink.create({ body });

      if (error) {
        toast.error(`Failed to create link: ${error.msg ?? error}`);
        return;
      }

      toast.success("Link created successfully!");
      onOpenChange?.(false);
      onSuccess?.();
    } catch (e) {
      console.error("Failed to submit link", e);
      toast.error("Failed to submit link");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[100%] sm:max-h-[80%]">
        <DialogHeader>
          <DialogTitle>Create Link</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 p-1">
              <TextFormField
                control={form.control}
                name="twinClassId"
                label="Destination Twin Class ID"
              />
              <TextFormField
                control={form.control}
                name="nameI18n"
                label="Link Name"
              />
              <ComboboxFormField
                control={form.control}
                name="type"
                label="Link Type"
                getById={async (id) =>
                  TWIN_CLASS_LINK_TYPES.find((i) => i.id === id)
                }
                getItems={async () => TWIN_CLASS_LINK_TYPES}
                getItemKey={({ id }) => id}
                getItemLabel={({ label }) => label}
                selectPlaceholder={"Select..."}
                searchPlaceholder={"Search..."}
                noItemsText={"No data found"}
              />
              <ComboboxFormField
                control={form.control}
                name="linkStrength"
                label="Link Strength"
                getById={async (id) => {
                  return TWIN_CLASS_LINK_STRENGTH.find((i) => i.id === id);
                }}
                getItems={async () => TWIN_CLASS_LINK_STRENGTH}
                getItemKey={({ id }) => id}
                getItemLabel={({ label }) => label}
                selectPlaceholder={"Select..."}
                searchPlaceholder={"Search..."}
                noItemsText={"No data found"}
              />
            </div>

            <div className="sticky bottom-0 bg-background">
              <DialogFooter className="sm:justify-end py-4">
                <Button type="submit" loading={form.formState.isSubmitting}>
                  Save
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
