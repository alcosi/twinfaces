import { useContext } from "react";

import { FactoryConditionSet_DETAILED } from "@/entities/factory-condition-set";
import { Featurer_DETAILED } from "@/entities/featurer";
import { FactoryConditionContext } from "@/features/factory-condition";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function FactoryConditionGeneral() {
  const { factoryCondition } = useContext(FactoryConditionContext);

  return (
    <Table className="mt-8">
      <TableBody>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>
            <GuidWithCopy value={factoryCondition.id} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Factory Condition Set</TableCell>
          <TableCell>
            {factoryCondition.factoryConditionSet ? (
              <FactoryConditionSetResourceLink
                data={
                  factoryCondition.factoryConditionSet as FactoryConditionSet_DETAILED
                }
                withTooltip
              />
            ) : (
              "-"
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Conditioner Featurer</TableCell>
          <TableCell>
            {factoryCondition.conditionerFeaturer ? (
              <FeaturerResourceLink
                data={factoryCondition.conditionerFeaturer as Featurer_DETAILED}
                withTooltip
              />
            ) : (
              "-"
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>
            {factoryCondition.description ? (
              <div className="text-muted-foreground">
                {factoryCondition.description}
              </div>
            ) : (
              "-"
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Active</TableCell>
          <TableCell>{factoryCondition.active ? "Yes" : "No"}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Invert</TableCell>
          <TableCell>{factoryCondition.invert ? "Yes" : "No"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
