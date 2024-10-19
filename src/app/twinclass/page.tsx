"use client";

import { TwinClassDialog } from "@/app/twinclass/twin-class-dialog";
import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ImageWithFallback } from "@/components/image-with-fallback";
import {
  buildFilters,
  FilterFields,
  FILTERS,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { ApiContext } from "@/lib/api/api";
import { TwinClass } from "@/lib/api/api-types";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check, Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useRef, useState } from "react";
import { toast } from "sonner";

const columns: ColumnDef<TwinClass>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinClassResourceLink data={original} withTooltip />
      </div>
    ),
  },
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
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "headClassId",
    header: "Head",
    cell: ({ row: { original } }) =>
      original.headClassId ? (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={{ id: original.headClassId }}
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
            data={{ ...original.extendsClass }}
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
  // {
  //     header: "Actions",
  //     cell: (data) => {
  //         return <Link href={`/twinclass/${data.row.original.key}`}>
  //             <span className="inline-flex items-center"><LinkIcon className="mx-1"/> View</span>
  //         </Link>
  //     }
  // }
];

export default function TwinClasses() {
  const [classDialogOpen, setClassDialogOpen] = useState(false);

  const api = useContext(ApiContext);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);

  const findTwinClassById = useCallback(
    async (id: string) => {
      try {
        const { data } = await api.twinClass.getById({
          id,
          query: {
            showTwinClassMode: "DETAILED",
            showTwin2TwinClassMode: "SHORT",
          },
        });
        return data?.twinClass;
      } catch (error) {
        console.error(`Failed to find twin class by ID: ${id}`, error);
        throw new Error(`Failed to find twin class with ID ${id}`);
      }
    },
    [api]
  );

  const fetchTwinClasses = useCallback(
    async ({
      search,
      pagination,
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: FiltersState;
    }) => {
      const _pagination = pagination || { pageIndex: 0, pageSize: 10 };
      const _filters = buildFilters(filters ?? { filters: {} });

      try {
        const { data, error } = await api.twinClass.search({
          search,
          pagination: _pagination,
          filters: _filters,
        });

        if (error) {
          throw new Error("Failed to fetch classes", error);
        }

        return {
          data: data.twinClassList ?? [],
          pageCount: Math.ceil(
            (data.pagination?.total ?? 0) / _pagination.pageSize
          ),
        };
      } catch (error) {
        console.error("Exception in fetchTwinClasses", error);
        toast.error("Failed to fetch twin classes data");
        return { data: [], pageCount: 0 };
      }
    },
    [api]
  );

  return (
    <main className={"p-8 lg:flex lg:justify-center flex-col mx-auto"}>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={(pagination, filters) =>
          fetchTwinClasses({ pagination, filters })
        }
        pageSizes={[10, 20, 50]}
        onRowClick={(row) => router.push(`/twinclass/${row.id}`)}
        createButton={{
          enabled: true,
          onClick: () => setClassDialogOpen(true),
          text: "Create",
        }}
        filters={{
          filtersInfo: {
            [FilterFields.twinClassIdList]: FILTERS.twinClassIdList,
            [FilterFields.twinClassKeyLikeList]: FILTERS.twinClassKeyLikeList,
            [FilterFields.nameI18nLikeList]: FILTERS.nameI18nLikeList,
            [FilterFields.descriptionI18nLikeList]:
              FILTERS.descriptionI18nLikeList,
            [FilterFields.headTwinClassIdList]: {
              ...FILTERS.headTwinClassIdList,
              getById: findTwinClassById,
              getItems: async (search) =>
                (await fetchTwinClasses({ search })).data,
              getItemKey: (item) => item?.id,
              getItemLabel: ({ key = "", name }) =>
                `${key}${name ? ` (${name})` : ""}`,
            },
            [FilterFields.extendsTwinClassIdList]: {
              ...FILTERS.extendsTwinClassIdList,
              getById: findTwinClassById,
              getItems: async (search) =>
                (await fetchTwinClasses({ search })).data,
              getItemKey: (item) => item?.id,
              getItemLabel: ({ key = "", name }) =>
                `${key}${name ? ` (${name})` : ""}`,
            },
            [FilterFields.ownerTypeList]: FILTERS.ownerTypeList,
            [FilterFields.twinflowSchemaSpace]: FILTERS.twinflowSchemaSpace,
            [FilterFields.twinClassSchemaSpace]: FILTERS.twinClassSchemaSpace,
            [FilterFields.permissionSchemaSpace]: FILTERS.permissionSchemaSpace,
            [FilterFields.aliasSpace]: FILTERS.aliasSpace,
            [FilterFields.abstractt]: FILTERS.abstractt,
          },
          onChange: () => {
            console.log("Filters changed");
            return Promise.resolve();
          },
        }}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "id",
            "key",
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
    </main>
  );
}
