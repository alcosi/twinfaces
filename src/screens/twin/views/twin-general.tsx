import { useContext, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { DatalistOptionResourceLink } from "@/entities/datalist-option";
import {
  FieldDescriptorText,
  TwinResourceLink,
  categorizeTwinTags,
} from "@/entities/twin";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
  useTagsByTwinClassIdSelectAdapter,
} from "@/entities/twin-class";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { TwinUpdateRq } from "@/entities/twin/server";
import { UserResourceLink, useUserSelectAdapter } from "@/entities/user";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinContext } from "@/features/twin";
import { TransitionPerformer } from "@/features/twin-flow-transition";
import { TwinFieldEditor } from "@/features/twin/ui";
import { PrivateApiContext } from "@/shared/api";
import {
  formatToTwinfaceDate,
  isPopulatedArray,
  isUndefined,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function TwinGeneral() {
  const api = useContext(PrivateApiContext);
  const { twin, refresh } = useContext(TwinContext);
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const uAdapter = useUserSelectAdapter();
  const tagAdapter = useTagsByTwinClassIdSelectAdapter(twin?.twinClassId);

  async function updateTwin(body: TwinUpdateRq) {
    if (isUndefined(twin)) {
      console.error("updateTwin: no twin");
      return;
    }

    try {
      await api.twin.update({ id: twin.id, body });
      refresh();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  if (!twin) {
    console.error("TwinGeneral: no twin");
    return;
  }

  const tagsSettings: AutoEditDialogSettings = {
    value: { tags: twin.tags ?? [] },
    title: "Update Tags",
    valuesInfo: {
      tags: {
        type: AutoFormValueType.combobox,
        label: "Tags",
        selectPlaceholder: "Select tag...",
        creatable: true,
        multi: true,
        ...tagAdapter,
        getItems: (search: string) =>
          tagAdapter.getItems(search, {
            dataListIdList: twin.twinClass.tagsDataListId
              ? [twin.twinClass.tagsDataListId]
              : [],
          }),
      },
    },
    onSubmit: (values) => {
      const tagsUpdate = categorizeTwinTags(values.tags, twin.tags);
      return updateTwin({ tagsUpdate });
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

  const externalIdSettings: InPlaceEditProps<typeof twin.externalId> = {
    id: "externalId",
    value: twin.externalId,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string(),
    onSubmit: async (value) => {
      return updateTwin({ externalId: value });
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  async function handleOnTransitionPerformSuccess() {
    try {
      updateTwin({});
      toast.success("Transition is performed successfully");
    } catch (error) {
      toast.error("Error performing transition");
    }
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
            <TableCell className="flex gap-2">
              {twin.twinClassId && twin.status && (
                <TwinClassStatusResourceLink
                  data={twin.status}
                  twinClassId={twin.twinClassId!}
                  withTooltip
                />
              )}
              {isPopulatedArray(twin.transitions) && (
                <TransitionPerformer
                  twin={twin}
                  onSuccess={handleOnTransitionPerformSuccess}
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow className={"cursor-pointer"}>
            <TableCell>Name</TableCell>
            <TableCell>
              <TwinFieldEditor
                id="twin.name"
                twinId={twin.id}
                twin={twin}
                field={{
                  // TODO: FIX
                  id: "00000000-0000-0000-0011-000000000003",
                  key: "name",
                  value: twin.name,
                  descriptor: FieldDescriptorText,
                }}
                schema={z.string().min(3)}
                onSuccess={refresh}
              />
            </TableCell>
          </TableRow>

          <TableRow className={"cursor-pointer"}>
            <TableCell>Description</TableCell>
            <TableCell>
              <TwinFieldEditor
                id="twin.description"
                twinId={twin.id}
                twin={twin}
                field={{
                  // TODO: FIX
                  id: "00000000-0000-0000-0011-000000000004",
                  key: "description",
                  value: twin.description ?? "",
                  descriptor: FieldDescriptorText,
                }}
                schema={z.string().min(3)}
                onSuccess={refresh}
              />
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
                <div className="inline-flex max-w-48">
                  <TwinResourceLink data={twin.headTwin} withTooltip />
                </div>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Markers</TableCell>
            <TableCell>
              {twin.twinClass?.markersDataListId && twin.markers && (
                <div className="inline-flex max-w-48">
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
            onClick={() => openWithSettings(tagsSettings)}
          >
            <TableCell>Tags</TableCell>
            <TableCell>
              {isPopulatedArray(twin.tags) && (
                <div className="inline-flex max-w-48 flex-wrap gap-2">
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
            <TableCell>External id</TableCell>
            <TableCell>
              <InPlaceEdit {...externalIdSettings} />
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
