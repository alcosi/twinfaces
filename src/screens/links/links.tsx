"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  CreateLinkRequestBody,
  LINK_SCHEMA,
  Link,
  LinkStrengthEnum,
  LinkTypesEnum,
  useCreateLink,
  useLinkFilters,
  useLinkSearch,
} from "@/entities/link";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PlatformArea } from "@/shared/config";
import { formatIntlDate } from "@/shared/libs";
import { Badge, GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

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
    header: "Destination Twin Class",
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
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
};

export function LinksScreen() {
  const router = useRouter();
  const { searchLinks } = useLinkSearch();
  const { buildFilterFields, mapFiltersToPayload } = useLinkFilters();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { createLink } = useCreateLink();

  useEffect(() => {
    setBreadcrumbs([{ label: "Links", href: `/${PlatformArea.core}/links` }]);
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
      dialogForm={linkForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <CreateLinkFormFields control={linkForm.control} />
      )}
    />
  );
}
