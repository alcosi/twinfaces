import { CommentResourceLink } from "@/features/comment/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { LinkResourceLink } from "@/features/link/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinFlowSchemaResourceLink } from "@/features/twin-flow-schema/ui";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinFlowResourceLink } from "@/features/twin-flow/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserGroupResourceLink } from "@/features/user-group/ui";
import { UserResourceLink } from "@/features/user/ui";

import { UiSection } from "../components/ui-section";
import { Fake } from "../seeds";

export function ResourceLinksTab() {
  return (
    <div className="h-screen max-h-98 overflow-y-auto">
      <div className="space-y-4 p-4">
        <UiSection title="Class">
          <UiSection.Item
            title="Class"
            value={<TwinClassResourceLink data={Fake.TwinClass} withTooltip />}
          />

          <UiSection.Item
            title="Field"
            value={
              <TwinClassFieldResourceLink
                data={Fake.TwinClassField}
                withTooltip
              />
            }
          />

          <UiSection.Item
            title="Status"
            value={
              <TwinClassStatusResourceLink
                twinClassId=""
                data={Fake.loremIpsum}
                withTooltip
              />
            }
          />

          <UiSection.Item
            title="Link"
            value={<LinkResourceLink data={Fake.loremIpsum} withTooltip />}
          />
        </UiSection>

        <UiSection title="Twin">
          <UiSection.Item
            title="Twin"
            value={<TwinResourceLink data={Fake.loremIpsum} withTooltip />}
          />
          <UiSection.Item
            title="Twin"
            value={<TwinResourceLink data={Fake.loremIpsum} withTooltip />}
          />

          <UiSection.Item
            title="Comments"
            value={<CommentResourceLink data={Fake.Comment} withTooltip />}
          />
        </UiSection>

        <UiSection title="Flow">
          <UiSection.Item
            title="Flow"
            value={<TwinFlowResourceLink data={Fake.TwinFlow} withTooltip />}
          />

          <UiSection.Item
            title="Twin Flow Schema"
            value={
              <TwinFlowSchemaResourceLink
                data={Fake.TwinFlowSchema}
                withTooltip
              />
            }
          />

          <UiSection.Item
            title="Twin Flow Transition"
            value={
              <TwinFlowTransitionResourceLink
                data={Fake.TwinFlowTransition}
                withTooltip
              />
            }
          />
        </UiSection>

        <UiSection title="User">
          <UiSection.Item
            title="User"
            value={<UserResourceLink data={Fake.loremIpsum} withTooltip />}
          />

          <UiSection.Item
            title="User group"
            value={<UserGroupResourceLink data={Fake.UserGroup} withTooltip />}
          />
        </UiSection>

        <UiSection title="Misc">
          <UiSection.Item
            title="Feature"
            value={<FeaturerResourceLink data={Fake.Featurer} withTooltip />}
          />
        </UiSection>
      </div>
    </div>
  );
}
