"use client";

import { useContext, useState } from "react";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import {
  FeaturerTypes,
  Featurer_DETAILED,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import { useTwinValidatorUpdate } from "@/entities/twin-validator";
import {
  ValidatorSet_DETAILED,
  useValidatorSetSelectAdapter,
} from "@/entities/validator-set";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinValidatorContext } from "@/features/twin-validator";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { ValidatorSetResourceLink } from "@/features/validator-set/ui";
import { usePermissionsAccess } from "@/shared/libs";
import {
  GuidWithCopy,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function TwinValidatorGeneral() {
  const { twinValidator, refresh } = useContext(TwinValidatorContext);
  const { updateTwinValidator } = useTwinValidatorUpdate();
  const featurerAdapter = useFeaturerSelectAdapter(FeaturerTypes.validator);
  const validatorSetAdapter = useValidatorSetSelectAdapter();
  const { confirm } = useActionDialogs();
  const { canForCurrentRoute } = usePermissionsAccess();
  // The whole form is read-only without TWIN_VALIDATOR_UPDATE.
  const canUpdate = canForCurrentRoute("UPDATE");

  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  /** Every edit is a batch update of one, keyed by this validator's id. */
  function update(changes: Record<string, unknown>) {
    return updateTwinValidator({
      body: { validators: [{ id: twinValidator.id, ...changes }] },
    }).then(refresh);
  }

  const validatorSetSettings: AutoEditDialogSettings = {
    value: {
      twinValidatorSetId: twinValidator.twinValidatorSet
        ? [twinValidator.twinValidatorSet]
        : undefined,
    },
    title: "Update validator set",
    onSubmit: (values) =>
      update({ twinValidatorSetId: values.twinValidatorSetId[0].id }),
    valuesInfo: {
      twinValidatorSetId: {
        type: AutoFormValueType.combobox,
        label: "Validator set",
        selectPlaceholder: "Select validator set...",
        ...validatorSetAdapter,
      },
    },
  };

  const featurerSettings: AutoEditDialogSettings = {
    value: {
      validatorFeaturerId: twinValidator.validatorFeaturer
        ? [twinValidator.validatorFeaturer]
        : undefined,
      validatorParams: twinValidator.validatorParams ?? {},
    },
    title: "Update featurer",
    onSubmit: (values) =>
      update({
        validatorFeaturerId: values.validatorFeaturerId[0].id,
        validatorParams: values.validatorParams,
      }),
    valuesInfo: {
      validatorFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Featurer",
        typeId: FeaturerTypes.validator,
        paramsFieldName: "validatorParams",
        ...featurerAdapter,
      },
    },
  };

  const descriptionSettings: InPlaceEditProps<
    typeof twinValidator.description
  > = {
    id: "description",
    value: twinValidator.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: { fieldSize: "sm" },
      label: "",
    },
    schema: z.string().optional(),
    onSubmit: async (value) => update({ description: value }),
  };

  const orderSettings: InPlaceEditProps<typeof twinValidator.order> = {
    id: "order",
    value: twinValidator.order,
    valueInfo: {
      // `AutoFormValueType.number` has no branch in the auto-field switch and
      // falls through to a plain text input, so ask for a numeric input here.
      type: AutoFormValueType.string,
      input_props: { fieldSize: "sm", type: "number" },
      label: "",
    },
    schema: z.coerce.number().min(0, "Order must be at least 0"),
    onSubmit: async (value) => update({ order: Number(value) }),
  };

  /** Toggles ask first: both flags change how the validator behaves. */
  function confirmToggle(field: "invert" | "active", label: string) {
    const isOn = Boolean(twinValidator[field]);
    const action = isOn ? "disable" : "enable";

    confirm({
      title: `${isOn ? "Disable" : "Enable"} ${label}`,
      body: `Are you sure you want to ${action} ${label.toLowerCase()} for this validator?`,
      onSuccess: () => update({ [field]: !isOn }),
    });
  }

  function openWithSettings(settings: AutoEditDialogSettings) {
    if (!canUpdate) return;
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
              <GuidWithCopy value={twinValidator.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow
            className={canUpdate ? "cursor-pointer" : undefined}
            onClick={() => openWithSettings(validatorSetSettings)}
          >
            <TableCell>Validator set</TableCell>
            <TableCell>
              {twinValidator.twinValidatorSet && (
                <ValidatorSetResourceLink
                  data={twinValidator.twinValidatorSet as ValidatorSet_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className={canUpdate ? "cursor-pointer" : undefined}
            onClick={() => openWithSettings(featurerSettings)}
          >
            <TableCell>Featurer</TableCell>
            <TableCell>
              {twinValidator.validatorFeaturer && (
                <FeaturerResourceLink
                  data={twinValidator.validatorFeaturer as Featurer_DETAILED}
                  params={twinValidator.validatorDetailedParams}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              {canUpdate ? (
                <InPlaceEdit {...descriptionSettings} />
              ) : (
                twinValidator.description
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Invert</TableCell>
            <TableCell>
              <Switch
                checked={twinValidator.invert ?? false}
                disabled={!canUpdate}
                onCheckedChange={() => confirmToggle("invert", "Invert")}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={twinValidator.active ?? false}
                disabled={!canUpdate}
                onCheckedChange={() => confirmToggle("active", "Active")}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>
              {canUpdate ? (
                <InPlaceEdit {...orderSettings} />
              ) : (
                twinValidator.order
              )}
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
