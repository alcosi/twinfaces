"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  CreateLinkRequestBody,
  LINK_SCHEMA,
  Link,
  LinkCountGroup,
  LinkFilterKeys,
  LinkStrengthEnum,
  LinkTypesEnum,
  useCreateLink,
  useLinkCount,
  useLinkFilters,
  useLinkSearch,
} from "@/entities/link";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { formatIntlDate } from "@/shared/libs";
import { Badge, GuidWithCopy } from "@/shared/ui";
import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "@/widgets/crud-data-table";

import { CreateLinkFormFields } from "./form-fields";

const colDefs: Record<
  | "id"
  | "name"
  | "backwardName"
  | "srcTwinClass"
  | "dstTwinClass"
  | "createdByUser"
  | "createdAt"
  | "type"
  | "linkStrengthId",
  ColumnDef<Link>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.row.original.id} />,
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: () => <SortableHeader title="Name" sortField="forwardName" />,
  },
  backwardName: {
    id: "backwardName",
    accessorKey: "backwardName",
    header: () => (
      <SortableHeader title="Backward name" sortField="backwardName" />
    ),
  },
  srcTwinClass: {
    id: "srcTwinClass",
    accessorKey: "srcTwinClass",
    header: () => (
      <SortableHeader title="Source Twin Class" sortField="srcTwinClassName" />
    ),
    cell: ({ row: { original } }) =>
      original.srcTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.srcTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  dstTwinClass: {
    id: "dstTwinClass",
    accessorKey: "dstTwinClass",
    header: () => (
      <SortableHeader
        title="Destination Twin Class"
        sortField="dstTwinClassName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.dstTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.dstTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  type: {
    accessorKey: "type",
    header: () => <SortableHeader title="Type" sortField="type" />,
    cell: ({ row: { original } }) => (
      <Badge variant="outline">{original.type}</Badge>
    ),
  },
  linkStrengthId: {
    accessorKey: "linkStrengthId",
    header: () => (
      <SortableHeader title="Link strength" sortField="linkStrength" />
    ),
    cell: ({ row: { original } }) => (
      <Badge variant="outline">{original.linkStrengthId}</Badge>
    ),
  },
  createdByUser: {
    id: "createdByUser",
    accessorKey: "createdByUser",
    header: () => (
      <SortableHeader title="Created by User" sortField="createdByUser" />
    ),
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: () => <SortableHeader title="Created at" sortField="createdAt" />,
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
};

export function LinksScreen() {
  const router = useRouter();
  const { searchLinks } = useLinkSearch();
  const { countLinks } = useLinkCount();
  const { buildFilterFields, mapFiltersToPayload } = useLinkFilters();
  const { createLink } = useCreateLink();

  const linkForm = useForm<z.infer<typeof LINK_SCHEMA>>({
    resolver: zodResolver(LINK_SCHEMA),
    defaultValues: {
      srcTwinClassId: "",
      dstTwinClassId: "",
      name: "",
      type: LinkTypesEnum.OneToOne,
      linkStrength: LinkStrengthEnum.MANDATORY,
    },
  });

  async function fetchLink(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<Link>> {
    const _filters = mapFiltersToPayload(
      filters.filters as Record<LinkFilterKeys, unknown>
    );

    try {
      return searchLinks({ pagination, filters: _filters, sort });
    } catch (error) {
      toast.error("An error occured while fetching links: " + error);
      throw new Error("An error occured while fetching links: " + error);
    }
  }

  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<LinkFilterKeys, unknown>
      );

      return [
        {
          key: "type",
          label: "Type",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countLinks({
                filters: resolved,
                groupField: "type",
                offset,
                limit,
              }),
            (g: LinkCountGroup) => g.type,
            (g: LinkCountGroup) => g.type,
            (g: LinkCountGroup) =>
              g.type && <Badge variant="outline">{g.type}</Badge>
          ),
        },
        {
          key: "linkStrength",
          label: "Link strength",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countLinks({
                filters: resolved,
                groupField: "linkStrength",
                offset,
                limit,
              }),
            (g: LinkCountGroup) => g.linkStrength,
            (g: LinkCountGroup) => g.linkStrength,
            (g: LinkCountGroup) =>
              g.linkStrength && (
                <Badge variant="outline">{g.linkStrength}</Badge>
              )
          ),
        },
        {
          key: "srcTwinClass",
          label: "Source Twin Class",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countLinks({
                filters: resolved,
                groupField: "srcTwinClassId",
                offset,
                limit,
              }),
            (g: LinkCountGroup) => g.srcTwinClassId,
            (g: LinkCountGroup) => g.srcTwinClass?.name,
            (g: LinkCountGroup) =>
              g.srcTwinClass && (
                <TwinClassResourceLink data={g.srcTwinClass} withTooltip />
              )
          ),
        },
        {
          key: "dstTwinClass",
          label: "Destination Twin Class",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countLinks({
                filters: resolved,
                groupField: "dstTwinClassId",
                offset,
                limit,
              }),
            (g: LinkCountGroup) => g.dstTwinClassId,
            (g: LinkCountGroup) => g.dstTwinClass?.name,
            (g: LinkCountGroup) =>
              g.dstTwinClass && (
                <TwinClassResourceLink data={g.dstTwinClass} withTooltip />
              )
          ),
        },
        {
          key: "createdByUserId",
          label: "Created by User",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countLinks({
                filters: resolved,
                groupField: "createdByUserId",
                offset,
                limit,
              }),
            (g: LinkCountGroup) => g.createdByUserId,
            (g: LinkCountGroup) =>
              g.createdByUser?.email ??
              g.createdByUser?.fullName ??
              g.createdByUserId,
            (g: LinkCountGroup) =>
              g.createdByUser ? (
                <UserResourceLink data={g.createdByUser} withTooltip />
              ) : g.createdByUserId ? (
                <GuidWithCopy value={g.createdByUserId} />
              ) : undefined
          ),
        },
        {
          key: "srcTwinClassInheritable",
          label: "Src Twin Class Inheritable",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countLinks({
                filters: resolved,
                groupField: "srcTwinClassInheritable",
                offset,
                limit,
              }),
            (g: LinkCountGroup) => String(g.srcTwinClassInheritable),
            (g: LinkCountGroup) =>
              g.srcTwinClassInheritable ? "Inheritable" : "Not inheritable",
            (g: LinkCountGroup) => (
              <Badge variant="outline">
                {g.srcTwinClassInheritable ? "Inheritable" : "Not inheritable"}
              </Badge>
            )
          ),
        },
        {
          key: "dstTwinClassInheritable",
          label: "Dst Twin Class Inheritable",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countLinks({
                filters: resolved,
                groupField: "dstTwinClassInheritable",
                offset,
                limit,
              }),
            (g: LinkCountGroup) => String(g.dstTwinClassInheritable),
            (g: LinkCountGroup) =>
              g.dstTwinClassInheritable ? "Inheritable" : "Not inheritable",
            (g: LinkCountGroup) => (
              <Badge variant="outline">
                {g.dstTwinClassInheritable ? "Inheritable" : "Not inheritable"}
              </Badge>
            )
          ),
        },
      ];
    },
    [countLinks, mapFiltersToPayload]
  );

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof LINK_SCHEMA>
  ) => {
    const body: CreateLinkRequestBody = {
      forwardNameI18n: {
        translations: {
          en: formValues.name,
        },
      },
      backwardNameI18n: {
        translations: {
          en: formValues.name,
        },
      },
      ...formValues,
    };
    await createLink(body);
    toast.success("Link created successfully!");
  };

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.name,
        colDefs.backwardName,
        colDefs.srcTwinClass,
        colDefs.dstTwinClass,
        colDefs.type,
        colDefs.linkStrengthId,
        colDefs.createdByUser,
        colDefs.createdAt,
      ]}
      fetcher={fetchLink}
      getRowId={(row) => row.id!}
      onRowClick={(row) => router.push(`/${PlatformArea.core}/links/${row.id}`)}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.backwardName,
        colDefs.srcTwinClass,
        colDefs.dstTwinClass,
        colDefs.type,
        colDefs.linkStrengthId,
        colDefs.createdByUser,
        colDefs.createdAt,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      chartGroupings={buildChartGroupings}
      dialogForm={linkForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <CreateLinkFormFields control={linkForm.control} />
      )}
    />
  );
}
