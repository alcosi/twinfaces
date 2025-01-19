import { ImageWithFallback } from "@/components/image-with-fallback";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import {
  TWIN_CLASS_STATUS_SCHEMA,
  TwinClassStatusFormValues,
  TwinClassStatusResourceLink,
  TwinStatus_DETAILED,
  TwinStatusCreateRq,
  useTwinStatusSearchV1,
} from "@/entities/twinStatus";
import { ApiContext, PagedResponse } from "@/shared/api";
import { ColorTile } from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CrudDataTable, DataTableHandle } from "../../crud-data-table";
import { TwinClassStatusFormFields } from "./form-fields";

function buildColumnDefs() {
  const colDefs: ColumnDef<TwinStatus_DETAILED>[] = [
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
      id: "twinClassId",
      accessorKey: "twinClassId",
      header: "Twin class",
      cell: ({ row: { original } }) =>
        original.twinClass && (
          <div className="max-w-48 inline-flex">
            <TwinClassResourceLink
              data={original.twinClass as TwinClass_DETAILED}
              withTooltip
            />
          </div>
        ),
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
            twinClassId={original.twinClassId!}
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

export function TwinClassStatusesTable({
  twinClassId,
}: {
  twinClassId?: string;
}) {
  const api = useContext(ApiContext);
  const router = useRouter();
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
  ): Promise<PagedResponse<TwinStatus_DETAILED>> {
    try {
      return await searchTwinStatuses({
        pagination,
        filters: {
          twinClassIdList: twinClassId ? [twinClassId] : [],
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

    if (!twinClassId) {
      toast.error("Twin class ID is missing");
      return;
    }

    const { error } = await api.twinStatus.create({
      twinClassId,
      data: data,
    });

    if (error) {
      throw new Error("Failed to create status");
    }

    toast.success("Link created successfully!");
    fetchStatuses({ pageIndex: 0, pageSize: 10 });
  }

  return (
    <CrudDataTable
      title="Statuses"
      ref={tableRef}
      columns={buildColumnDefs()}
      getRowId={(row) => row.key!}
      fetcher={fetchStatuses}
      onRowClick={(row) =>
        router.push(
          `/workspace/twinclass/${row.twinClassId}/twinStatus/${row.id}`
        )
      }
      dialogForm={form}
      onCreateSubmit={handleCreate}
      renderFormFields={() => (
        <TwinClassStatusFormFields control={form.control} />
      )}
      pageSizes={[10, 20, 50]}
    />
  );
}
