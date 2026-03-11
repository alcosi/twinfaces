import { useContext, useState } from "react";
import z from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { useUpdateNotification } from "@/entities/recipient/api/hooks/use-update";
import {
  Recipient_DETAILED,
  useHistoryNotificztionRecipientSelectAdapter,
} from "@/entities/recipient/index";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinClassFieldSelectAdapter } from "@/entities/twin-class-field";
import { useValidatorSetSelectAdapter } from "@/entities/validator-set";
import { NotificationChannelEventResourceLink } from "@/features/channel-event/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { NotificationContext } from "@/features/notification";
import { NotificationSchemaResourceLink } from "@/features/notification-schema/ui";
import { RecipientResourceLink } from "@/features/recipient/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { ValidatorSetResourceLink } from "@/features/validator-set/ui";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

import { TwinClassField_DETAILED } from "../../../entities/twin-class-field/api/types";
import { TwinClass_DETAILED } from "../../../entities/twin-class/api/types";
import { ValidatorSet_DETAILED } from "../../../entities/validator-set/api/types";

export function NotificationGeneral() {
  const { notification, refresh } = useContext(NotificationContext);
  const { updateNotification } = useUpdateNotification();

  const twinClassAdapter = useTwinClassSelectAdapter();
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapter();
  const validatorSetAdapter = useValidatorSetSelectAdapter();
  const notificationRecipientAdapter =
    useHistoryNotificztionRecipientSelectAdapter();

  const [editFieldDialogOpen, setEditFieldDialogOpen] =
    useState<boolean>(false);
  const [currentAutoEditDialogSettings] = useState<
    AutoEditDialogSettings | undefined
  >(undefined);

  const twinClassSettings: InPlaceEditProps<typeof notification.twinClassId> = {
    id: "twinClassId",
    value: notification.twinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class...",
      ...twinClassAdapter,
    },
    renderPreview: notification.twinClass
      ? () => (
          <TwinClassResourceLink
            data={notification.twinClass as TwinClass_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateNotification({
        body: {
          historyNotifications: [
            {
              twinClassId: id,
              id: notification.id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const twinClassFieldSettings: InPlaceEditProps<
    typeof notification.twinClassFieldId
  > = {
    id: "twinClassFieldId",
    value: notification.twinClassFieldId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class field...",
      ...twinClassFieldAdapter,
    },
    renderPreview: notification.twinClassField
      ? () => (
          <TwinClassFieldResourceLink
            data={notification.twinClassField as TwinClassField_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateNotification({
        body: {
          historyNotifications: [
            {
              id: notification.id,
              twinClassFieldId: id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const historyNotificationRecipientSettings: InPlaceEditProps<
    typeof notification.historyNotificationRecipientId
  > = {
    id: "historyNotificationRecipientId",
    value: notification.historyNotificationRecipientId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select notification recipient...",
      ...notificationRecipientAdapter,
    },
    renderPreview: notification.historyNotificationRecipient
      ? () => (
          <RecipientResourceLink
            data={
              notification.historyNotificationRecipient as Recipient_DETAILED
            }
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateNotification({
        body: {
          historyNotifications: [
            {
              id: notification.id,
              historyNotificationRecipientId: id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const twinValidatorSetSettings: InPlaceEditProps<
    typeof notification.twinValidatorSetId
  > = {
    id: "twinValidatorSetId",
    value: notification.twinValidatorSetId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin validator set...",
      ...validatorSetAdapter,
    },
    renderPreview: notification.twinValidatorSet
      ? () => (
          <ValidatorSetResourceLink
            data={notification.twinValidatorSet as ValidatorSet_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateNotification({
        body: {
          historyNotifications: [
            {
              id: notification.id,
              twinValidatorSetId: id,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const twinValidatorSetInvertSettings: InPlaceEditProps<
    typeof notification.twinValidatorSetInvert
  > = {
    id: "twinValidatorSetInvert",
    value: notification.twinValidatorSetInvert,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateNotification({
        body: {
          historyNotifications: [
            {
              id: notification.id,
              twinValidatorSetInvert: value as boolean,
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
              <GuidWithCopy value={notification.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin class</TableCell>
            <TableCell>
              <InPlaceEdit {...twinClassSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin class field</TableCell>
            <TableCell>
              <InPlaceEdit {...twinClassFieldSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>History type</TableCell>
            <TableCell>
              {notification.historyTypeId && (
                <GuidWithCopy value={notification.historyTypeId} />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Notification schema</TableCell>
            <TableCell>
              {notification.notificationSchema && (
                <div className="inline-flex max-w-48">
                  <NotificationSchemaResourceLink
                    data={notification.notificationSchema}
                    withTooltip
                  />
                </div>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>History notification recipient</TableCell>
            <TableCell>
              <InPlaceEdit {...historyNotificationRecipientSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Notification channel event</TableCell>
            <TableCell>
              {notification.notificationChannelEvent && (
                <div className="inline-flex max-w-48">
                  <NotificationChannelEventResourceLink
                    data={notification.notificationChannelEvent}
                    withTooltip
                  />
                </div>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin validator set</TableCell>
            <TableCell>
              <InPlaceEdit {...twinValidatorSetSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Twin validator set invert</TableCell>
            <TableCell>
              <InPlaceEdit {...twinValidatorSetInvertSettings} />
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
