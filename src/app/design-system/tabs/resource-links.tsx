import { CommentResourceLink } from "@/entities/comment";
import { FeaturerResourceLink } from "@/entities/featurer";
import { TwinResourceLink } from "@/entities/twin";
import { TwinClassResourceLink } from "@/entities/twin-class";
import { TwinClassFieldResourceLink } from "@/entities/twin-class-field";
import { TwinFlowResourceLink } from "@/entities/twin-flow";
import { TwinFlowSchemaResourceLink } from "@/entities/twinFlowSchema";
import { TwinFlowTransitionResourceLink } from "@/entities/twinFlowTransition";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { UserResourceLink } from "@/entities/user";
import { UserGroupResourceLink } from "@/entities/userGroup";
import { UiSection } from "../components/ui-section";
import { Fake } from "../seeds";
import { LinkResourceLink } from "@/entities/link";

export function ResourceLinksTab() {
  return (
    <div className="h-screen overflow-y-auto max-h-98">
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
                twinClassId={Fake.TwinClass.id}
                twinFlowId="26d272e1-a899-47a7-b27c-d441b4b4cdd7"
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
