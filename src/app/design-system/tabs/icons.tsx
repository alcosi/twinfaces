import { DatalistIcon } from "@/entities/datalist";
import { FactoryBranchIcon } from "@/entities/factory-branch";
import { FactoryConditionSetIcon } from "@/entities/factory-condition-set";
import { FactoryPipelineIcon } from "@/entities/factory-pipeline";
import { FactoryPipelineStepIcon } from "@/entities/factory-pipeline-step";
import { PermissionIcon } from "@/entities/permission";
import { PermissionGroupIcon } from "@/entities/permission-group";
import { PermissionSchemaIcon } from "@/entities/permission-schema";
import { TwinIcon } from "@/entities/twin";
import { TwinClassIcon } from "@/entities/twin-class";
import { FieldIcon } from "@/entities/twin-class-field";
import { TwinFlowIcon } from "@/entities/twin-flow";
import { TwinFlowTransitionIcon } from "@/entities/twin-flow-transition";
import { TwinStatusIcon } from "@/entities/twin-status";
import { BoxIcon, ShopingBagIcon, TierIcon } from "@/shared/ui";

import { UiSection } from "../components/ui-section";

export function IconsTab() {
  return (
    <div className="h-screen overflow-y-auto max-h-98">
      <div className="space-y-4 p-4">
        <UiSection title="Icons">
          <UiSection.Item title="Box" value={<BoxIcon />} />
          <UiSection.Item title="Datalist" value={<DatalistIcon />} />
          <UiSection.Item title="FactoryBranch" value={<FactoryBranchIcon />} />
          <UiSection.Item
            title="FactoryConditionSet"
            value={<FactoryConditionSetIcon />}
          />
          <UiSection.Item
            title="FactoryPipeline"
            value={<FactoryPipelineIcon />}
          />
          <UiSection.Item
            title="FactoryPipelineStep"
            value={<FactoryPipelineStepIcon />}
          />
          <UiSection.Item title="Field" value={<FieldIcon />} />
          <UiSection.Item title="Permission" value={<PermissionIcon />} />
          <UiSection.Item
            title="PermissionGroup"
            value={<PermissionGroupIcon />}
          />
          <UiSection.Item
            title="PermissionSchema"
            value={<PermissionSchemaIcon />}
          />
          <UiSection.Item title="ShopingBag" value={<ShopingBagIcon />} />
          <UiSection.Item title="Tier" value={<TierIcon />} />
          <UiSection.Item title="Twin" value={<TwinIcon />} />
          <UiSection.Item title="TwinClass" value={<TwinClassIcon />} />
          <UiSection.Item title="TwinFlow" value={<TwinFlowIcon />} />
          <UiSection.Item
            title="TwinFlowTransition"
            value={<TwinFlowTransitionIcon />}
          />
          <UiSection.Item title="TwinStatus" value={<TwinStatusIcon />} />
        </UiSection>
      </div>
    </div>
  );
}
