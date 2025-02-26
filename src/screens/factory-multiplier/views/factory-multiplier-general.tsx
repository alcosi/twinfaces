import { AutoFormValueType } from "@/components/auto-field";
import {
  FactoryResourceLink,
  useFactorySelectAdapter,
} from "@/entities/factory";
import { useUpdateFactoryMultiplier } from "@/entities/factory-multiplier";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { FactoryMultiplierContext } from "@/features/factory-multiplier";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { GuidWithCopy, Table, TableCell, TableRow } from "@/shared/ui";
import { useContext } from "react";
import { z } from "zod";

export function FactoryMultiplierGeneral() {
  const { factoryMultiplier, refresh } = useContext(FactoryMultiplierContext);
  const tcAdapter = useTwinClassSelectAdapter();
  const { updateFactoryMultiplier } = useUpdateFactoryMultiplier();

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

  //TODO add missing field multiplierFeaturerId in DTO

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
    </InPlaceEditContextProvider>
  );
}
