import { Control } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useTwinFlowSelectAdapter } from "@/entities/twin-flow";
import {
  TWINFLOW_FACTORY_SCHEMA,
  useFactoryLauncherSelectAdapter,
} from "@/entities/twinflow-factory";

export function TwinFlowFactoryFormFields({
  control,
}: {
  control: Control<z.infer<typeof TWINFLOW_FACTORY_SCHEMA>>;
  twinflowId?: string;
}) {
  const twinflowAdapter = useTwinFlowSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();
  const launcherAdapter = useFactoryLauncherSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinflowId"
        label="Twinflow"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...twinflowAdapter}
      />

      <ComboboxFormField
        control={control}
        name="twinFactoryLauncherId"
        label="Launcher"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...launcherAdapter}
      />

      <ComboboxFormField
        control={control}
        name="factoryId"
        label="Factory"
        selectPlaceholder="Select..."
        searchPlaceholder="Search..."
        noItemsText="No data found"
        {...factoryAdapter}
      />
    </>
  );
}
