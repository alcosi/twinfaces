import { ImageWithFallback } from "@/components/image-with-fallback";
import { TwinClassContext, useFetchTwinClassById } from "@/entities/twinClass";
import {
  TWIN_CLASS_STATUS_SCHEMA,
  TwinClassStatusFormValues,
  TwinClassStatusResourceLink,
  TwinStatus,
  TwinStatusCreateRq,
} from "@/entities/twinStatus";
import { isFalsy } from "@/shared/libs";
import { ColorTile } from "@/shared/ui";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { ColumnDef } from "@tanstack/table-core";
import { Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { toast } from "sonner";
import { ApiContext, PagedResponse } from "@/shared/api";
import { Experimental_CrudDataTable } from "@/widgets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TwinClassStatusFormFields } from "@/screens/twinClassStatus";

function buildColumnDefs(twinClassId: string) {
  const colDefs: ColumnDef<TwinStatus>[] = [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: (data) => {
        const value = data.row.original.logo;
        return (
          <ImageWithFallback
            src={value as string}
            alt={value as string}
            fallbackContent={<Unplug />}
            width={32}
            height={32}
            className="text-[0]"
          />
        );
      },
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "key",
      header: "Key",
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row: { original } }) => (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original}
            twinClassId={twinClassId}
            withTooltip
          />
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "backgroundColor",
      header: "Background Color",
      cell: (data) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <ColorTile color={data.getValue<string>()} />
            </TooltipTrigger>
            <TooltipContent>{data.getValue<string>()}</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "fontColor",
      header: "Font Color",
      cell: (data) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <ColorTile color={data.getValue<string>()} />
            </TooltipTrigger>
            <TooltipContent>{data.getValue<string>()}</TooltipContent>
          </Tooltip>
        );
      },
    },
  ];

  return colDefs;
}

export function TwinClassStatuses() {
  const api = useContext(ApiContext);
  const router = useRouter();
  const { twinClass, fetchClassData } = useContext(TwinClassContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { fetchTwinClassById } = useFetchTwinClassById();

  const form = useForm<TwinClassStatusFormValues>({
    resolver: zodResolver(TWIN_CLASS_STATUS_SCHEMA),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      logo: "",
      backgroundColor: "#000000",
      fontColor: "#000000",
    },
  });

  async function fetchStatuses(): Promise<PagedResponse<TwinStatus>> {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const response = await fetchTwinClassById({
        id: twinClass.id,
        query: {
          showTwinClassMode: "SHORT",
          showTwin2StatusMode: "DETAILED",
          showTwinClass2StatusMode: "DETAILED",
        },
      });

      const data = response.data;
      if (!data || data.status != 0) {
        console.error("failed to fetch twin class fields", data);
        let message = "Failed to load twin class fields";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pagination: {} };
      }

      const values = Object.values(data.twinClass?.statusMap ?? {});
      return {
        data: values,
        pagination: {},
      };
    } catch (e) {
      console.error("exception while fetching twin class fields", e);
      toast.error("Failed to fetch twin class fields");
      return { data: [], pagination: {} };
    }
  }

  if (isFalsy(twinClass)) {
    console.error("TwinClassFields: no twin class");
    return;
  }

  async function handleCreate(formValues: TwinClassStatusFormValues) {
    const data: TwinStatusCreateRq = {
      key: formValues.key,
      nameI18n: {
        translationInCurrentLocale: formValues.name,
        translations: {},
      },
      descriptionI18n: {
        translationInCurrentLocale: formValues.description,
        translations: {},
      },
      logo: formValues.logo,
      backgroundColor: formValues.backgroundColor,
      fontColor: formValues.fontColor,
    };

    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return;
    }

    const { error } = await api.twinStatus.create({
      twinClassId: twinClass.id,
      data: data,
    });

    if (error) {
      throw new Error("Failed to create status");
    }

    toast.success("Link created successfully!");
    fetchClassData();
  }

  return (
    <Experimental_CrudDataTable
      ref={tableRef}
      columns={buildColumnDefs(twinClass.id!)}
      getRowId={(row) => row.key!}
      fetcher={fetchStatuses}
      onRowClick={(row) =>
        router.push(`/twinclass/${twinClass!.id!}/twinStatus/${row.id}`)
      }
      dialogForm={form}
      onCreateSubmit={handleCreate}
      renderFormFields={() => (
        <TwinClassStatusFormFields control={form.control} />
      )}
      disablePagination={true}
    />
  );
}
