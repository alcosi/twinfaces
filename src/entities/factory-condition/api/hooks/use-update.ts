import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

export function useUpdateFactoryCondition() {
  const api = useContext(PrivateApiContext);

  async function updateFactoryCondition({
    body,
  }: {
    body: {
      conditions?: Array<{
        factoryConditionSetId?: string;
        conditionerFeatureId?: number;
        conditionerParams?: Record<string, string>;
        description?: string;
        active?: boolean;
        invert?: boolean;
        id?: string;
      }>;
    };
  }) {
    const { error } = await api.factoryCondition.update({ body });
    if (error) {
      throw new Error("Failed to update factory condition");
    }
  }

  return { updateFactoryCondition };
}
