import { CommentResourceLink } from "@/entities/comment";
import { FeaturerResourceLink } from "@/entities/featurer";
import { TwinResourceLink } from "@/entities/twin";
import { TwinClassResourceLink } from "@/entities/twinClass";
import { TwinClassFieldResourceLink } from "@/entities/twinClassField";
import { TwinClassLinkResourceLink } from "@/entities/twinClassLink";
import { TwinFlowResourceLink } from "@/entities/twinFlow";
import { TwinFlowSchemaResourceLink } from "@/entities/twinFlowSchema";
import { TwinFlowTransitionResourceLink } from "@/entities/twinFlowTransition";
import { TwinClassStatusResourceLink } from "@/entities/twinStatus";
import { UserResourceLink } from "@/entities/user";
import { UserGroupResourceLink } from "@/entities/userGroup";
import { UiSection } from "../components/ui-section";
import { Fake } from "../seeds";

export function ResourceLinksTab() {
  return (
    <div className="h-screen">
      <div className="space-y-4 p-4">
        <UiSection title="Class">
          <div>
            <h2>Class</h2>
            <div className="max-w-48">
              <TwinClassResourceLink data={Fake.TwinClass} withTooltip />
            </div>
          </div>

          <div>
            <h2>Field</h2>
            <div className="max-w-48">
              <TwinClassFieldResourceLink
                data={Fake.TwinClassField}
                withTooltip
              />
            </div>
          </div>

          <div>
            <h2>Status</h2>
            <div className="max-w-48">
              <TwinClassStatusResourceLink
                twinClassId=""
                data={Fake.loremIpsum}
                withTooltip
              />
            </div>
          </div>

          <div>
            <h2>Link</h2>
            <div className="max-w-48">
              <TwinClassLinkResourceLink data={Fake.loremIpsum} withTooltip />
            </div>
          </div>

          <div>
            <h2>Featurer</h2>
            <div className="max-w-48">
              <FeaturerResourceLink data={Fake.Featurer} withTooltip />
            </div>
          </div>
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
      </div>
    </div>
  );
}
