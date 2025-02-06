import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
  useTwinClassSelectAdapter,
} from "@/entities/twinClass";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { createFixedSelectAdapter, formatToTwinfaceDate } from "@/shared/libs";
import {
  LINK_STRENGTH_TYPES,
  LINK_TYPE_TYPES,
  TwinClassLink,
  UpdateLinkRequestBody,
  useLinkUpdate,
} from "@/entities/twin-class-link";
import { UserResourceLink } from "@/entities/user";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { GuidWithCopy } from "@/shared/ui";
import { toast } from "sonner";

export function GeneralSection({
  link,
  onChange,
}: {
  link: TwinClassLink;
  onChange: () => any;
}) {
  const tcAdapter = useTwinClassSelectAdapter();
  const { updateLink } = useLinkUpdate();

  async function update(newLink: UpdateLinkRequestBody) {
    updateLink({ linkId: link.id!, body: newLink })
      .then(() => {
        onChange?.();
      })
      .catch(() => {
        toast.error("not updated link");
      });
  }

  const fromClassSettings: InPlaceEditProps<any> = {
    id: "fromClass",
    value: link.srcTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class...",
      ...tcAdapter,
    },
    renderPreview: link.srcTwinClassId
      ? (_) => (
          <TwinClassResourceLink
            data={link.srcTwinClass as TwinClass_DETAILED}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      return update({
        srcTwinClassUpdate: {
          newId: value[0].id,
        },
      });
    },
  };

  const toClassSettings: InPlaceEditProps<any> = {
    id: "toClass",
    value: link.dstTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select twin class...",
      ...tcAdapter,
    },
    renderPreview: link.srcTwinClassId
      ? (_) => (
          <TwinClassResourceLink
            data={link.dstTwinClass as TwinClass_DETAILED}
          />
        )
      : undefined,
    onSubmit: async (value) => {
      return update({
        dstTwinClassUpdate: {
          newId: value[0].id,
        },
      });
    },
  };

  const forwardNameSettings: InPlaceEditProps = {
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
          translationInCurrentLocale: value as string,
          translations: {},
        },
      });
    },
  };

  const backwardNameSettings: InPlaceEditProps = {
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
          translationInCurrentLocale: value as string,
          translations: {},
        },
      });
    },
  };

  const typeSettings: InPlaceEditProps<any> = {
    id: "type",
    value: link.type,
    valueInfo: {
      type: AutoFormValueType.combobox,
      ...createFixedSelectAdapter(LINK_TYPE_TYPES),
    },
    onSubmit: async (value) => {
      return update({ type: value[0] });
    },
  };

  const strengthSettings: InPlaceEditProps<any> = {
    id: "Strength",
    value: link.linkStrengthId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      ...createFixedSelectAdapter(LINK_STRENGTH_TYPES),
    },
    onSubmit: async (value) => {
      return update({ linkStrength: value[0] });
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
