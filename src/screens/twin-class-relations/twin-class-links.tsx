import { TwinClassLinkResourceLink } from "@/entities/twin-class-link";
import {
  TwinClass_DETAILED,
  TwinClassContext,
  TwinClassResourceLink,
} from "@/entities/twin-class";
import { ApiContext, PagedResponse } from "@/shared/api";
import { Badge } from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";
import { LoadingOverlay } from "@/shared/ui/loading";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  CreateLinkRequestBody,
  Link,
  LINK_SCHEMA,
  LinkStrengthEnum,
  LinkTypesEnum,
  UpdateLinkRequestBody,
  useCreateLink,
} from "@/entities/link";
import { CreateLinkFormFields } from "../links";

const mapLinkToFormPayload = (
  link: Link,
  options: {
    twinClassId: string;
    isBackward?: boolean;
  }
): CreateLinkRequestBody | UpdateLinkRequestBody => {
  return {
    ...link,
    linkStrength: link.linkStrengthId,
    srcTwinClassId: options.isBackward
      ? link.dstTwinClassId
      : options.twinClassId,
    dstTwinClassId: options.isBackward
      ? options.twinClassId
      : link.dstTwinClassId,
  };
};

export function TwinClassRelations() {
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const router = useRouter();
  const tableRefForward = useRef<DataTableHandle>(null);
  const tableRefBackward = useRef<DataTableHandle>(null);
  const { createLink } = useCreateLink();

  const columnsMap: Record<
    "id" | "name" | "dstTwinClassId" | "type" | "linkStrengthId",
    ColumnDef<Link>
  > = {
    id: {
      accessorKey: "id",
      header: "Id",
      cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
    },
    name: {
      accessorKey: "name",
      header: "Name",
      cell: ({ row: { original } }) => (
        <div className="max-w-48 inline-flex">
          <TwinClassLinkResourceLink data={original} withTooltip />
        </div>
      ),
    },
    dstTwinClassId: {
      accessorKey: "dstTwinClassId",
      header: "Destination Twin Class",
      cell: ({ row: { original } }) => (
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
      header: "Link Strength",
      cell: ({ row: { original } }) => (
        <Badge variant="outline">{original.linkStrengthId}</Badge>
      ),
    },
  };

  const forwardLinkForm = useForm<z.infer<typeof LINK_SCHEMA>>({
    resolver: zodResolver(LINK_SCHEMA),
    defaultValues: {
      srcTwinClassId: twinClass?.id,
      dstTwinClassId: "",
      name: "",
      type: LinkTypesEnum.OneToOne,
      linkStrength: LinkStrengthEnum.MANDATORY,
    },
  });

  const backwardLinkForm = useForm<z.infer<typeof LINK_SCHEMA>>({
    resolver: zodResolver(LINK_SCHEMA),
    defaultValues: {
      srcTwinClassId: "",
      dstTwinClassId: twinClass?.id,
      name: "",
      type: LinkTypesEnum.OneToOne,
      linkStrength: LinkStrengthEnum.MANDATORY,
    },
  });

  async function fetchLinks(
    type: "forward" | "backward",
    _: PaginationState
  ): Promise<PagedResponse<Link>> {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const response = await api.twinClassLink.getLinks({
        twinClassId: twinClass.id,
      });
      const data = response.data;

      if (!data || data.status != 0) {
        console.error("failed to fetch twin class links", data);
        let message = "Failed to load twin class links";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pagination: {} };
      }

      return {
        data:
          type === "forward"
            ? Object.values(data.forwardLinkMap || {}).map((link) =>
                mapLinkToFormPayload(link, { twinClassId: twinClass.id! })
              )
            : Object.values(data.backwardLinkMap || {}).map((link) =>
                mapLinkToFormPayload(link, {
                  twinClassId: twinClass.id!,
                  isBackward: true,
                })
              ),
        pagination: {},
      };
    } catch (e) {
      console.error(`Failed to fetch twin class ${type} links`, e);
      toast.error(`Failed to fetch twin class ${type} links`);
      return { data: [], pagination: {} };
    }
  }

  if (!twinClass) {
    return <LoadingOverlay />;
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof LINK_SCHEMA>
  ) => {
    await createLink(formValues);
    toast.success("Link created successfully!");
  };

  return (
    <>
      <CrudDataTable
        className="mb-10"
        ref={tableRefForward}
        title="Forward"
        columns={[
          columnsMap.id,
          columnsMap.name,
          columnsMap.dstTwinClassId,
          columnsMap.type,
          columnsMap.linkStrengthId,
        ]}
        fetcher={(paginationState) => fetchLinks("forward", paginationState)}
        onRowClick={(row) => router.push(`/workspace/links/${row.id}`)}
        getRowId={(row) => row.id!}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        defaultVisibleColumns={[
          columnsMap.id,
          columnsMap.name,
          columnsMap.dstTwinClassId,
          columnsMap.type,
          columnsMap.linkStrengthId,
        ]}
        dialogForm={forwardLinkForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <CreateLinkFormFields control={forwardLinkForm.control} isForward />
        )}
      />

      <CrudDataTable
        ref={tableRefBackward}
        title="Backward"
        columns={[
          columnsMap.id,
          columnsMap.name,
          { ...columnsMap.dstTwinClassId, header: "Source Twin Class" },
          columnsMap.type,
          columnsMap.linkStrengthId,
        ]}
        fetcher={(paginationState) => fetchLinks("backward", paginationState)}
        onRowClick={(row) => router.push(`/workspace/links/${row.id}`)}
        getRowId={(row) => row.id!}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        defaultVisibleColumns={[
          columnsMap.id,
          columnsMap.name,
          columnsMap.dstTwinClassId,
          columnsMap.type,
          columnsMap.linkStrengthId,
        ]}
        dialogForm={backwardLinkForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <CreateLinkFormFields control={backwardLinkForm.control} />
        )}
      />
    </>
  );
}
