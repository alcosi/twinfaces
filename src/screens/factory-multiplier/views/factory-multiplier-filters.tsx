import { useContext } from "react";

import { FactoryMultiplierContext } from "@/features/factory-multiplier";
import { FactoryMultiplierFiltersTable } from "@/widgets/tables/factory-multiplier-filters";

export function FactoryMultiplierFilters() {
  const { factoryMultiplierId } = useContext(FactoryMultiplierContext);
  return (
    <>
      <FactoryMultiplierFiltersTable
        factoryMultiplierId={factoryMultiplierId}
      />
    </>
  );
}
