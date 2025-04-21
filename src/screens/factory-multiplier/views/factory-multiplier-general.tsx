import { useContext, useState } from "react";
import { z } from "zod";

import { AutoDialog, AutoEditDialogSettings } from "@/components/auto-dialog";
import { AutoFormValueType } from "@/components/auto-field";

import { useUpdateFactoryMultiplier } from "@/entities/factory-multiplier";
import {
  FeaturerTypes,
  Featurer_DETAILED,
  useFeaturerSelectAdapter,
} from "@/entities/featurer";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { FactoryMultiplierContext } from "@/features/factory-multiplier";
import { FactoryResourceLink } from "@/features/factory/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { GuidWithCopy, Table, TableCell, TableRow } from "@/shared/ui";

export function FactoryMultiplierGeneral() {
  const { factoryMultiplier, refresh } = useContext(FactoryMultiplierContext);
  const tcAdapter = useTwinClassSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(22);
  const { updateFactoryMultiplier } = useUpdateFactoryMultiplier();
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] =
    useState<AutoEditDialogSettings | undefined>(undefined);

  const inputClassSettings: InPlaceEditProps<
    typeof factoryMultiplier.inputTwinClassId
  > = {
    id: "inputTwinClassId",
    value: factoryMultiplier.inputTwinClassId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select input twin class...",
      ...tcAdapter,
    },
    renderPreview: factoryMultiplier.inputTwinClass
      ? (_) => (
          <TwinClassResourceLink
            data={factoryMultiplier.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = (value as unknown as Array<{ id: string }>)[0]?.id;
      return updateFactoryMultiplier({
        factoryMultiplierId: factoryMultiplier.id,
        body: {
          factoryMultiplier: {
            inputTwinClassId: id,
          },
        },
      }).then(refresh);
    },
  };

  const multiplierFeaturerSettings: AutoEditDialogSettings = {
    value: {
      multiplierFeaturerId: factoryMultiplier.multiplierFeaturerId,
    },
    title: "Update multiplier",
    onSubmit: (values) => {
      return updateFactoryMultiplier({
        factoryMultiplierId: factoryMultiplier.id,
        body: {
          factoryMultiplier: {
            multiplierFeaturerId: values.multiplierFeaturerId[0].id,
            multiplierParams: values.multiplierParams,
          },
        },
      }).then(refresh);
    },
    valuesInfo: {
      multiplierFeaturerId: {
        type: AutoFormValueType.featurer,
        label: "Multiplier",
        typeId: FeaturerTypes.multiplier,
        paramsFieldName: "multiplierParams",
        ...featurerAdapter,
      },
    },
  };

  const activeSettings: InPlaceEditProps<typeof factoryMultiplier.active> = {
    id: "active",
    value: factoryMultiplier.active,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateFactoryMultiplier({
        factoryMultiplierId: factoryMultiplier.id,
        body: {
          factoryMultiplier: {
            active: value,
          },
        },
      }).then(refresh);
    },
  };

  const descriptionSettings: InPlaceEditProps<
    typeof factoryMultiplier.description
  > = {
    id: "description",
    value: factoryMultiplier.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateFactoryMultiplier({
        factoryMultiplierId: factoryMultiplier.id,
        body: {
          factoryMultiplier: {
            description: value,
          },
        },
      }).then(refresh);
    },
  };

  function openWithSettings(settings: AutoEditDialogSettings) {
    setCurrentAutoEditDialogSettings(settings);
    setEditFieldDialogOpen(true);
  }

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>
            <GuidWithCopy value={factoryMultiplier.id} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Factory</TableCell>
          <TableCell>
            <FactoryResourceLink data={factoryMultiplier.factory} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Input class</TableCell>
          <TableCell>
            <InPlaceEdit {...inputClassSettings} />
          </TableCell>
        </TableRow>

        <TableRow
          className="cursor-pointer"
          onClick={() => openWithSettings(multiplierFeaturerSettings)}
        >
          <TableCell>Multiplier</TableCell>
          <TableCell>
            {factoryMultiplier.multiplierFeaturer && (
              <FeaturerResourceLink
                data={factoryMultiplier.multiplierFeaturer as Featurer_DETAILED}
                withTooltip
              />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Active</TableCell>
          <TableCell>
            <InPlaceEdit {...activeSettings} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Descritpion</TableCell>
          <TableCell>
            <InPlaceEdit {...descriptionSettings} />
          </TableCell>
        </TableRow>
      </Table>

      <AutoDialog
        open={editFieldDialogOpen}
        onOpenChange={setEditFieldDialogOpen}
        settings={currentAutoEditDialogSettings}
      />
    </InPlaceEditContextProvider>
  );
}
