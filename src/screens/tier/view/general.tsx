import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema/libs";
import { useUpdateTier } from "@/entities/tier";
import { TwinClassSchema_DETAILED } from "@/entities/twin-class-schema/api";
import { useTwinClassSchemaSelectAdapter } from "@/entities/twin-class-schema/libs";
import { TwinFlowSchema_DETAILED } from "@/entities/twinFlowSchema";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema/libs";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { TierContext } from "@/features/tier";
import { TwinClassSchemaResourceLink } from "@/features/twin-class-schema/ui";
import { TwinFlowSchemaResourceLink } from "@/features/twin-flow-schema/ui";
import { formatIntlDate } from "@/shared/libs";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function TierGeneral() {
  const { tierId, tier, refresh } = useContext(TierContext);
  const { updateTier } = useUpdateTier();

  const permissionSchemaAdapter = usePermissionSchemaSelectAdapter();
  const twinflowSchemaAdapter = useTwinFlowSchemaSelectAdapter();
  const twinClassSchemaAdapter = useTwinClassSchemaSelectAdapter();

  const nameSettings: InPlaceEditProps<typeof tier.name> = {
    id: "name",
    value: tier.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "Name",
    },
    onSubmit: async (value) => {
      return updateTier({
        tierId,
        body: { tier: { name: value as string } },
      }).then(refresh);
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof tier.description> = {
    id: "description",
    value: tier.description,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "Description",
    },
    onSubmit: async (value) => {
      return updateTier({
        tierId,
        body: { tier: { description: value as string } },
      }).then(refresh);
    },
  };

  const customSettings: InPlaceEditProps<typeof tier.custom> = {
    id: "custom",
    value: tier.custom,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "Custom",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateTier({
        tierId,
        body: { tier: { custom: value as boolean } },
      }).then(refresh);
    },
  };

  const permissionSchemaSettings: InPlaceEditProps<
    typeof tier.permissionSchemaId
  > = {
    id: "permissionSchemaId",
    value: tier.permissionSchemaId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission schema...",
      ...permissionSchemaAdapter,
    },
    renderPreview: tier.permissionSchema
      ? () => (
          <PermissionSchemaResourceLink
            data={tier.permissionSchema}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateTier({
        tierId,
        body: { tier: { permissionSchemaId: id } },
      }).then(refresh);
    },
  };

  const twinflowSchemaSettings: InPlaceEditProps<typeof tier.twinflowSchemaId> =
    {
      id: "twinflowSchemaId",
      value: tier.twinflowSchemaId,
      valueInfo: {
        type: AutoFormValueType.combobox,
        selectPlaceholder: "Select twinflow schema...",
        ...twinflowSchemaAdapter,
      },
      renderPreview: tier.twinflowSchema
        ? () => (
            <TwinFlowSchemaResourceLink
              data={tier.twinflowSchema as TwinFlowSchema_DETAILED}
              withTooltip
            />
          )
        : undefined,
      onSubmit: async (value) => {
        const id = (value as unknown as Array<{ id: string }>)[0]?.id;
        return updateTier({
          tierId,
          body: { tier: { twinflowSchemaId: id } },
        }).then(refresh);
      },
    };

  const twinClassSchemaSettings: InPlaceEditProps<
    typeof tier.twinClassSchemaId
  > = {
    id: "twinClassSchemaId",
    value: tier.twinClassSchemaId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class schema...",
      ...twinClassSchemaAdapter,
    },
    renderPreview: tier.twinClassSchema
      ? () => (
          <TwinClassSchemaResourceLink
            data={tier.twinClassSchema as TwinClassSchema_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateTier({
        tierId,
        body: { tier: { twinClassSchemaId: id } },
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
              <GuidWithCopy value={tier.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceEdit {...nameSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Permission schema</TableCell>
            <TableCell>
              <InPlaceEdit {...permissionSchemaSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twinflow schema</TableCell>
            <TableCell>
              <InPlaceEdit {...twinflowSchemaSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin class schema</TableCell>
            <TableCell>
              <InPlaceEdit {...twinClassSchemaSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Attachments storage quota count</TableCell>
            <TableCell>{tier.attachmentsStorageQuotaCount}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Attachments storage quota size</TableCell>
            <TableCell>{tier.attachmentsStorageQuotaSize}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>User count quota</TableCell>
            <TableCell>{tier.userCountQuota}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Custom</TableCell>
            <TableCell>
              <InPlaceEdit {...customSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>
              {tier.createdAt &&
                formatIntlDate(tier.createdAt, "datetime-local")}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Updated at</TableCell>
            <TableCell>
              {tier.updatedAt &&
                formatIntlDate(tier.updatedAt, "datetime-local")}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
