import { useContext } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import {
  LINK_STRENGTHS,
  LINK_TYPES,
  LinkStrength,
  LinkType,
  UpdateLinkRequestBody,
  useLinkUpdate,
} from "@/entities/link";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { UserResourceLink } from "@/entities/user";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { LinkContext } from "@/features/link";
import { createFixedSelectAdapter, formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function GeneralSection() {
  const { link, linkId, refresh } = useContext(LinkContext);
  const twinClassAdapter = useTwinClassSelectAdapter();
  const { updateLink } = useLinkUpdate();

  async function update(newLink: UpdateLinkRequestBody) {
    updateLink({ linkId: linkId, body: newLink })
      .then(() => {
        refresh?.();
      })
      .catch(() => {
        toast.error("not updated link");
      });
  }

  const fromClassSettings: InPlaceEditProps<typeof link.srcTwinClassId> = {
    id: "fromClass",
    value: link.srcTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class...",
      ...twinClassAdapter,
    },
    renderPreview: link.srcTwinClassId
      ? (_) => (
          <TwinClassResourceLink
            data={link.srcTwinClass as TwinClass_DETAILED}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({
        srcTwinClassUpdate: {
          newId: id,
        },
      });
    },
  };

  const toClassSettings: InPlaceEditProps<typeof link.dstTwinClassId> = {
    id: "toClass",
    value: link.dstTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class...",
      ...twinClassAdapter,
    },
    renderPreview: link.srcTwinClassId
      ? (_) => (
          <TwinClassResourceLink
            data={link.dstTwinClass as TwinClass_DETAILED}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return update({
        dstTwinClassUpdate: {
          newId: id,
        },
      });
    },
  };

  const forwardNameSettings: InPlaceEditProps<typeof link.name> = {
    id: "forwardName",
    value: link.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        forwardNameI18n: {
          translationInCurrentLocale: value,
          translations: {},
        },
      });
    },
  };

  const backwardNameSettings: InPlaceEditProps<typeof link.backwardName> = {
    id: "backwardName",
    value: link.backwardName,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return update({
        backwardNameI18n: {
          translationInCurrentLocale: value,
          translations: {},
        },
      });
    },
  };

  const typeSettings: InPlaceEditProps<typeof link.type> = {
    id: "type",
    value: link.type,
    valueInfo: {
      type: AutoFormValueType.combobox,
      ...createFixedSelectAdapter(LINK_TYPES),
    },
    onSubmit: async (value) => {
      return update({ type: value?.[0] as LinkType });
    },
  };

  const strengthSettings: InPlaceEditProps<typeof link.linkStrengthId> = {
    id: "Strength",
    value: link.linkStrengthId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      ...createFixedSelectAdapter(LINK_STRENGTHS),
    },
    onSubmit: async (value) => {
      return update({ linkStrength: value?.[0] as LinkStrength });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={link.id} variant={"long"} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>From class</TableCell>
            <TableCell>
              <InPlaceEdit {...fromClassSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>To class</TableCell>
            <TableCell>
              <InPlaceEdit {...toClassSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Forward name</TableCell>
            <TableCell>
              <InPlaceEdit {...forwardNameSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Backward name</TableCell>
            <TableCell>
              <InPlaceEdit {...backwardNameSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>
              <InPlaceEdit {...typeSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Strength</TableCell>
            <TableCell>
              <InPlaceEdit {...strengthSettings} />
            </TableCell>
          </TableRow>

          {link.createdByUser && (
            <TableRow>
              <TableCell>Created by</TableCell>
              <TableCell>
                <UserResourceLink data={link.createdByUser} withTooltip />
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{formatToTwinfaceDate(link.createdAt!)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
