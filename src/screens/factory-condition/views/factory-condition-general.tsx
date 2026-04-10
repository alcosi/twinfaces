import { useContext, useState } from "react";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { useUpdateFactoryCondition } from "@/entities/factory-condition";
import { FactoryConditionSet_DETAILED } from "@/entities/factory-condition-set";
import {
  Featurer_DETAILED,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import { FactoryConditionContext } from "@/features/factory-condition";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import {
  GuidWithCopy,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function FactoryConditionGeneral() {
  const { factoryCondition, refresh } = useContext(FactoryConditionContext);
  const featurerAdapter = useFeaturerSelectAdapter(24);
  const { updateFactoryCondition } = useUpdateFactoryCondition();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);
  const { confirm } = useActionDialogs();

  const conditionerFeaturerSettings: AutoEditDialogSettings = {
    value: {
      conditionerFeatureId: factoryCondition.conditionerFeaturer
        ? [factoryCondition.conditionerFeaturer]
        : undefined,
      conditionerFeatureParams: factoryCondition.conditionerParams ?? {},
    },
    title: "Update conditioner",
    onSubmit: (values) => {
      return updateFactoryCondition({
        body: {
          conditions: [
            {
              id: factoryCondition.id,
              conditionerFeatureId: values.conditionerFeatureId[0].id,
              conditionerParams: values.conditionerParams,
            },
          ],
        },
      }).then(refresh);
    },
    valuesInfo: {
      conditionerFeatureId: {
        type: AutoFormValueType.featurer,
        label: "Conditioner",
        typeId: 24,
        paramsFieldName: "conditionerParams",
        ...featurerAdapter,
      },
    },
  };

  const descriptionSettings: InPlaceEditProps<
    typeof factoryCondition.description
  > = {
    id: "description",
    value: factoryCondition.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().optional(),
    onSubmit: async (value) => {
      return updateFactoryCondition({
        body: {
          conditions: [
            {
              id: factoryCondition.id,
              description: value,
            },
          ],
        },
      }).then(refresh);
    },
  };

  function switchActive() {
    const action = factoryCondition.active ? "disable" : "enable";
    const status = factoryCondition.active ? "Disable" : "Enable";

    confirm({
      title: `${status} Active`,
      body: `Are you sure you want to ${action} action for this condition?`,
      onSuccess: () => {
        return updateFactoryCondition({
          body: {
            conditions: [
              {
                id: factoryCondition.id,
                active: !factoryCondition.active,
              },
            ],
          },
        }).then(refresh);
      },
    });
  }

  function switchInvert() {
    const action = factoryCondition.invert ? "disable" : "enable";
    const status = factoryCondition.invert ? "Disable" : "Enable";

    confirm({
      title: `${status} Invert`,
      body: `Are you sure you want to ${action} action for this condition?`,
      onSuccess: () => {
        return updateFactoryCondition({
          body: {
            conditions: [
              {
                id: factoryCondition.id,
                invert: !factoryCondition.invert,
              },
            ],
          },
        }).then(refresh);
      },
    });
  }

  function openWithSettings(settings: AutoEditDialogSettings) {
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
              <GuidWithCopy value={factoryCondition.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Condition Set</TableCell>
            <TableCell>
              {factoryCondition.factoryConditionSet && (
                <FactoryConditionSetResourceLink
                  data={
                    factoryCondition.factoryConditionSet as FactoryConditionSet_DETAILED
                  }
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow
            className="cursor-pointer"
            onClick={() => openWithSettings(conditionerFeaturerSettings)}
          >
            <TableCell>Conditioner Featurer</TableCell>
            <TableCell>
              {factoryCondition.conditionerFeaturer && (
                <FeaturerResourceLink
                  data={
                    factoryCondition.conditionerFeaturer as Featurer_DETAILED
                  }
                  params={factoryCondition.conditionerDetailedParams}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={factoryCondition.active ?? false}
                onCheckedChange={switchActive}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Invert</TableCell>
            <TableCell>
              <Switch
                checked={factoryCondition.invert ?? false}
                onCheckedChange={switchInvert}
              />
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
