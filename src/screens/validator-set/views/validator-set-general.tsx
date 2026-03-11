import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useUpdateValidatorSet } from "@/entities/validator-set";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { ValidatorSetContext } from "@/features/validator-set";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function ValidatorSetGeneral() {
  const { validatorSet, refresh } = useContext(ValidatorSetContext);
  const { updateValidatorSet } = useUpdateValidatorSet();

  const nameSettings: InPlaceEditProps<typeof validatorSet.name> = {
    id: "name",
    value: validatorSet.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      input_props: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(1).max(100),
    onSubmit: async (value) => {
      return updateValidatorSet({
        body: {
          validatorSets: [
            {
              id: validatorSet.id,
              name: value,
            },
          ],
        },
      }).then(refresh);
    },
  };
  const descriptionSettings: InPlaceEditProps<typeof validatorSet.description> =
    {
      id: "description",
      value: validatorSet.description,
      valueInfo: {
        type: AutoFormValueType.string,
        input_props: {
          fieldSize: "sm",
        },
        label: "",
      },
      schema: z.string().min(1),
      onSubmit: async (value) => {
        return updateValidatorSet({
          body: {
            validatorSets: [
              {
                id: validatorSet.id,
                description: value,
              },
            ],
          },
        }).then(refresh);
      },
    };

  const invertSettings: InPlaceEditProps<typeof validatorSet.invert> = {
    id: "invert",
    value: validatorSet.invert,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateValidatorSet({
        body: {
          validatorSets: [
            {
              id: validatorSet.id,
              invert: value,
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
              <GuidWithCopy value={validatorSet.id} variant="long" />
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
            <TableCell>Invert</TableCell>
            <TableCell>
              <InPlaceEdit {...invertSettings} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
