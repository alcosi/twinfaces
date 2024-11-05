import { TwinUpdateRq } from "@/entities/twin";
import { Table, TableBody, TableCell, TableRow } from "@/components/base/table";
import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { useContext, useState } from "react";
import { AutoFormValueType } from "@/components/auto-field";
import { ApiContext } from "@/shared/api";
import { z } from "zod";
import { TwinContext } from "@/app/twin/[twinId]/twin-context";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { User, UserResourceLink } from "@/entities/user";

export function TwinGeneral() {
  const api = useContext(ApiContext);
  const { twin, fetchTwinData } = useContext(TwinContext);

  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

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

  const classValues: { [key: string]: AutoEditDialogSettings } = {
    name: {
      value: { name: twin.name },
      title: "Update name",
      schema: z.object({ name: z.string().min(3) }),
      onSubmit: (values) => {
        return updateTwin({ name: values.name });
      },
      valuesInfo: {
        name: {
          type: AutoFormValueType.string,
          label: "Name",
        },
      },
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <>
      <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        General
      </h2>

      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <ShortGuidWithCopy value={twin.id} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{twin.createdAt}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Author User</TableCell>
            <TableCell>
              <UserResourceLink data={twin.authorUser as User} />
            </TableCell>
          </TableRow>
          <TableRow
            className={"cursor-pointer"}
            onClick={() => openWithSettings(classValues.name!)}
          >
            <TableCell>Name</TableCell>
            <TableCell>{twin.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Assigner User</TableCell>
            <TableCell>
              <UserResourceLink data={twin.assignerUser as User} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Twin Class ID</TableCell>
            <TableCell>
              {twin.twinClass && (
                <TwinClassResourceLink
                  data={twin.twinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <AutoDialog
        open={editFieldDialogOpen}
        onOpenChange={setEditFieldDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </>
  );
}
