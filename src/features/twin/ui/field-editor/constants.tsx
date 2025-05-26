import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
} from "@/entities/twin/libs/constants";
import { Twin_DETAILED } from "@/entities/twin/server";
import { formatIntlDate } from "@/shared/libs";

import { TwinResourceLink } from "../../../../features/twin/ui";
import { UserResourceLink } from "../../../../features/user/ui";
import { MarkdownPreview } from "../../../markdown";
import { TwinStatusActions } from "../twin-status-actions";
import { StaticTwinFieldMeta } from "./types";

export const STATIC_FIELD_MAP: Record<string, StaticTwinFieldMeta> = {
  "00000000-0000-0000-0011-000000000003": {
    key: "name",
    descriptor: FieldDescriptorText.PLAIN,
  },
  "00000000-0000-0000-0011-000000000004": {
    key: "description",
    descriptor: FieldDescriptorText.MARKDOWN_GITHUB,
    renderPreview: (twin) => {
      return twin.description && <MarkdownPreview source={twin.description} />;
    },
    className: "border border-border mt-1.5 border-dashed rounded-md px-0",
  },
  "00000000-0000-0000-0011-000000000005": {
    key: "externalId",
    descriptor: FieldDescriptorText.PLAIN,
  },
  "00000000-0000-0000-0011-000000000006": {
    key: "ownerUserId",
    renderPreview: (twin) => {
      return twin.ownerUser ? (
        <UserResourceLink data={twin.ownerUser} disabled />
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
        <UserResourceLink data={twin.assignerUser} disabled />
      ) : (
        twin.assignerUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000008": {
    key: "authorUserId",
    renderPreview: (twin) => {
      return twin.authorUser ? (
        <UserResourceLink data={twin.authorUser} disabled />
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
        <TwinResourceLink data={twin.headTwin} disabled />
      ) : (
        twin.headTwinId
      );
    },
  },
  "00000000-0000-0000-0011-000000000010": {
    key: "statusId",
    renderPreview: (twin) => {
      return twin.status ? (
        <TwinStatusActions twin={twin as Twin_DETAILED} disabled />
      ) : (
        twin.statusId
      );
    },
  },
  "00000000-0000-0000-0011-000000000011": {
    key: "createdAt",
    renderPreview: (twin) => {
      return twin.createdAt && formatIntlDate(twin.createdAt, "datetime-local");
    },
  },
};
