import { ImageWithFallback } from "@/components/image-with-fallback";
import { TwinClassContext } from "@/entities/twinClass";
import {
  TWIN_CLASS_STATUS_SCHEMA,
  TwinClassStatusFormValues,
  TwinClassStatusResourceLink,
  TwinStatus,
  TwinStatusCreateRq,
  useTwinStatusSearchV1,
} from "@/entities/twinStatus";
import { ApiContext, PagedResponse } from "@/shared/api";
import { ColorTile } from "@/shared/ui";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TwinClassStatusFormFields } from "./form-fields";

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
  // TODO: Replace with `function TwinClassStatuses({twinClassId}: { twinClassId?: string })`
  const {
    twinClassId = "a7d2b66b-c1f4-4dd0-8d99-dfe2925268c5",
    twinClass,
    fetchClassData,
  } = useContext(TwinClassContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTwinStatuses } = useTwinStatusSearchV1();

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

  async function fetchStatuses(
    pagination: PaginationState
  ): Promise<PagedResponse<TwinStatus>> {
    try {
      return await searchTwinStatuses({
        pagination,
        filters: {
          twinClassIdList: [twinClassId],
        },
      });
    } catch (e) {
      toast.error("Failed to fetch statuses");
      return { data: [], pagination: {} };
    }
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
    <CrudDataTable
      ref={tableRef}
      columns={buildColumnDefs(twinClassId)}
      getRowId={(row) => row.key!}
      fetcher={fetchStatuses}
      onRowClick={(row) =>
        router.push(`/workspace/twinclass/${twinClassId!}/twinStatus/${row.id}`)
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
