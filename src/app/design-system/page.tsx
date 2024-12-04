"use client";

import { CommentResourceLink } from "@/entities/comment";
import { TwinClassFieldResourceLink } from "@/entities/twinClassField";
import { TwinFlowResourceLink } from "@/entities/twinFlow";
import { TwinFlowSchemaResourceLink } from "@/entities/twinFlowSchema";
import { TwinFlowTransitionResourceLink } from "@/entities/twinFlowTransition";
import { UserGroupResourceLink } from "@/entities/userGroup";
import { Separator } from "@/shared/ui";
import { Fake } from "./seeds";

export default function DesignSystemPage() {
  return (
    <div className="space-y-4 p-4 h-screen">
      <h2>Class Field</h2>
      <div className="max-w-48">
        <TwinClassFieldResourceLink data={Fake.TwinClassField} withTooltip />
      </div>

      <section className="border p-4">
        <h1 className="font-bold">Twin Flow</h1>
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
            <h2>User group</h2>
            <div className="max-w-48">
              <UserGroupResourceLink data={Fake.UserGroup} withTooltip />
            </div>
          </div>
        </main>
      </section>

      <h2>Comment</h2>
      <div className="max-w-48">
        <CommentResourceLink data={Fake.Comment} withTooltip />
      </div>
    </div>
  );
}
