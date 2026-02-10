import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

export function useUpdateFactoryConditionSet() {
  const api = useContext(PrivateApiContext);

  async function updateFactoryConditionSet({
    body,
  }: {
    body: {
      conditionSets: Array<{
        id?: string;
        name?: string;
        twinFactoryId?: string;
        description?: string;
        conditionSetId?: string;
      }>;
    };
  }) {
    const { error } = await api.factoryConditionSet.update({ body });
    if (error) {
      throw new Error("Failed to update factory condition set");
    }
  }

  return { updateFactoryConditionSet };
}
