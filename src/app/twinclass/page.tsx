"use client";

import { TwinClassDialog } from "@/app/twinclass/twin-class-dialog";
import { CrudDataTable } from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { ImageWithFallback } from "@/components/image-with-fallback";
import {
  FilterFields,
  FILTERS,
  TwinClass_DETAILED,
  TwinClassResourceLink,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { ColumnDef } from "@tanstack/table-core";
import { Check, Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

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
  const api = useContext(ApiContext);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTwinClasses } = useTwinClassSearchV1();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Classes", href: "/twinclass" }]);
  }, []);

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

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={(pagination, filters) =>
          searchTwinClasses({ pagination, filters })
        }
        pageSizes={[10, 20, 50]}
        onRowClick={(row) => router.push(`/twinclass/${row.id}`)}
        createButton={{
          enabled: true,
          onClick: () => setClassDialogOpen(true),
          text: "Create Class",
        }}
        filters={{
          // TODO: Fix typing by removing `any`
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
                (await searchTwinClasses({ search })).data,
              getItemKey: (item: any) => item?.id,
              getItemLabel: ({ key = "", name }: any) =>
                `${key}${name ? ` (${name})` : ""}`,
            },
            [FilterFields.extendsTwinClassIdList]: {
              ...FILTERS.extendsTwinClassIdList,
              getById: findTwinClassById,
              getItems: async (search) =>
                (await searchTwinClasses({ search })).data,
              getItemKey: (item: any) => item?.id,
              getItemLabel: ({ key = "", name }: any) =>
                `${key}${name ? ` (${name})` : ""}`,
            },
            [FilterFields.ownerTypeList]: FILTERS.ownerTypeList as any,
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
