import { useContext } from "react";

import { DataListOptionContext } from "@/features/datalist-option";

import { OptionProjectionsScreen } from "../../option-projections";

export function DatalistOptionProjections() {
  const { optionId } = useContext(DataListOptionContext);
  return (
    <>
      <OptionProjectionsScreen title="Incoming" optionId={optionId} />
      <OptionProjectionsScreen title="Outgoing" optionId={optionId} />
    </>
  );
}
