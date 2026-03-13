"use client";

import { useContext } from "react";
import { toast } from "sonner";

import { AutoFormValueType } from "@/components/auto-field";

import { useRecipientUpdate } from "@/entities/notification";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { RecipientContext } from "@/features/recipient";
import { UserResourceLink } from "@/features/user/ui";
import { formatIntlDate, isPopulatedString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function RecipientGeneral() {
  const { recipient, refresh } = useContext(RecipientContext);
  const { updateRecipient } = useRecipientUpdate();

  async function update(updateData: any) {
    try {
      await updateRecipient({
        body: {
          recipients: [
            {
              id: recipient.id,
              ...updateData,
            },
          ],
        },
      });
      await refresh();
      toast.success("Recipient updated successfully");
    } catch (error) {
      toast.error("Recipient update failed");
      console.error(error);
    }
  }

  const nameSettings: InPlaceEditProps<typeof recipient.name> = {
    id: "name",
    value: recipient.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    onSubmit: (value) => {
      return update({
        nameI18n: {
          translationInCurrentLocale: value,
          translations: {},
        },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof recipient.description> = {
    id: "description",
    value: recipient.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    onSubmit: (value) => {
      return update({
        descriptionI18n: {
          translationInCurrentLocale: value,
          translations: {},
        },
      });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={recipient.id} variant="long" />
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

          <TableRow>
            <TableCell>Author</TableCell>
            <TableCell>
              {recipient.createdByUser && (
                <UserResourceLink data={recipient.createdByUser} withTooltip />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>
              {isPopulatedString(recipient.createdAt)
                ? formatIntlDate(recipient.createdAt, "datetime-local")
                : null}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
