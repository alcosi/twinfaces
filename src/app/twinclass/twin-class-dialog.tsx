import { Alert } from "@/components/base/alert";
import { Button } from "@/components/base/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/base/dialog";
import { Form, FormItem, FormLabel } from "@/components/base/form";
import { FeaturerTypes, FeaturerValue } from "@/components/featurer-input";
import { CheckboxFormField } from "@/components/form-fields/checkbox-form-field";
import { FeaturerFormField } from "@/components/form-fields/featurer-form-field";
import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import {
  TwinClass,
  TwinClassCreateRq,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { TwinClassSelectField } from "@/features/twinClass";
import { ApiContext } from "@/shared/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

interface ClassDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => any;
  twinClass?: TwinClass;
  // On create or on edit success
  onSuccess?: () => any;
}

export enum ClassDialogMode {
  Create,
  Edit,
}

const classSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  name: z.string().min(1).max(100),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  abstractClass: z.boolean(),
  headHunterFeaturerId: z.number(),
  headHunterParams: z.record(z.string(), z.any()).optional(),
  headTwinClassId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  extendsTwinClassId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  logo: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  permissionSchemaSpace: z.boolean(),
  twinflowSchemaSpace: z.boolean(),
  twinClassSchemaSpace: z.boolean(),
  aliasSpace: z.boolean(),
  markerDataListId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  tagDataListId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  viewPermissionId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export function TwinClassDialog({
  open,
  onOpenChange,
  twinClass,
  onSuccess,
}: ClassDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [featurer, setFeaturer] = useState<FeaturerValue | null>(null);
  const { searchTwinClasses } = useTwinClassSearchV1();

  const mode = twinClass ? ClassDialogMode.Edit : ClassDialogMode.Create;

  const api = useContext(ApiContext);

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      abstractClass: false,
      headHunterFeaturerId: 0,
      headHunterParams: {},
      headTwinClassId: "",
      extendsTwinClassId: "",
      logo: "",
      permissionSchemaSpace: false,
      twinflowSchemaSpace: false,
      twinClassSchemaSpace: false,
      aliasSpace: false,
      markerDataListId: "",
      tagDataListId: "",
      viewPermissionId: "",
    },
  });

  const headTwinClassId = useWatch({
    control: form.control,
    name: "headTwinClassId",
    defaultValue: "",
  });

  useEffect(() => {
    console.log("headTwinClassId changed", headTwinClassId);
    if (!headTwinClassId) {
      setFeaturer(null);
    }
  }, [headTwinClassId]);

  function onOpenInternal() {
    form.reset();
    setError(null);
  }

  useEffect(() => {
    if (open) {
      onOpenInternal();
    }
  }, [open]);

  function onOpenChangeInternal(newOpen: boolean) {
    if (!newOpen && form.formState.isSubmitting) {
      return;
    }
    onOpenChange?.(newOpen);
  }

  async function onSubmit(data: z.infer<typeof classSchema>) {
    setError(null);

    // if (data.headTwinClassId && !featurer) {
    //     setError("Please select a featurer");
    //     return;
    // }

    // console.log(data);
    // return;

    const { name, description, ...withoutI18 } = data;

    const requestBody: TwinClassCreateRq = {
      ...withoutI18,
      // headHunterFeaturerId: featurer?.featurer.id,
      // headHunterParams: featurer?.params,
      nameI18n: {
        translationInCurrentLocale: name,
        translations: {},
      },
      descriptionI18n: description
        ? {
            translationInCurrentLocale: description,
            translations: {},
          }
        : undefined,
    };

    const { data: response, error } = await api.twinClass.create({
      body: requestBody,
    });

    if (error) {
      console.error("failed to create class", error, typeof error);
      const errorMessage = error.msg;
      setError("Failed to create class: " + errorMessage ?? error);
      return;
    }

    onOpenChange?.(false);
    onSuccess?.();
  }

  async function fetchClasses(search: string) {
    const { data } = await searchTwinClasses({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: { filters: { nameI18nLikeList: ["%" + search + "%"] } },
    });

    return data ?? [];
  }

  async function findClassById(id: string) {
    const response = await api.twinClass.getById({
      id,
      query: {
        showTwinClassMode: "DETAILED",
        showTwin2TwinClassMode: "SHORT",
      },
    });
    return response.data?.twinClass;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeInternal}>
      <DialogContent className="sm:max-w-md max-h-[100%] sm:max-h-[80%]">
        <DialogTrigger asChild>Open</DialogTrigger>
        <DialogHeader>
          <DialogTitle>
            {mode === ClassDialogMode.Create && "Create new class"}
            {mode === ClassDialogMode.Edit && "Edit class " + twinClass?.key}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 overflow-y-auto max-h-[60vh] px-8 py-6"
          >
            <TextFormField
              control={form.control}
              name="key"
              label="Key"
              autoFocus={true}
            />

            <TextFormField control={form.control} name="name" label="Name" />

            <TextAreaFormField
              control={form.control}
              name="description"
              label="Description"
            />

            <CheckboxFormField
              control={form.control}
              name="abstractClass"
              label="Is abstract"
            />

            <TextFormField
              control={form.control}
              name="logo"
              label="Logo URL"
            />

            <TwinClassSelectField
              control={form.control}
              name="headTwinClassId"
              label="Head"
            />

            {headTwinClassId && (
              <>
                <FeaturerFormField
                  control={form.control}
                  name={"headHunterFeaturerId"}
                  paramsName={"headHunterParams"}
                  typeId={FeaturerTypes.headHunter}
                  label={"Head Hunter"}
                />
                {/*<FeaturerInput typeId={FeaturerTypes.headHunter} onChange={(val) => {*/}
                {/*    console.log('new featurer', val)*/}
                {/*    setFeaturer(val)*/}
                {/*}}/>*/}
              </>
            )}

            <TwinClassSelectField
              control={form.control}
              name="extendsTwinClassId"
              label="Extends"
            />

            <CheckboxFormField
              control={form.control}
              name="permissionSchemaSpace"
              label="Permission schema space"
            />

            <CheckboxFormField
              control={form.control}
              name="twinflowSchemaSpace"
              label="Twinflow schema space"
            />

            <CheckboxFormField
              control={form.control}
              name="twinClassSchemaSpace"
              label="Twin class schema space"
            />

            <CheckboxFormField
              control={form.control}
              name="aliasSpace"
              label="Alias space"
            />

            <TextFormField
              control={form.control}
              name="markerDataListId"
              label="Marker data list ID"
            />

            <TextFormField
              control={form.control}
              name="tagDataListId"
              label="Tag data list ID"
            />

            <TextFormField
              control={form.control}
              name="viewPermissionId"
              label="View permission ID"
            />

            {error && <Alert variant="destructive">{error}</Alert>}
          </form>
        </Form>

        <DialogFooter className="sm:justify-end bg-background p-6">
          <Button type="submit" loading={form.formState.isSubmitting}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ViewOrEditTextProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: ReactNode;
  value?: string;
  onEdit?: () => any;
}

function ViewOrEditText<T extends FieldValues>({
  name,
  control,
  label,
  value,
  onEdit,
}: ViewOrEditTextProps<T>) {
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return <TextFormField control={control} name={name} label={label} />;
  }

  return (
    <FormItem onClick={() => setEditMode(true)}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="flex flex-row items-center space-x-2">
        <div>{value}</div>
      </div>
    </FormItem>
  );
}
