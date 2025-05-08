import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useUpdateFactory } from "@/entities/factory";
import { FactoryContext } from "@/features/factory";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { UserResourceLink } from "@/features/user/ui";
import { formatToTwinfaceDate } from "@/shared/libs";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function FactoryGeneral() {
  const { factory, refresh } = useContext(FactoryContext);

  const { updateFactory } = useUpdateFactory();

  const nameSettings: InPlaceEditProps<typeof factory.name> = {
    id: "name",
    value: factory.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateFactory({
        factoryId: factory.id,
        body: {
          nameI18n: {
            translations: {
              en: value,
            },
          },
        },
      }).then(refresh);
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof factory.description> = {
    id: "description",
    value: factory.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateFactory({
        factoryId: factory.id,
        body: {
          descriptionI18n: {
            translations: {
              en: value ?? "",
            },
          },
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
              <GuidWithCopy value={factory.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{factory.key}</TableCell>
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
            <TableCell>Created by</TableCell>
            <TableCell>
              {factory.createdByUser && (
                <UserResourceLink data={factory.createdByUser} withTooltip />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>{formatToTwinfaceDate(factory.createdAt)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
