import { DatalistIcon } from "@/features/datalist/ui";
import { FactoryBranchIcon } from "@/features/factory-branch/ui";
import { FactoryConditionSetIcon } from "@/features/factory-condition-set/ui";
import { FactoryPipelineStepIcon } from "@/features/factory-pipeline-step/ui";
import { FactoryPipelineIcon } from "@/features/factory-pipeline/ui";
import { PermissionGroupIcon } from "@/features/permission-group/ui";
import { PermissionSchemaIcon } from "@/features/permission-schema/ui";
import { PermissionIcon } from "@/features/permission/ui";
import { TierIcon } from "@/features/tier/ui";
import { FieldIcon } from "@/features/twin-class-field/ui";
import { TwinClassIcon } from "@/features/twin-class/ui";
import { TwinFlowTransitionIcon } from "@/features/twin-flow-transition/ui";
import { TwinFlowIcon } from "@/features/twin-flow/ui";
import { TwinStatusIcon } from "@/features/twin-status/ui";
import { TwinIcon } from "@/features/twin/ui";
import { BoxIcon, ShopingBagIcon } from "@/shared/ui";

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
