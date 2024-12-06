import { TwinClass, TwinClassContext } from "@/entities/twinClass";
import {
  TwinClassField,
  TwinClassFieldCreateRq,
  useTwinClassFieldFilters,
} from "@/entities/twinClassField";
import { ApiContext, PagedResponse } from "@/shared/api";
import { REGEX_PATTERNS } from "@/shared/libs";
import { FiltersState } from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Experimental_CrudDataTable } from "@/widgets";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TwinClassFieldFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    TwinClassField,
    "id" | "key" | "name" | "description" | "required"
  >,
  ColumnDef<TwinClassField>
> = {
  id: {
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  key: {
    accessorKey: "key",
    header: "Key",
  },
  name: {
    accessorKey: "name",
    header: "Name",
  },
  description: {
    accessorKey: "description",
    header: "Description",
  },
  required: {
    accessorKey: "required",
    header: "Required",
    cell: (data) => <>{data.getValue() && <Check />}</>,
  },
};

const twinClassFieldchema = z.object({
  key: z
    .string()
    .min(1)
    .max(100)
    .regex(
      REGEX_PATTERNS.ALPHANUMERIC_WITH_DASHES,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  name: z.string().min(0).max(100),
  description: z.string(),
  required: z.boolean(),
  fieldTyperFeaturerId: z.number(),
  fieldTyperParams: z.record(z.string()),
});

export function TwinClassFields() {
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { buildFilterFields } = useTwinClassFieldFilters();

  async function fetchFields(
    _: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinClass>> {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const response = await api.twinClassField.getFields({ id: twinClass.id });
      const data = response.data;
      if (!data || data.status != 0) {
        console.error("failed to fetch twin class fields", data);
        let message = "Failed to load twin class fields";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pagination: {} };
      }
      // setFields(data.twinClassFieldList ?? []);
      return { data: data.twinClassFieldList ?? [], pagination: {} };
    } catch (e) {
      console.error("exception while fetching twin class fields", e);
      toast.error("Failed to fetch twin class fields");
      return { data: [], pagination: {} };
    }
  }

  const form = useForm<z.infer<typeof twinClassFieldchema>>({
    resolver: zodResolver(twinClassFieldchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      required: false,
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof twinClassFieldchema>
  ) => {
    const body: TwinClassFieldCreateRq = {
      key: formValues.key,
      required: formValues.required,
      nameI18n: {
        translationInCurrentLocale: formValues.name,
      },
      descriptionI18n: {
        translationInCurrentLocale: formValues.description,
      },
      fieldTyperFeaturerId: formValues.fieldTyperFeaturerId,
      fieldTyperParams: formValues.fieldTyperParams,
    };

    const { error } = await api.twinClassField.create({
      id: twinClass.id!,
      body,
    });
    if (error) {
      throw error;
    }
    toast.success("Class field created successfully!");
  };

  if (!twinClass) {
    console.error("TwinClassFields: no twin class");
    return;
  }
  return (
    <Experimental_CrudDataTable
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.required,
      ]}
      getRowId={(row) => row.key!}
      fetcher={fetchFields}
      disablePagination={true}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) =>
        router.push(`/twinclass/${twinClass!.id!}/twinField/${row.id}`)
      }
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.required,
      ]}
      dialogForm={form}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <TwinClassFieldFormFields control={form.control} />
      )}
    />
  );
}
