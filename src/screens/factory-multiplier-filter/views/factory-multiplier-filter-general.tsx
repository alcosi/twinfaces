import { useContext } from "react";

import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryMultiplier_DETAILED } from "@/entities/factory-multiplier";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryMultiplierFilterContext } from "@/features/factory-multiplier-filter";
import { FactoryMultiplierResourceLink } from "@/features/factory-multiplier/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { InPlaceEditContextProvider } from "@/features/inPlaceEdit";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import {
  Checkbox,
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function FactoryMultiplierFilterGeneral() {
  const { factoryMultiplierFilter } = useContext(
    FactoryMultiplierFilterContext
  );

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={factoryMultiplierFilter.id} variant="long" />
            </TableCell>
          </TableRow>

          {factoryMultiplierFilter.multiplier?.factory && (
            <TableRow>
              <TableCell>Factory</TableCell>
              <TableCell>
                <FactoryResourceLink
                  data={factoryMultiplierFilter.multiplier.factory}
                  withTooltip
                />
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell>Multiplier</TableCell>
            <TableCell>
              <FactoryMultiplierResourceLink
                data={
                  factoryMultiplierFilter.multiplier as FactoryMultiplier_DETAILED
                }
                withTooltip
              />
            </TableCell>
          </TableRow>

          {factoryMultiplierFilter.inputTwinClass && (
            <TableRow>
              <TableCell>Input class</TableCell>
              <TableCell>
                <TwinClassResourceLink
                  data={
                    factoryMultiplierFilter.inputTwinClass as TwinClass_DETAILED
                  }
                  withTooltip
                />
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell>Condition set</TableCell>
            <TableCell>
              <FactoryConditionSetResourceLink
                data={
                  factoryMultiplierFilter.factoryConditionSet as FactoryConditionSet
                }
                withTooltip
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Condition invert</TableCell>
            <TableCell>
              <Checkbox
                checked={
                  factoryMultiplierFilter.factoryConditionSetInvert ?? false
                }
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>
              <Checkbox checked={factoryMultiplierFilter.active ?? false} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>{factoryMultiplierFilter.description ?? ""}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
