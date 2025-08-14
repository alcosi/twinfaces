"use client";

import React, { useContext, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import {
  DomainUpdateRq,
  useDomainUpdate,
  useLocalListSelectAdapter,
} from "@/entities/domain";
import {
  FeaturerTypes,
  Featurer_DETAILED,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import { useTierSelectAdapter } from "@/entities/tier";
import { TwinClassSchema_DETAILED } from "@/entities/twin-class-schema";
import { DomainContext } from "@/features/domain";
import { FaceNavBarResourceLink } from "@/features/face/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { TierResourceLink } from "@/features/tier/ui";
import { TwinClassSchemaResourceLink } from "@/features/twin-class-schema/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { Avatar, Table, TableBody, TableCell, TableRow } from "@/shared/ui";

export function DomainGeneral() {
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const { domain, refresh } = useContext(DomainContext);
  const { updateDomain } = useDomainUpdate();

  const localListAdapter = useLocalListSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(21);
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapter();
  const tierAdapter = useTierSelectAdapter();

  async function update(newDomain: DomainUpdateRq) {
    try {
      await updateDomain({
        body: newDomain,
      });
      toast.success("Domain was updated successfully!");
      refresh?.();
    } catch (e) {
      toast.error("Failed to update Domain");
    }
  }

  const nameSettings: InPlaceEditProps<typeof domain.name> = {
    id: "name",
    value: domain.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      return update({
        domain: {
          name: value,
        },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof domain.description> = {
    id: "description",
    value: domain.description,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      return update({
        domain: {
          description: value,
        },
      });
    },
  };

  const defaultLocaleSettings: InPlaceEditProps<typeof domain.defaultLocale> = {
    id: "defaultLocale",
    value: domain.defaultLocale,
    valueInfo: {
      type: AutoFormValueType.combobox,
      ...localListAdapter,
    },
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ domain: { defaultLocale: id } });
    },
  };

  const businessAccountInitiatorFeaturerSettings: AutoEditDialogSettings = {
    value: {
      businessAccountInitiatorFeaturerId:
        domain.businessAccountInitiatorFeaturerId,
    },
    title: "Update business account initiator",
    onSubmit: (values) => {
      return update({
        domain: {
          businessAccountInitiatorFeaturerId:
            values.businessAccountInitiatorFeaturerId,
          businessAccountInitiatorParams: values.businessAccountInitiatorParams,
        },
      });
    },
    valuesInfo: {
      businessAccountInitiatorFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "business account",
        typeId: FeaturerTypes.businessAccountInitiator,
        paramsFieldName: "businessAccountInitiatorParams",
        ...featurerAdapter,
      },
    },
  };

  const userGroupManagerFeaturerSettings: AutoEditDialogSettings = {
    value: {
      userGroupManagerFeaturerId: domain.userGroupManagerFeaturerId,
    },
    title: "Update user group manager",
    onSubmit: (values) => {
      return update({
        domain: {
          userGroupManagerFeaturerId: values.userGroupManagerFeaturerId,
          userGroupManagerParams: values.userGroupManagerParams,
        },
      });
    },
    valuesInfo: {
      userGroupManagerFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "User group manager",
        typeId: FeaturerTypes.userGroupManager,
        paramsFieldName: "userGroupManagerParams",
        ...featurerAdapter,
      },
    },
  };

  const permissionSchemaSettings: InPlaceEditProps<
    typeof domain.permissionSchemaId
  > = {
    id: "permissionSchemaId",
    value: domain.permissionSchemaId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission schema...",
      ...permissionSchemaAdapter,
    },
    renderPreview: domain.permissionSchema
      ? (_) => (
          <PermissionSchemaResourceLink
            data={domain.permissionSchema}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ domain: { permissionSchemaId: id } });
    },
  };

  const defaultTierSettings: InPlaceEditProps<typeof domain.defaultTierId> = {
    id: "defaultTierId",
    value: domain.defaultTierId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select tier...",
      ...tierAdapter,
    },
    renderPreview: domain.tier
      ? (_) => <TierResourceLink data={domain.tier} withTooltip />
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({ domain: { defaultTierId: id } });
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>Key</TableCell>
            <TableCell>{domain.key}</TableCell>
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

          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>{domain.type}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Default locale</TableCell>
            <TableCell>
              <InPlaceEdit {...defaultLocaleSettings} />
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() =>
              openWithSettings(businessAccountInitiatorFeaturerSettings)
            }
          >
            <TableCell>Business account initiator</TableCell>
            <TableCell>
              {domain.businessAccountInitiatorFeaturer && (
                <FeaturerResourceLink
                  data={
                    domain.businessAccountInitiatorFeaturer as Featurer_DETAILED
                  }
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(userGroupManagerFeaturerSettings)}
          >
            <TableCell>User group manager</TableCell>
            <TableCell>
              {domain.userGroupManagerFeaturer && (
                <FeaturerResourceLink
                  data={domain.userGroupManagerFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Permission schema</TableCell>
            <TableCell>
              <InPlaceEdit {...permissionSchemaSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin class schema</TableCell>
            <TableCell>
              {domain.twinClassSchemaId && (
                <TwinClassSchemaResourceLink
                  data={domain.twinClassSchema as TwinClassSchema_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Business account template twin</TableCell>
            <TableCell>
              {domain.twin && (
                <TwinResourceLink data={domain.twin} withTooltip />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Default tier</TableCell>
            <TableCell>
              <InPlaceEdit {...defaultTierSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Domain user template twin</TableCell>
            <TableCell>
              {domain.domainUserTemplateTwin && (
                <TwinResourceLink
                  data={domain.domainUserTemplateTwin}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow className="hover:bg-muted/50 cursor-pointer transition-colors">
            <TableCell>Icon dark</TableCell>
            <TableCell>
              {domain.iconDark && <Avatar url={domain.iconDark} size="xlg" />}
            </TableCell>
          </TableRow>

          <TableRow className="hover:bg-muted/50 cursor-pointer transition-colors">
            <TableCell>Icon light</TableCell>
            <TableCell>
              {domain.iconLight && <Avatar url={domain.iconLight} size="xlg" />}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Navbar face</TableCell>
            <TableCell>
              {domain.navbarFace && (
                <FaceNavBarResourceLink data={domain.navbarFace} withTooltip />
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
    </InPlaceEditContextProvider>
  );
}
