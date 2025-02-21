import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";
import {
  DatalistOptionResourceLink,
  useDatalistOptionSelectAdapter,
} from "@/entities/datalist-option";
import { TwinResourceLink, TwinUpdateRq } from "@/entities/twin";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twin-class";
import { UserResourceLink, useUserSelectAdapter } from "@/entities/user";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { ApiContext } from "@/shared/api";
import { formatToTwinfaceDate, isPopulatedArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useContext, useState } from "react";
import { z } from "zod";
import { TwinContext } from "../twin-context";

export function TwinGeneral() {
  const api = useContext(ApiContext);
  const { twin, fetchTwinData } = useContext(TwinContext);
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const uAdapter = useUserSelectAdapter();
  const tAdapter = useDatalistOptionSelectAdapter();

  async function updateTwin(newTwin: TwinUpdateRq) {
    if (!twin) {
      console.error("updateTwin: no twin");
      return;
    }

    try {
      await api.twin.update({ id: twin.id!, body: newTwin });
      fetchTwinData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  if (!twin) {
    console.error("TwinGeneral: no twin");
    return;
  }

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: twin.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwin({
        name: value as string,
      });
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: twin.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateTwin({
        description: value as string,
      });
    },
  };

  const initialTagAutoDialogSettings: AutoEditDialogSettings = {
    value: { tags: twin.tags ?? [] },
    title: "Update Tags",
    onSubmit: (values) => {
      const updTags = {
        existingTags: [] as string[],
        newTags: [] as string[],
        deleteTags: [] as string[],
      };
      const newTags = Array.isArray(values.tags) ? values.tags : [];

      newTags.forEach((tag: any) => {
        if (typeof tag === "string") {
          updTags.newTags.push(tag);
        } else if (typeof tag === "object" && tag.id) {
          const existsInTwin =
            twin.tags?.some((item) => item.id === tag.id) ?? false;
          if (!existsInTwin) {
            updTags.existingTags.push(tag.id);
          }
        }
      });
      updTags.deleteTags = (twin.tags ?? [])
        .filter(
          (item) =>
            !newTags.some(
              (tag: string | { id: string }) =>
                typeof tag === "object" && tag.id === item.id
            )
        )
        .map((item) => item.id)
        .filter((id): id is string => id !== undefined);

      return updateTwin({ tagsUpdate: updTags });
    },

    valuesInfo: {
      tags: {
        type: AutoFormValueType.combobox,
        label: "Tags",
        selectPlaceholder: "Select tag...",
        creatable: true,
        multi: true,
        ...tAdapter,
        getItems: (search: string) =>
          twin?.twinClass?.tagsDataListId
            ? tAdapter.getItems(twin.twinClassId, search, {
                dataListIdList: [twin.twinClass.tagsDataListId],
              })
            : Promise.resolve([]),
      },
    },
  };

  const initialAssignerIdAutoDialogSettings: AutoEditDialogSettings = {
    value: { assignerUserId: twin.assignerUserId },
    title: "Update Assignee",
    onSubmit: (values) => {
      return updateTwin({ assignerUserId: values.assignerUserId[0].userId });
    },
    valuesInfo: {
      assignerUserId: {
        type: AutoFormValueType.combobox,
        label: "Assignee",
        selectPlaceholder: "Select assignee...",
        ...uAdapter,
      },
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={twin.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Alias</TableCell>
            <TableCell>{twin.aliases}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              {twin.twinClass && (
                <TwinClassResourceLink
                  data={twin.twinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>
              {twin.twinClassId && twin.status && (
                <TwinClassStatusResourceLink
                  data={twin.status}
                  twinClassId={twin.twinClassId!}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow className={"cursor-pointer"}>
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceEdit {...nameSettings} />
            </TableCell>
          </TableRow>

          <TableRow className={"cursor-pointer"}>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Author</TableCell>
            <TableCell>
              {twin.authorUser && <UserResourceLink data={twin.authorUser} />}
            </TableCell>
          </TableRow>

          <TableRow
            className={"cursor-pointer"}
            onClick={() =>
              openWithSettings(initialAssignerIdAutoDialogSettings)
            }
          >
            <TableCell>Assignee</TableCell>
            <TableCell>
              {twin.assignerUser && (
                <UserResourceLink data={twin.assignerUser} />
              )}
            </TableCell>
          </TableRow>

          <TableRow className={"cursor-pointer"}>
            <TableCell>Head</TableCell>
            <TableCell>
              {twin.headTwin && (
                <div className="max-w-48 inline-flex">
                  <TwinResourceLink data={twin.headTwin} withTooltip />
                </div>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Markers</TableCell>
            <TableCell>
              {twin.twinClass?.markersDataListId && twin.markers && (
                <div className="max-w-48 inline-flex">
                  <DatalistOptionResourceLink
                    data={{
                      ...twin.markers,
                      dataListId: twin.twinClass?.markersDataListId,
                    }}
                    withTooltip
                  />
                </div>
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className={"cursor-pointer"}
            onClick={() => openWithSettings(initialTagAutoDialogSettings)}
          >
            <TableCell>Tags</TableCell>
            <TableCell>
              {isPopulatedArray(twin.tags) && (
                <div className="max-w-48 inline-flex flex-wrap gap-2">
                  {twin.tags.map((tag) => (
                    <DatalistOptionResourceLink key={tag.id} data={tag} />
                  ))}
                </div>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>View Permission</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Permission schema space</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twinflow schema space</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin class schema space</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Alias space</TableCell>
            <TableCell className="text-destructive">
              Not Implemented Yet
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{formatToTwinfaceDate(twin.createdAt!)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AutoDialog
        open={editFieldDialogOpen}
        onOpenChange={setEditFieldDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </InPlaceEditContextProvider>
  );
}
