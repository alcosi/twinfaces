import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useUpdateFactoryBranch } from "@/entities/factory-branch";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { FactoryBranchContext } from "@/features/factory-branch";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
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

export function FactoryBranchGeneral() {
  const { factoryBranch, refresh } = useContext(FactoryBranchContext);
  const fAdapter = useFactorySelectAdapter();
  const fcsAdapter = useFactoryConditionSetSelectAdapter();
  const { updateFactoryBranch } = useUpdateFactoryBranch();
  const { confirm } = useActionDialogs();

  const nextFactorySettings: InPlaceEditProps<any> = {
    id: "nextFactoryId",
    value: factoryBranch.nextFactoryId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select next factory...",
      ...fAdapter,
    },
    renderPreview: factoryBranch.nextFactory
      ? () => (
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
      ? () => (
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

  function switchActive() {
    const action = factoryBranch.active ? "disable" : "enable";
    const status = factoryBranch.active ? "Disable" : "Enable";

    confirm({
      title: `${status} Active`,
      body: `Are you sure you want to ${action} action for this branch?`,
      onSuccess: () => {
        return updateFactoryBranch({
          factoryBranchId: factoryBranch.id,
          body: {
            active: factoryBranch.active!,
          },
        }).then(refresh);
      },
    });
  }

  function switchInvert() {
    const action = factoryBranch.factoryConditionSetInvert
      ? "disable"
      : "enable";
    const status = factoryBranch.factoryConditionSetInvert
      ? "Disable"
      : "Enable";

    confirm({
      title: `${status} Invert`,
      body: `Are you sure you want to ${action} action for this branch?`,
      onSuccess: () => {
        return updateFactoryBranch({
          factoryBranchId: factoryBranch.id,
          body: {
            factoryConditionSetInvert: factoryBranch.factoryConditionSetInvert!,
          },
        }).then(refresh);
      },
    });
  }

  const descriptionSettings: InPlaceEditProps<
    typeof factoryBranch.description
  > = {
    id: "description",
    value: factoryBranch.description,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
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
        <TableBody>
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
              <Switch
                checked={factoryBranch.factoryConditionSetInvert ?? false}
                onCheckedChange={switchInvert}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Switch
                checked={factoryBranch.active ?? false}
                onCheckedChange={switchActive}
              />
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
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
