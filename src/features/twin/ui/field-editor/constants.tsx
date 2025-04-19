import { TwinResourceLink } from "@/entities/twin/components/resource-link";
import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
} from "@/entities/twin/libs/constants";
import { UserResourceLink } from "@/entities/user/components/resource-link";

import { StaticTwinFieldMeta } from "./types";

export const STATIC_FIELD_MAP: Record<string, StaticTwinFieldMeta> = {
  "00000000-0000-0000-0011-000000000003": {
    key: "name",
    descriptor: FieldDescriptorText,
  },
  "00000000-0000-0000-0011-000000000004": {
    key: "description",
    descriptor: FieldDescriptorText,
  },
  "00000000-0000-0000-0011-000000000005": {
    key: "externalId",
    descriptor: FieldDescriptorText,
  },
  "00000000-0000-0000-0011-000000000006": {
    key: "ownerUserId",
    renderPreview: (twin) => {
      return twin.ownerUser ? (
        <UserResourceLink data={twin.ownerUser} />
      ) : (
        twin.ownerUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000007": {
    key: "assignerUserId",
    descriptor: FieldDescriptorSelectUserV1,
    renderPreview: (twin) => {
      return twin.assignerUser ? (
        <UserResourceLink data={twin.assignerUser} />
      ) : (
        twin.assignerUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000008": {
    key: "authorUserId",
    renderPreview: (twin) => {
      return twin.authorUser ? (
        <UserResourceLink data={twin.authorUser} />
      ) : (
        twin.authorUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000009": {
    key: "headTwinId",
    descriptor: FieldDescriptorSelectSharedInHeadV1,
    renderPreview: (twin) => {
      return twin.headTwin ? (
        <TwinResourceLink data={twin.headTwin} />
      ) : (
        twin.headTwinId
      );
    },
  },
  "00000000-0000-0000-0011-000000000010": {
    key: "statusId",
    //TODO Replase this
    renderPreview: (twin, props) => {
      console.log("foobar statusId", { twin, props });
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
    key: "createdAt",
  },
};
