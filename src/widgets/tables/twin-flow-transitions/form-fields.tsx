import { ComboboxFormField, TextFormField } from "@/components/form-fields";
import { TwinFlowTransitionFormValues } from "@/entities/twin-flow-transition";
import { TwinStatusSelectField } from "@/features/twinStatus";
import { Control, useWatch } from "react-hook-form";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { isPopulatedArray, isTruthy } from "@/shared/libs";
import { useTwinFlowSelectAdapter } from "@/entities/twin-flow";
import { useFactorySelectAdapter } from "@/entities/factory";
import { useTransitionAliasSelectAdapter } from "@/entities/transition-alias";

//TODO https://alcosi.atlassian.net/browse/TWINFACES-269 add in alias with possibility of new value enter

export function TwinFlowTransitionFormFields({
  control,
}: {
  control: Control<TwinFlowTransitionFormValues>;
}) {
  const twinflow = useWatch({ control, name: "twinflow" });
  const tFAdapter = useTwinFlowSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const fAdapter = useFactorySelectAdapter();
  const tAAdapter = useTransitionAliasSelectAdapter();
  const disabled = isPopulatedArray(twinflow);

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinflow"
        label="Twinflow"
        selectPlaceholder="Select Twinflow"
        searchPlaceholder="Search Twinflow..."
        noItemsText="No Twinflow found"
        disabled={disabled}
        required={true}
        {...tFAdapter}
      />

      <ComboboxFormField
        control={control}
        name="alias"
        label="Alias"
        selectPlaceholder="Select Alias"
        searchPlaceholder="Search Alias..."
        noItemsText="No Alias found"
        required={true}
        {...tAAdapter}
      />

      <TextFormField
        control={control}
        name="name"
        label="Name"
        required={true}
      />

      <TextFormField control={control} name="description" label="Description" />

      <ComboboxFormField
        control={control}
        name={"factory"}
        label="Factory"
        selectPlaceholder="Select Factory"
        searchPlaceholder="Search Factory..."
        noItemsText="No Factory found"
        {...fAdapter}
      />

      {isTruthy(twinflow) && twinflow.length > 0 && (
        <TwinStatusSelectField
          twinClassId={twinflow?.[0]?.twinClassId}
          control={control}
          name="srcTwinStatusId"
          label="From status"
        />
      )}

      {isTruthy(twinflow) && twinflow.length > 0 && (
        <TwinStatusSelectField
          twinClassId={twinflow?.[0]?.twinClassId}
          control={control}
          name="dstTwinStatusId"
          label="To status"
          required={true}
        />
      )}

      <ComboboxFormField
        control={control}
        name={"permissionId"}
        label="Permission"
        selectPlaceholder="Select permission"
        searchPlaceholder="Search permission..."
        noItemsText="No permission found"
        {...pAdapter}
      />
    </>
  );
}
