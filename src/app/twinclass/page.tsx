"use client";

import { TwinClassDialog } from "@/app/twinclass/twin-class-dialog";
import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { ImageWithFallback } from "@/components/image-with-fallback";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
  useTwinClassFilters,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check, Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const columns: ColumnDef<TwinClass_DETAILED>[] = [
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
    header: "Id",
    cell: (data) => <ShortGuidWithCopy value={data.row.original.id} />,
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
        <TwinClassResourceLink data={original} withTooltip />
      </div>
    ),
  },
  {
    accessorKey: "headClassId",
    header: "Head",
    cell: ({ row: { original } }) =>
      original.headClass ? (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.headClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ) : null,
  },
  {
    accessorKey: "extendsClass.id",
    header: "Extends",
    cell: ({ row: { original } }) =>
      original.extendsClass ? (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.extendsClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ) : null,
  },
  {
    accessorKey: "abstractClass",
    header: "Abstract",
    cell: (data) => <>{data.getValue() && <Check />}</>,
  },
];

export default function TwinClasses() {
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTwinClasses } = useTwinClassSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFilters();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Classes", href: "/twinclass" }]);
  }, []);

  async function fetchTwinClasses(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<{ data: TwinClass_DETAILED[]; pageCount: number }> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchTwinClasses({
        pagination,
        filters: _filters,
      });
    } catch (error) {
      toast.error("Failed to fetch twin classes");
      return { data: [], pageCount: 0 };
    }
  }

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={fetchTwinClasses}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) => router.push(`/twinclass/${row.id}`)}
        createButton={{
          enabled: true,
          onClick: () => setClassDialogOpen(true),
          text: "Create Class",
        }}
        filters={{
          filtersInfo: buildFilterFields(),
          onChange: () => {
            console.log("Filters changed");
            return Promise.resolve();
          },
        }}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "name",
            "headClassId",
            "extendsClass.id",
            "abstractClass",
          ],
        }}
      />

      <TwinClassDialog
        open={classDialogOpen}
        onOpenChange={(newOpen) => {
          setClassDialogOpen(newOpen);
        }}
        onSuccess={() => tableRef.current?.refresh()}
      />
    </>
  );
}
