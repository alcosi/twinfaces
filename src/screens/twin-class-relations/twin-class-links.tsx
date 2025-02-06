import {
  TwinClass_DETAILED,
  TwinClassContext,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import {
  CreateLinkRequestBody,
  LINK_STRENGTH_SCHEMA,
  LINK_TYPES_SCHEMA,
  LinkStrength,
  LinkStrengthEnum,
  LinkTypes,
  LinkTypesEnum,
  TwinClassLink,
  UpdateLinkRequestBody,
  TwinClassLinkResourceLink,
} from "@/entities/twin-class-link";
import { ApiContext, PagedResponse } from "@/shared/api";
import { FIRST_ID_EXTRACTOR, isPopulatedArray } from "@/shared/libs";
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
import { TwinClassRelationsFormFields } from "./form-fields";

const twinLinkSchema = z.object({
  srcTwinClassId: z
    .string()
    .uuid("Twin Class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  dstTwinClassId: z
    .string()
    .uuid("Twin Class ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
  name: z.string().min(1, "Name can not be empty"),
  type: z
    .array(z.object({ id: LINK_TYPES_SCHEMA }))
    .min(1, "Required")
    .transform<LinkTypes>((arr) =>
      isPopulatedArray<{ id: string }>(arr)
        ? (arr[0].id as LinkTypes)
        : LinkTypesEnum.OneToOne
    )
    .or(LINK_TYPES_SCHEMA),
  linkStrength: z
    .array(z.object({ id: LINK_STRENGTH_SCHEMA }))
    .min(1, "Required")
    .transform<LinkStrength>((arr) =>
      isPopulatedArray<{ id: string }>(arr)
        ? (arr[0].id as LinkStrength)
        : LinkStrengthEnum.MANDATORY
    )
    .or(LINK_STRENGTH_SCHEMA),
});

const mapLinkToFormPayload = (
  link: TwinClassLink,
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
  const { twinClass, twinClassId } = useContext(TwinClassContext);
  const router = useRouter();
  const tableRefForward = useRef<DataTableHandle>(null);
  const tableRefBackward = useRef<DataTableHandle>(null);

  const columnsMap: Record<
    "id" | "name" | "dstTwinClassId" | "type" | "linkStrengthId",
    ColumnDef<TwinClassLink>
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

  const forwardLinkForm = useForm<z.infer<typeof twinLinkSchema>>({
    resolver: zodResolver(twinLinkSchema),
    defaultValues: {
      srcTwinClassId: twinClass?.id,
      dstTwinClassId: "",
      name: "",
      type: LinkTypesEnum.OneToOne,
      linkStrength: LinkStrengthEnum.MANDATORY,
    },
  });

  const backwardLinkForm = useForm<z.infer<typeof twinLinkSchema>>({
    resolver: zodResolver(twinLinkSchema),
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
  ): Promise<PagedResponse<TwinClassLink>> {
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
    formValues: z.infer<typeof twinLinkSchema>
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

    const { error } = await api.twinClassLink.create({ body });
    if (error) {
      throw error;
    }
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
        onRowClick={(row) =>
          router.push(`/workspace/twinclass/${twinClassId}/link/${row.id}`)
        }
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
          <TwinClassRelationsFormFields
            control={forwardLinkForm.control}
            isForward
          />
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
        onRowClick={(row) =>
          router.push(`/workspace/twinclass/${twinClassId}/link/${row.id}`)
        }
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
          <TwinClassRelationsFormFields control={backwardLinkForm.control} />
        )}
      />
    </>
  );
}
