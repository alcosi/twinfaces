import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { Badge } from "@/components/base/badge";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { LoadingOverlay } from "@/components/base/loading";
import { TwinClassResourceLink } from "@/entities/twinClass";
import {
  CreateLinkRequestBody,
  LinkStrengthEnum,
  LinkTypesEnum,
  UpdateLinkRequestBody,
} from "@/entities/twinClassLink";
import { ApiContext } from "@/lib/api/api";
import { TwinClass, TwinClassLink } from "@/lib/api/api-types";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TwinClassLinkFormFields } from "./form-fields";
import { ShortGuidWithCopy } from "@/components/base/short-guid";

const twinLinkSchema = z.object({
  srcTwinClassId: z.string().uuid("Twin Class ID must be a valid UUID"),
  dstTwinClassId: z.string().uuid("Twin Class ID must be a valid UUID"),
  name: z.string().min(1, "Name must not be empty"),
  type: z.enum(
    [LinkTypesEnum.ManyToMany, LinkTypesEnum.ManyToOne, LinkTypesEnum.OneToOne],
    { message: "Invalid type" }
  ),
  linkStrength: z.enum(
    [
      LinkStrengthEnum.MANDATORY,
      LinkStrengthEnum.OPTIONAL,
      LinkStrengthEnum.OPTIONAL_BUT_DELETE_CASCADE,
    ],
    { message: "Invalid link strength" }
  ),
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

export function TwinClassLinks() {
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const tableRefForward = useRef<DataTableHandle>(null);
  const tableRefBackward = useRef<DataTableHandle>(null);

  const columnsMap: Record<
    Exclude<keyof TwinClassLink, "dstTwinClass">,
    ColumnDef<TwinClassLink>
  > = {
    id: {
      accessorKey: "id",
      header: "Id",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    dstTwinClassId: {
      accessorKey: "dstTwinClassId",
      header: "Destination Twin Class",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    name: {
      accessorKey: "name",
      header: "Name",
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

  async function fetchLinks(type: "forward" | "backward", _: PaginationState) {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pageCount: 0 };
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
        return { data: [], pageCount: 0 };
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
        pageCount: 0,
      };
    } catch (e) {
      console.error(`Failed to fetch twin class ${type} links`, e);
      toast.error(`Failed to fetch twin class ${type} links`);
      return { data: [], pageCount: 0 };
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

  const handleOnUpdateSubmit = async (
    linkId: string,
    formValues: z.infer<typeof twinLinkSchema>
  ) => {
    const body: UpdateLinkRequestBody = {
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
    const { error } = await api.twinClassLink.update({ linkId, body });
    if (error) {
      throw error;
    }
    toast.success("Link updated successfully!");
  };

  return (
    <>
      <Experimental_CrudDataTable
        className="mb-10"
        ref={tableRefForward}
        title="Forward Links"
        columns={[
          columnsMap.id,
          columnsMap.dstTwinClassId,
          columnsMap.name,
          columnsMap.type,
          columnsMap.linkStrengthId,
        ]}
        fetcher={(paginationState) => fetchLinks("forward", paginationState)}
        getRowId={(row) => row.id!}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "id",
            "linkStrengthId",
            "name",
            "type",
            "dstTwinClassId",
          ],
        }}
        dialogForm={forwardLinkForm}
        onCreateSubmit={handleOnCreateSubmit}
        onUpdateSubmit={handleOnUpdateSubmit}
        renderFormFields={() => (
          <TwinClassLinkFormFields control={forwardLinkForm.control} />
        )}
      />

      <Experimental_CrudDataTable
        ref={tableRefBackward}
        title="Backward Links"
        columns={[
          columnsMap.id,
          { ...columnsMap.dstTwinClassId, header: "Source Twin Class" },
          columnsMap.name,
          columnsMap.type,
          columnsMap.linkStrengthId,
        ]}
        fetcher={(paginationState) => fetchLinks("backward", paginationState)}
        getRowId={(row) => row.id!}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "id",
            "linkStrengthId",
            "name",
            "type",
            "dstTwinClassId",
          ],
        }}
        dialogForm={backwardLinkForm}
        onCreateSubmit={handleOnCreateSubmit}
        onUpdateSubmit={handleOnUpdateSubmit}
        renderFormFields={() => (
          <TwinClassLinkFormFields
            control={backwardLinkForm.control}
            isForward={false}
          />
        )}
      />
    </>
  );
}
