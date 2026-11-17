"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  CreateLinkRequestBody,
  LINK_SCHEMA,
  Link,
  LinkCountGroup,
  LinkCountGroupField,
  LinkFilterKeys,
  LinkFilters,
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
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupings,
  narrowBy,
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

  const resolveFilters = useCallback(
    (filters: Record<LinkFilterKeys, unknown>): LinkFilters =>
      mapFiltersToPayload(filters),
    [mapFiltersToPayload]
  );

  async function fetchLink(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<Link>> {
    const _filters = resolveFilters(
      filters.filters as Record<LinkFilterKeys, unknown>
    );

    try {
      return searchLinks({ pagination, filters: _filters, sort });
    } catch (error) {
      toast.error("An error occured while fetching links: " + error);
      throw new Error("An error occured while fetching links: " + error);
    }
  }

  // Server-side breakdowns backed by the link count endpoint, bound to the
  // active filters: the pie charts, and the grouping of the table view, whose
  // groups open through the matching search filters.
  const { chartGroupings, grouping } = useMemo(
    () =>
      buildCountGroupings<Link, LinkCountGroup, LinkFilters>({
        fields: [
          {
            key: "type",
            label: "Type",
            groupField: "type",
            getValue: (g) => g.type,
            getText: (g) => g.type,
            renderLabel: (g) =>
              g.type && <Badge variant="outline">{g.type}</Badge>,
            narrow: narrowBy.valueList<LinkFilters>("typeLikeList"),
          },
          {
            key: "linkStrength",
            label: "Link strength",
            groupField: "linkStrength",
            getValue: (g) => g.linkStrength,
            getText: (g) => g.linkStrength,
            renderLabel: (g) =>
              g.linkStrength && (
                <Badge variant="outline">{g.linkStrength}</Badge>
              ),
            narrow: narrowBy.valueList<LinkFilters>("strengthLikeList"),
          },
          {
            key: "srcTwinClass",
            label: "Source Twin Class",
            groupField: "srcTwinClassId",
            getValue: (g) => g.srcTwinClassId,
            getText: (g) => g.srcTwinClass?.name,
            renderLabel: (g) =>
              g.srcTwinClass && (
                <TwinClassResourceLink data={g.srcTwinClass} withTooltip />
              ),
            narrow: narrowBy.idList<LinkFilters>("srcTwinClassIdList"),
          },
          {
            key: "dstTwinClass",
            label: "Destination Twin Class",
            groupField: "dstTwinClassId",
            getValue: (g) => g.dstTwinClassId,
            getText: (g) => g.dstTwinClass?.name,
            renderLabel: (g) =>
              g.dstTwinClass && (
                <TwinClassResourceLink data={g.dstTwinClass} withTooltip />
              ),
            narrow: narrowBy.idList<LinkFilters>("dstTwinClassIdList"),
          },
          {
            key: "createdByUserId",
            label: "Created by User",
            groupField: "createdByUserId",
            getValue: (g) => g.createdByUserId,
            getText: (g) =>
              g.createdByUser?.email ??
              g.createdByUser?.fullName ??
              g.createdByUserId,
            renderLabel: (g) =>
              g.createdByUser ? (
                <UserResourceLink data={g.createdByUser} withTooltip />
              ) : g.createdByUserId ? (
                <GuidWithCopy value={g.createdByUserId} />
              ) : undefined,
          },
          {
            key: "srcTwinClassInheritable",
            label: "Src Twin Class Inheritable",
            groupField: "srcTwinClassInheritable",
            getValue: (g) => String(g.srcTwinClassInheritable),
            getText: (g) =>
              g.srcTwinClassInheritable ? "Inheritable" : "Not inheritable",
            renderLabel: (g) => (
              <Badge variant="outline">
                {g.srcTwinClassInheritable ? "Inheritable" : "Not inheritable"}
              </Badge>
            ),
            narrow: narrowBy.ternary<LinkFilters>("srcTwinClassInheritable"),
          },
          {
            key: "dstTwinClassInheritable",
            label: "Dst Twin Class Inheritable",
            groupField: "dstTwinClassInheritable",
            getValue: (g) => String(g.dstTwinClassInheritable),
            getText: (g) =>
              g.dstTwinClassInheritable ? "Inheritable" : "Not inheritable",
            renderLabel: (g) => (
              <Badge variant="outline">
                {g.dstTwinClassInheritable ? "Inheritable" : "Not inheritable"}
              </Badge>
            ),
            narrow: narrowBy.ternary<LinkFilters>("dstTwinClassInheritable"),
          },
        ],
        resolveFilters: ({ filters }) =>
          resolveFilters(filters as Record<LinkFilterKeys, unknown>),
        count: ({ filters, groupField, offset, limit }) =>
          countLinks({
            filters,
            groupField: groupField as LinkCountGroupField,
            offset,
            limit,
          }),
        fetchRows: ({ filters, pagination, sort }) =>
          searchLinks({ pagination, filters, sort }),
      }),
    [resolveFilters, countLinks, searchLinks]
  );

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof LINK_SCHEMA>
  ) => {
    const { name, ...rest } = formValues;
    const nameI18n = name ? { translations: { en: name } } : undefined;
    const body: CreateLinkRequestBody = {
      ...rest,
      forwardNameI18n: nameI18n,
      backwardNameI18n: nameI18n,
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
      getRowHref={(row) => `/${PlatformArea.core}/links/${row.id}`}
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
      chartGroupings={chartGroupings}
      grouping={grouping}
      dialogForm={linkForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <CreateLinkFormFields control={linkForm.control} />
      )}
    />
  );
}
