import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";
import { useContext } from "react";
import { AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { useUpdateFactory } from "@/entities/factory";
import { UserResourceLink } from "@/entities/user";
import { formatToTwinfaceDate } from "@/shared/libs";
import { FactoryContext } from "@/features/factory";

export function FactoryGeneral() {
  const { factory, fetchFactoryById } = useContext(FactoryContext);

  const { updateFactory } = useUpdateFactory(factory, fetchFactoryById);

  const nameSettings: InPlaceEditProps<typeof factory.name> = {
    id: "name",
    value: factory.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateFactory({
        nameI18n: {
          translations: {
            en: value,
          },
        },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps<typeof factory.description> = {
    id: "description",
    value: factory.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: (value) => {
      return updateFactory({
        descriptionI18n: {
          translations: {
            en: value ?? "",
          },
        },
      });
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
