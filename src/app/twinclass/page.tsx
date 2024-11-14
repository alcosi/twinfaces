"use client";

import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { ImageWithFallback } from "@/components/image-with-fallback";
import {
  FilterFields,
  FILTERS,
  TWIN_CLASSES_SCHEMA,
  TwinClass_DETAILED,
  TwinClassCreateRq,
  TwinClassResourceLink,
  useFetchTwinClassById,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ColumnDef } from "@tanstack/table-core";
import { Check, Unplug } from "lucide-react";
import { Experimental_CrudDataTable } from "@/widgets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { TwinClassFormFields } from "@/app/twinclass/twin-class-form-fields";
import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ApiContext } from "@/shared/api";

const colDefs: Record<
  keyof Pick<
    TwinClass_DETAILED,
    | "logo"
    | "id"
    | "key"
    | "name"
    | "headClassId"
    | "extendsClassId"
    | "abstractClass"
    | "description"
  >,
  ColumnDef<TwinClass_DETAILED>
> = {
  logo: {
    id: "logo",
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

  id: {
    id: "id",
    accessorKey: "id",
    header: "Id",
    cell: (data) => <ShortGuidWithCopy value={data.row.original.id} />,
  },

  key: {
    id: "key",
    accessorKey: "key",
    header: "Key",
  },

  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinClassResourceLink data={original} withTooltip />
      </div>
    ),
  },

  headClassId: {
    id: "headClassId",
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

  extendsClassId: {
    id: "extendsClass.id",
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

  abstractClass: {
    id: "abstractClass",
    accessorKey: "abstractClass",
    header: "Abstract",
    cell: (data) => <>{data.getValue() && <Check />}</>,
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
};

export default function TwinClasses() {
  const api = useContext(ApiContext);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTwinClasses } = useTwinClassSearchV1();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { fetchTwinClassById } = useFetchTwinClassById();

  useEffect(() => {
    setBreadcrumbs([{ label: "Classes", href: "/twinclass" }]);
  }, []);

  async function findById(id: string) {
    return (
      await fetchTwinClassById({
        id,
        query: {
          showTwinClassMode: "DETAILED",
          showTwin2TwinClassMode: "SHORT",
        },
      })
    ).data?.twinClass;
  }

  const twinClassesForm = useForm<z.infer<typeof TWIN_CLASSES_SCHEMA>>({
    resolver: zodResolver(TWIN_CLASSES_SCHEMA),
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

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof TWIN_CLASSES_SCHEMA>
  ) => {
    const { name, description, ...withoutI18 } = formValues;

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

    const { error } = await api.twinClass.create({ body: requestBody });

    if (error) {
      throw error;
    }
    toast.success("Twin class created successfully!");
  };

  return (
    <main className={"p-8 lg:flex lg:justify-center flex-col mx-auto"}>
      <Experimental_CrudDataTable
        ref={tableRef}
        fetcher={(pagination, filters) =>
          searchTwinClasses({ pagination, filters })
        }
        onRowClick={(row) => router.push(`/twinclass/${row.id}`)}
        columns={[
          colDefs.logo!,
          colDefs.id!,
          colDefs.key!,
          colDefs.name!,
          colDefs.headClassId!,
          colDefs.extendsClassId!,
          colDefs.abstractClass!,
          colDefs.description!,
        ]}
        getRowId={(row) => row.id!}
        pageSizes={[10, 20, 50]}
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
              getById: findById,
              getItems: async (search) =>
                (await searchTwinClasses({ search })).data,
              getItemKey: (item: any) => item?.id,
              getItemLabel: ({ key = "", name }: any) =>
                `${key}${name ? ` (${name})` : ""}`,
            },
            [FilterFields.extendsTwinClassIdList]: {
              ...FILTERS.extendsTwinClassIdList,
              getById: findById,
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
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.key,
          colDefs.name,
          colDefs.headClassId,
          colDefs.extendsClassId,
          colDefs.abstractClass,
        ]}
        dialogForm={twinClassesForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <TwinClassFormFields control={twinClassesForm.control} />
        )}
      />
    </main>
  );
}
