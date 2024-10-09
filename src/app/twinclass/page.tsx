'use client'

import { toast } from "sonner";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { useCallback, useContext, useRef, useState } from "react";
import { Check, Unplug } from "lucide-react";
import { TwinClass } from "@/lib/api/api-types";
import { TwinClassDialog } from "@/app/twinclass/twin-class-dialog";
import { ApiContext } from "@/lib/api/api";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { CrudDataTable, FiltersState } from "@/components/base/data-table/crud-data-table";
import { useRouter } from "next/navigation";
import { buildFilters, FilterFields, FILTERS } from "@/entities/twinClass";

const columns: ColumnDef<TwinClass>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: (data) => <ShortGuidWithCopy value={data.row.original.id} />
    },
    {
        accessorKey: "logo",
        header: "Logo",
        cell: (data) => {
            const value = data.row.original.logo;
            return <ImageWithFallback src={value as string} alt={value as string} fallbackContent={<Unplug />} width={32}
                height={32} className="text-[0]" />;
        }
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
        cell: (data) => <ShortGuidWithCopy value={data.row.original.headClassId}/>
    },
    {
        accessorKey: 'extendsClass.id',
        header: "Extends",
        cell: (data) => <ShortGuidWithCopy value={data.row.original.extendsClass?.id}/>
    },
    {
        accessorKey: "abstractClass",
        header: "Abstract",
        cell: (data) => <>{data.getValue() && <Check />}</>
    },
    // {
    //     header: "Actions",
    //     cell: (data) => {
    //         return <Link href={`/twinclass/${data.row.original.key}`}>
    //             <span className="inline-flex items-center"><LinkIcon className="mx-1"/> View</span>
    //         </Link>
    //     }
    // }
]

export default function TwinClasses() {
    const [classDialogOpen, setClassDialogOpen] = useState(false)

    const api = useContext(ApiContext)
    const router = useRouter()
    const tableRef = useRef<DataTableHandle>(null);

    const findTwinClassById = useCallback(async (id: string) => {
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
    }, [api]);

    const fetchTwinClasses = useCallback(
        async ({
            search,
            pagination,
            filters,
        }: {
            search?: string,
            pagination?: PaginationState,
            filters?: FiltersState
        }) => {
            const _pagination = pagination || { pageIndex: 0, pageSize: 10 };
            const _filters = buildFilters(filters ?? { filters: {} });

            try {
                const { data, error } = await api.twinClass.search({
                    search,
                    pagination: _pagination,
                    filters: _filters
                });

                if (error) {
                    throw new Error("Failed to fetch classes", error);
                }

                return {
                    data: data.twinClassList ?? [],
                    pageCount: Math.ceil((data.pagination?.total ?? 0) / _pagination.pageSize),
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
                fetcher={(pagination, filters) => fetchTwinClasses({ pagination, filters })}
                pageSizes={[10, 20, 50]}
                onRowClick={(row) => router.push(`/twinclass/${row.id}`)}
                createButton={{
                    enabled: true,
                    onClick: () => setClassDialogOpen(true),
                    text: 'Create Class'
                }}
                search={{ enabled: true, placeholder: 'Search by key...' }}
                filters={{
                    filtersInfo: {
                        [FilterFields.twinClassIdList]: FILTERS.twinClassIdList,
                        [FilterFields.twinClassKeyLikeList]: FILTERS.twinClassKeyLikeList,
                        [FilterFields.nameI18nLikeList]: FILTERS.nameI18nLikeList,
                        [FilterFields.descriptionI18nLikeList]: FILTERS.descriptionI18nLikeList,
                        [FilterFields.headTwinClassIdList]: {
                            ...FILTERS.headTwinClassIdList,
                            getById: findTwinClassById,
                            getItems: async (search) => (await fetchTwinClasses({ search })).data,
                            getItemKey: (item) => item?.id,
                            getItemLabel: ({ key = '', name }) => `${key}${name ? ` (${name})` : ''}`,
                        },
                        [FilterFields.extendsTwinClassIdList]: {
                            ...FILTERS.extendsTwinClassIdList,
                            getById: findTwinClassById,
                            getItems: async (search) => (await fetchTwinClasses({ search })).data,
                            getItemKey: (item) => item?.id,
                            getItemLabel: ({ key = '', name }) => `${key}${name ? ` (${name})` : ''}`,
                        },
                        [FilterFields.ownerTypeList]: FILTERS.ownerTypeList,
                        [FilterFields.twinflowSchemaSpace]: FILTERS.twinflowSchemaSpace,
                        [FilterFields.twinClassSchemaSpace]: FILTERS.twinClassSchemaSpace,
                        [FilterFields.permissionSchemaSpace]: FILTERS.permissionSchemaSpace,
                        [FilterFields.aliasSpace]: FILTERS.aliasSpace,
                        [FilterFields.abstractt]: FILTERS.abstractt
                    },
                    onChange: () => {
                        console.log("Filters changed")
                        return Promise.resolve()
                    }
                }}
                customizableColumns={{
                    enabled: true,
                    defaultVisibleKeys: [
                        'id',
                        'key',
                        'name',
                        'headClassId',
                        'extendsClass.id',
                        'abstractClass'
                    ],
                }}
            />

            <TwinClassDialog open={classDialogOpen}
                onOpenChange={(newOpen) => {
                    setClassDialogOpen(newOpen);
                }}
                onSuccess={() => tableRef.current?.refresh()}
            />

        </main>
    );
}
