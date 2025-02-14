"use client";

import {
  CreateLinkRequestBody,
  Link,
  LINK_SCHEMA,
  LinkStrengthEnum,
  LinkTypesEnum,
  useLinkFilters,
  useLinkSearch,
} from "@/entities/link";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { UserResourceLink } from "@/entities/user";
import { formatToTwinfaceDate } from "@/shared/libs";
import { Badge, GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CreateLinkFormFields } from "./form-fields";
import { useContext, useEffect } from "react";
import { ApiContext } from "@/shared/api";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useRouter } from "next/navigation";

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
    header: "Name",
  },
  backwardName: {
    id: "backwardName",
    accessorKey: "backwardName",
    header: "Backward name",
  },
  srcTwinClass: {
    id: "srcTwinClass",
    accessorKey: "srcTwinClass",
    header: "Source Twin Class",
    cell: ({ row: { original } }) =>
      original.srcTwinClass && (
        <div className="max-w-48 inline-flex">
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
    header: "Destination Twin Class",
    cell: ({ row: { original } }) =>
      original.dstTwinClass && (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.dstTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  type: {
    accessorKey: "type",
    header: "Type",
    cell: ({ row: { original } }) => (
      <Badge variant="outline">{original.type}</Badge>
    ),
  },
  linkStrengthId: {
    accessorKey: "linkStrengthId",
    header: "Link strength",
    cell: ({ row: { original } }) => (
      <Badge variant="outline">{original.linkStrengthId}</Badge>
    ),
  },
  createdByUser: {
    id: "createdByUser",
    accessorKey: "createdByUser",
    header: "Created by User",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function LinksScreen() {
  const api = useContext(ApiContext);
  const router = useRouter();
  const { searchLinks } = useLinkSearch();
  const { buildFilterFields, mapFiltersToPayload } = useLinkFilters();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Links", href: "/workspace/links" }]);
  }, [setBreadcrumbs]);

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

  async function fetchLink(pagination: PaginationState, filters: FiltersState) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return searchLinks({ pagination, filters: _filters });
    } catch (error) {
      toast.error("An error occured while fetching links: " + error);
      throw new Error("An error occured while fetching links: " + error);
    }
  }

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

    const { error } = await api.link.create({ body });

    if (error) throw error;
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
      onRowClick={(row) => router.push(`/workspace/links/${row.id}`)}
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
      dialogForm={linkForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <CreateLinkFormFields control={linkForm.control} enableAllTwinClasses />
      )}
    />
  );
}
