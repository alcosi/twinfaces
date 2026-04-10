import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useUpdateValidatorSet } from "@/entities/validator-set";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { ValidatorSetContext } from "@/features/validator-set";
import {
  GuidWithCopy,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function ValidatorSetGeneral() {
  const { validatorSet, refresh } = useContext(ValidatorSetContext);
  const { updateValidatorSet } = useUpdateValidatorSet();
  const { confirm } = useActionDialogs();

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

  function switchInvert() {
    const action = validatorSet.invert ? "disable" : "enable";
    const status = validatorSet.invert ? "Disable" : "Enable";

    confirm({
      title: `${status} Invert`,
      body: `Are you sure you want to ${action} action for this validator set?`,
      onSuccess: () => {
        return updateValidatorSet({
          body: {
            validatorSets: [
              {
                id: validatorSet.id,
                invert: !validatorSet.invert,
              },
            ],
          },
        }).then(refresh);
      },
    });
  }
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
              <Switch
                checked={validatorSet.invert ?? false}
                onCheckedChange={switchInvert}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
