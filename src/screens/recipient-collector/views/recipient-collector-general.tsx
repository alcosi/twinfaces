import { useContext, useState } from "react";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { FeaturerTypes, useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  Recipient_DETAILED,
  useRecipientCollectorUpdate,
  useRecipientSelectAdapter,
} from "@/entities/notification";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { RecipientCollectorContext } from "@/features/recipient-collectors";
import { RecipientResourceLink } from "@/features/recipient/ui";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function RecipientCollectorGeneral() {
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const { recipientCollector, refresh } = useContext(RecipientCollectorContext);
  const { updateRecipientCollector } = useRecipientCollectorUpdate();

  const notificationRecipientAdapter = useRecipientSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(47);

  const notificationRecipientSettings: InPlaceEditProps<
    typeof recipientCollector.recipientId
  > = {
    id: "recipientId",
    value: recipientCollector.recipientId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select notification recipient...",
      ...notificationRecipientAdapter,
    },
    renderPreview: recipientCollector.historyNotificationRecipient
      ? () => (
          <RecipientResourceLink
            data={
              recipientCollector.historyNotificationRecipient as Recipient_DETAILED
            }
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateRecipientCollector({
        body: {
          historyNotificationRecipients: [
            {
              id: recipientCollector.id,
              recipientId: id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const recipientResolverFeaturerAutoDialogSettings: AutoEditDialogSettings = {
    value: {
      fieldRecipientResolverFeaturerId:
        recipientCollector.recipientResolverFeaturer
          ? [recipientCollector.recipientResolverFeaturer]
          : undefined,
      fieldRecipientResolverFeaturerParams:
        recipientCollector.recipientResolverParams ?? {},
    },
    title: "Update recipient resolver featurer",
    valuesInfo: {
      fieldRecipientResolverFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Field recipient resolver featurer",
        typeId: FeaturerTypes.recipientResolver,
        paramsFieldName: "fieldRecipientResolverFeaturerParams",
        ...featurerAdapter,
      },
    },
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateRecipientCollector({
        body: {
          historyNotificationRecipients: [
            {
              id: recipientCollector.id,
              recipientResolverFeaturerId: Number(id),
            },
          ],
        },
      }).then(refresh);
    },
  };

  const excludeSettings: InPlaceEditProps<typeof recipientCollector.exclude> = {
    id: "exclude",
    value: recipientCollector.exclude,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateRecipientCollector({
        body: {
          historyNotificationRecipients: [
            {
              id: recipientCollector.id,
              exclude: value,
            },
          ],
        },
      }).then(refresh);
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
              <GuidWithCopy value={recipientCollector.id} variant="long" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Notification recipient</TableCell>
            <TableCell>
              <InPlaceEdit {...notificationRecipientSettings} />
            </TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointer"
            onClick={() =>
              openWithSettings(recipientResolverFeaturerAutoDialogSettings)
            }
          >
            <TableCell>Recipient resolver featurer</TableCell>
            <TableCell>
              {recipientCollector.recipientResolverFeaturer && (
                <FeaturerResourceLink
                  data={recipientCollector.recipientResolverFeaturer}
                  params={recipientCollector.recipientResolverParams}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Exclude</TableCell>
            <TableCell>
              <InPlaceEdit {...excludeSettings} />
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
