import { CommentResourceLink } from "@/entities/comment";
import { FeaturerResourceLink } from "@/entities/featurer";
import { TwinResourceLink } from "@/entities/twin";
import { TwinClassResourceLink } from "@/entities/twinClass";
import { TwinClassFieldResourceLink } from "@/entities/twinClassField";
import { TwinFlowResourceLink } from "@/entities/twinFlow";
import { TwinFlowSchemaResourceLink } from "@/entities/twinFlowSchema";
import { TwinFlowTransitionResourceLink } from "@/entities/twinFlowTransition";
import { TwinClassStatusResourceLink } from "@/entities/twinStatus";
import { UserGroupResourceLink } from "@/entities/userGroup";
import { Separator } from "@/shared/ui";
import { Fake } from "../seeds";
import { TwinClassLinkResourceLink } from "@/entities/twinClassLink";
import { UserResourceLink } from "@/entities/user";

export function ResourceLinksTab() {
  return (
    <div className="space-y-4 p-4 h-screen">
      <section className="border p-4">
        <h1 className="font-bold">Twin</h1>
        <Separator className="my-2" />

        <main className="space-y-4">
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
        </main>
      </section>

      <section className="border p-4">
        <h1 className="font-bold">Twin</h1>
        <Separator className="my-2" />

        <main className="space-y-4">
          <div>
            <h2>Twin</h2>
            <div className="max-w-48">
              <TwinResourceLink data={Fake.loremIpsum} withTooltip />
            </div>
          </div>

          <div>
            <h2>Comments</h2>
            <div className="max-w-48">
              <CommentResourceLink data={Fake.Comment} withTooltip />
            </div>
          </div>
        </main>
      </section>

      <section className="border p-4">
        <h1 className="font-bold">Flow</h1>
        <Separator className="my-2" />

        <main className="space-y-4">
          <div>
            <h2>Twin Flow</h2>
            <div className="max-w-48">
              <TwinFlowResourceLink data={Fake.TwinFlow} withTooltip />
            </div>
          </div>

          <div>
            <h2>Twin Flow Schema</h2>
            <div className="max-w-48">
              <TwinFlowSchemaResourceLink
                data={Fake.TwinFlowSchema}
                withTooltip
              />
            </div>
          </div>

          <div>
            <h2>Twin Flow Transition</h2>
            <div className="max-w-48">
              <TwinFlowTransitionResourceLink
                data={Fake.TwinFlowTransition}
                twinClassId={Fake.TwinClass.id}
                twinFlowId="26d272e1-a899-47a7-b27c-d441b4b4cdd7"
                withTooltip
              />
            </div>
          </div>
        </main>
      </section>

      <section className="border p-4">
        <h1 className="font-bold">User</h1>
        <Separator className="my-2" />

        <main className="space-y-4">
          <div>
            <h2>User</h2>
            <div className="max-w-48">
              <UserResourceLink data={Fake.loremIpsum} withTooltip />
            </div>
          </div>

          <div>
            <h2>User group</h2>
            <div className="max-w-48">
              <UserGroupResourceLink data={Fake.UserGroup} withTooltip />
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
