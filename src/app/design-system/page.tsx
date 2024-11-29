"use client";

import { CommentResourceLink } from "@/entities/comment";
import { TwinClassFieldResourceLink } from "@/entities/twinClassField";
import { TwinFlowResourceLink } from "@/entities/twinFlow";
import { TwinFlowTransitionResourceLink } from "@/entities/twinFlowTransition";
import { UserGroupResourceLink } from "@/entities/userGroup";
import { Fake } from "./seeds";

export default function DesignSystemPage() {
  return (
    <div className="space-y-4 p-4 h-screen">
      <h1>Class Field</h1>
      <div className="max-w-48">
        <TwinClassFieldResourceLink data={Fake.TwinClassField} withTooltip />
      </div>

      <h1>Twin Flow</h1>
      <div className="max-w-48">
        <TwinFlowResourceLink data={Fake.TwinFlow} withTooltip />
      </div>

      <h1>Transition</h1>
      <div className="max-w-48">
        <TwinFlowTransitionResourceLink
          data={Fake.TwinFlowTransition}
          twinClassId={Fake.TwinClass.id}
          twinFlowId="26d272e1-a899-47a7-b27c-d441b4b4cdd7"
          withTooltip
        />
      </div>

      <h1>User group</h1>
      <div className="max-w-48">
        <UserGroupResourceLink data={Fake.UserGroup} withTooltip />
      </div>

      <h1>Comment</h1>
      <div className="max-w-48">
        <CommentResourceLink data={Fake.Comment} withTooltip />
      </div>
    </div>
  );
}
