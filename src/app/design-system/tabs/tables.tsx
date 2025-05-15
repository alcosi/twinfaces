import { useState } from "react";

import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { isPopulatedArray } from "@/shared/libs";
import { Combobox } from "@/shared/ui";
import { TwinsTable } from "@/widgets/tables";

import { UiSection } from "../components/ui-section";

export function TablesTab() {
  const tcAdapter = useTwinClassSelectAdapter();
  const [firstId, setFirstId] = useState<string | undefined>(undefined);
  const [secondId, setSecondId] = useState<string | undefined>(undefined);

  return (
    <div className="h-screen max-h-98 overflow-y-auto">
      <div className="space-y-4 p-4">
        <UiSection title="#1" className="grid grid-cols-1 gap-4">
          <Combobox
            {...tcAdapter}
            onSelect={(twinClasses) => {
              setFirstId(
                isPopulatedArray<TwinClass_DETAILED>(twinClasses)
                  ? twinClasses[0].id
                  : undefined
              );
            }}
          />

          {firstId && (
            <UiSection.Item
              title=""
              value={
                <TwinsTable
                  title=""
                  baseTwinClassId={firstId}
                  enabledColumns={[]}
                />
              }
            />
          )}
        </UiSection>

        <UiSection title="#2" className="grid grid-cols-1 gap-4">
          <Combobox
            {...tcAdapter}
            onSelect={(twinClasses) => {
              setSecondId(
                isPopulatedArray<TwinClass_DETAILED>(twinClasses)
                  ? twinClasses[0].id
                  : undefined
              );
            }}
          />

          {secondId && (
            <UiSection.Item
              title=""
              value={
                <TwinsTable
                  title=""
                  baseTwinClassId={secondId}
                  enabledColumns={[]}
                />
              }
            />
          )}
        </UiSection>
      </div>
    </div>
  );
}
