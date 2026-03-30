import { useContext } from "react";

import { FactoryMultiplierContext } from "@/features/factory-multiplier";

import { FactoryMultiplierFiltersScreen } from "../../factory-multiplier-filters";

export function FactoryMultiplierFilters() {
  const { factoryMultiplierId } = useContext(FactoryMultiplierContext);
  return (
    <>
      <FactoryMultiplierFiltersScreen
        factoryMultiplierId={factoryMultiplierId}
      />
    </>
  );
}
