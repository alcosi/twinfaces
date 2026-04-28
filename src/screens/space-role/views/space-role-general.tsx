import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import {
  BusinessAccount,
  useBusinessAccountSelectAdapter,
} from "@/entities/business-account";
import { useSpaceRoleUpdate } from "@/entities/space-role";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { SpaceRoleContext } from "@/features/space-role";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function SpaceRoleGeneral() {
  const { spaceRoleId, spaceRole, refresh } = useContext(SpaceRoleContext);
  const { updateSpaceRole } = useSpaceRoleUpdate();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const businessAccountAdapter = useBusinessAccountSelectAdapter();

  const keySettings: InPlaceEditProps<typeof spaceRole.key> = {
    id: "key",
    value: spaceRole.key,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateSpaceRole({
        body: {
          spaceRoles: [{ id: spaceRoleId, key: value as string }],
        },
      }).then(refresh);
    },
  };

  const nameSettings: InPlaceEditProps<typeof spaceRole.name> = {
    id: "name",
    value: spaceRole.name,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateSpaceRole({
        body: {
          spaceRoles: [
            {
              id: spaceRoleId,
              nameI18n: { translationInCurrentLocale: value as string },
            },
          ],
        },
      }).then(refresh);
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof spaceRole.description> = {
    id: "description",
    value: spaceRole.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateSpaceRole({
        body: {
          spaceRoles: [
            {
              id: spaceRoleId,
              descriptionI18n: { translationInCurrentLocale: value as string },
            },
          ],
        },
      }).then(refresh);
    },
  };

  const twinClassSettings: InPlaceEditProps<typeof spaceRole.twinClassId> = {
    id: "twinClassId",
    value: spaceRole.twinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class...",
      ...twinClassAdapter,
    },
    renderPreview: spaceRole.twinClass
      ? () => (
          <TwinClassResourceLink
            data={spaceRole.twinClass as TwinClass_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateSpaceRole({
        body: {
          spaceRoles: [
            {
              twinClassId: id,
              id: spaceRoleId,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const businessAccountSettings: InPlaceEditProps<
    typeof spaceRole.businessAccountId
  > = {
    id: "businessAccountId",
    value: spaceRole.businessAccountId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select business account...",
      ...businessAccountAdapter,
    },
    renderPreview: spaceRole.businessAccount
      ? () => (
          <BusinessAccountResourceLink
            data={spaceRole.businessAccount as BusinessAccount}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateSpaceRole({
        body: {
          spaceRoles: [
            {
              businessAccountId: id,
              id: spaceRoleId,
            },
          ],
        },
      }).then(refresh);
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={spaceRole.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>
              <InPlaceEdit {...keySettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin class</TableCell>
            <TableCell>
              <InPlaceEdit {...twinClassSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Business Account</TableCell>
            <TableCell>
              <InPlaceEdit {...businessAccountSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceEdit {...nameSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
