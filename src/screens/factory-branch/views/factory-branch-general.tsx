import { AutoFormValueType } from "@/components/auto-field";
import {
  FactoryResourceLink,
  useFactorySelectAdapter,
} from "@/entities/factory";
import { useUpdateFactoryBranch } from "@/entities/factory-branch";
import {
  FactoryConditionSetResourceLink,
  useFactoryConditionSetSelectAdapter,
} from "@/entities/factory-condition-set";
import { FactoryBranchContext } from "@/features/factory-branch";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { GuidWithCopy, Table, TableCell, TableRow } from "@/shared/ui";
import { useContext } from "react";
import { z } from "zod";

export function FactoryBranchGeneral() {
  const { factoryBranch, refresh } = useContext(FactoryBranchContext);
  const fAdapter = useFactorySelectAdapter();
  const fcsAdapter = useFactoryConditionSetSelectAdapter();
  const { updateFactoryBranch } = useUpdateFactoryBranch();

  const nextFactorySettings: InPlaceEditProps<any> = {
    id: "nextFactoryId",
    value: factoryBranch.nextFactoryId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select next factory...",
      ...fAdapter,
    },
    renderPreview: factoryBranch.nextFactory
      ? (_) => (
          <FactoryResourceLink data={factoryBranch.nextFactory} withTooltip />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = value[0]?.id;
      return updateFactoryBranch({
        factoryBranchId: factoryBranch.id,
        body: {
          nextFactoryId: id,
        },
      }).then(refresh);
    },
  };

  const factoryConditionSetSettings: InPlaceEditProps<any> = {
    id: "factoryConditionSetId",
    value: factoryBranch.factoryConditionSetId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select factory condition set...",
      ...fcsAdapter,
    },
    renderPreview: factoryBranch.factoryConditionSet
      ? (_) => (
          <FactoryConditionSetResourceLink
            data={factoryBranch.factoryConditionSet}
            withTooltip
          />
        )
      : undefined,
    onSubmit: async (value) => {
      const id = value[0]?.id;
      return updateFactoryBranch({
        factoryBranchId: factoryBranch.id,
        body: {
          factoryConditionSetId: id,
        },
      }).then(refresh);
    },
  };

  const activeSettings: InPlaceEditProps<typeof factoryBranch.active> = {
    id: "active",
    value: factoryBranch.active,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateFactoryBranch({
        factoryBranchId: factoryBranch.id,
        body: {
          active: value,
        },
      }).then(refresh);
    },
  };

  const factoryConditionSetInvertSettings: InPlaceEditProps<
    typeof factoryBranch.factoryConditionSetInvert
  > = {
    id: "factoryConditionSetInvert",
    value: factoryBranch.factoryConditionSetInvert,
    valueInfo: {
      type: AutoFormValueType.boolean,
      label: "",
    },
    schema: z.boolean(),
    renderPreview: (value) => (value ? "Yes" : "No"),
    onSubmit: async (value) => {
      return updateFactoryBranch({
        factoryBranchId: factoryBranch.id,
        body: {
          factoryConditionSetInvert: value,
        },
      }).then(refresh);
    },
  };

  const descriptionSettings: InPlaceEditProps<
    typeof factoryBranch.description
  > = {
    id: "description",
    value: factoryBranch.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateFactoryBranch({
        factoryBranchId: factoryBranch.id,
        body: {
          description: value,
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
            <GuidWithCopy value={factoryBranch.id} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Factory</TableCell>
          <TableCell>
            {factoryBranch.factory && (
              <FactoryResourceLink data={factoryBranch.factory} withTooltip />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Condition set</TableCell>
          <TableCell>
            <InPlaceEdit {...factoryConditionSetSettings} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Condition invert</TableCell>
          <TableCell>
            <InPlaceEdit {...factoryConditionSetInvertSettings} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Active</TableCell>
          <TableCell>
            <InPlaceEdit {...activeSettings} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Next factory</TableCell>
          <TableCell>
            <InPlaceEdit {...nextFactorySettings} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>
            <InPlaceEdit {...descriptionSettings} />
          </TableCell>
        </TableRow>
      </Table>
    </InPlaceEditContextProvider>
  );
}
