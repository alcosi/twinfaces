import { TwinResourceLink } from "@/entities/twin";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
} from "@/entities/twin/libs/constants";
import { Twin_DETAILED } from "@/entities/twin/server";
import { UserResourceLink } from "@/entities/user/components/resource-link";
import { TransitionPerformer } from "@/features/twin-flow-transition/transition-performer";

import { StaticTwinFieldMeta } from "./types";

export const STATIC_FIELD_MAP: Record<string, StaticTwinFieldMeta> = {
  "00000000-0000-0000-0011-000000000003": {
    fieldName: "name",
    fieldDescriptor: FieldDescriptorText,
  },
  "00000000-0000-0000-0011-000000000004": {
    fieldName: "description",
    fieldDescriptor: FieldDescriptorText,
  },
  "00000000-0000-0000-0011-000000000005": {
    fieldName: "externalId",
    fieldDescriptor: FieldDescriptorText,
  },
  "00000000-0000-0000-0011-000000000006": {
    fieldName: "ownerUserId",
    fieldDescriptor: FieldDescriptorSelectUserV1,

    editable: false,
    renderPreview: (twin) => {
      return twin.ownerUser ? (
        <UserResourceLink data={twin.ownerUser} />
      ) : (
        twin.ownerUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000007": {
    fieldName: "assignerUserId",
    fieldDescriptor: FieldDescriptorSelectUserV1,
    renderPreview: (twin) => {
      return twin.assignerUser ? (
        <UserResourceLink data={twin.assignerUser} />
      ) : (
        twin.assignerUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000008": {
    fieldName: "authorUserId",
    fieldDescriptor: FieldDescriptorSelectUserV1,
    editable: false,
    renderPreview: (twin) => {
      return twin.authorUser ? (
        <UserResourceLink data={twin.authorUser} />
      ) : (
        twin.authorUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000009": {
    fieldName: "headTwinId",
    fieldDescriptor: FieldDescriptorSelectSharedInHeadV1,
    //TODO Replase this
    renderPreview: () => {
      return <p>RESOLVE: TwinResourceLink</p>;
    },
    //TODO by this after fix bug with SSR
    // renderPreview: (twin) => {
    //   return twin.headTwin ? (
    //     <TwinResourceLink data={twin.headTwin} />
    //   ) : (
    //     twin.headTwinId
    //   );
    // },
    editable: false,
  },
  "00000000-0000-0000-0011-000000000010": {
    fieldName: "statusId",
    editable: false,
    //TODO Replase this
    renderPreview: (twin, props) => {
      return <p>RESOLVE: TwinClassStatusResourceLink</p>;
    },
    //TODO by this after fix bug with SSR
    // renderPreview: (twin, props) => {
    //   return twin.status ? (
    //     <>
    //       <TwinClassStatusResourceLink
    //         twinClassId={twin.twinClassId!}
    //         data={twin.status}
    //       />
    //       {twin.transitions && <TransitionPerformer twin={twin as Twin_DETAILED} onSuccess={props?.onTransitionPerformSuccess} />}
    //     </>
    //   ) : (
    //     twin.statusId
    //   );
    // },
  },
  "00000000-0000-0000-0011-000000000011": {
    fieldName: "createdAt",
    fieldDescriptor: FieldDescriptorText,
    editable: false,
  },
};
