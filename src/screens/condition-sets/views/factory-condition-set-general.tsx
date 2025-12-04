import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useUpdateFactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryConditionSetContext } from "@/features/factory-condition-set";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { UserResourceLink } from "@/features/user/ui";
import { formatIntlDate } from "@/shared/libs";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function FactoryConditionSetGeneral() {
  const { factoryConditionSet, refresh } = useContext(
    FactoryConditionSetContext
  );
  const { updateFactoryConditionSet } = useUpdateFactoryConditionSet();

  const nameSettings: InPlaceEditProps<typeof factoryConditionSet.name> = {
    id: "name",
    value: factoryConditionSet.name,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(1, "Name is required"),
    onSubmit: async (value) => {
      return updateFactoryConditionSet({
        body: {
          conditionSets: [
            {
              conditionSetId: factoryConditionSet.id,
              name: value,
            },
          ],
        },
      }).then(refresh);
    },
  };

  const descriptionSettings: InPlaceEditProps<
    typeof factoryConditionSet.description
  > = {
    id: "description",
    value: factoryConditionSet.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().optional(),
    onSubmit: async (value) => {
      return updateFactoryConditionSet({
        body: {
          conditionSets: [
            {
              conditionSetId: factoryConditionSet.id,
              description: value,
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
              <GuidWithCopy
                value={factoryConditionSet.id || ""}
                variant="long"
              />
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
            <TableCell>Created by</TableCell>
            <TableCell>
              {factoryConditionSet.createdByUser ? (
                <UserResourceLink
                  data={factoryConditionSet.createdByUser}
                  withTooltip
                />
              ) : (
                "-"
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Created at</TableCell>
            <TableCell>
              {factoryConditionSet.createdAt
                ? formatIntlDate(
                    factoryConditionSet.createdAt,
                    "datetime-local"
                  )
                : "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
