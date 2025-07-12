import { TwinSelfFieldId } from "@/entities/twin";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
} from "@/entities/twin/libs/constants";
import { Twin, Twin_DETAILED } from "@/entities/twin/server";
import { formatIntlDate } from "@/shared/libs";

import { TwinResourceLink } from "../../../../features/twin/ui";
import { UserResourceLink } from "../../../../features/user/ui";
import { MarkdownPreview } from "../../../markdown";
import { TwinClassResourceLink } from "../../../twin-class/ui";
import { TwinStatusActions } from "../twin-status-actions";
import { TwinSelfFieldMeta } from "./types";

export const SELF_FIELD_MAP: Record<TwinSelfFieldId, TwinSelfFieldMeta> = {
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
  },
  "00000000-0000-0000-0011-000000000005": {
    key: "externalId",
    descriptor: FieldDescriptorText.PLAIN,
  },
  "00000000-0000-0000-0011-000000000006": {
    key: "ownerUserId",
    renderPreview: (twin, { disabled }) => {
      return twin.ownerUser ? (
        <UserResourceLink data={twin.ownerUser} disabled={disabled} />
      ) : (
        twin.ownerUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000007": {
    key: "assignerUserId",
    descriptor: FieldDescriptorSelectUserV1,
    renderPreview: (twin, { disabled }) => {
      return twin.assignerUser ? (
        <UserResourceLink data={twin.assignerUser} disabled={disabled} />
      ) : (
        twin.assignerUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000008": {
    key: "authorUserId",
    renderPreview: (twin, { disabled }) => {
      return twin.authorUser ? (
        <UserResourceLink data={twin.authorUser} disabled={disabled} />
      ) : (
        twin.authorUserId
      );
    },
  },
  "00000000-0000-0000-0011-000000000009": {
    key: "headTwinId",
    descriptor: FieldDescriptorSelectSharedInHeadV1,
    renderPreview: (twin, { disabled }) => {
      return twin.headTwin ? (
        <TwinResourceLink data={twin.headTwin as Twin} disabled={disabled} />
      ) : (
        twin.headTwinId
      );
    },
  },
  "00000000-0000-0000-0011-000000000010": {
    key: "statusId",
    renderPreview: (twin, { disabled }) => {
      return twin.status ? (
        <TwinStatusActions
          twin={twin as Twin_DETAILED}
          allowNavigation={disabled}
        />
      ) : (
        twin.statusId
      );
    },
  },
  "00000000-0000-0000-0011-000000000011": {
    key: "createdAt",
    renderPreview: (twin) => {
      return (
        twin.createdAt && (
          <p>{formatIntlDate(twin.createdAt, "datetime-local")}</p>
        )
      );
    },
  },
  "00000000-0000-0000-0011-000000000012": {
    key: "id",
    descriptor: undefined,
  },
  "00000000-0000-0000-0011-000000000013": {
    key: "twinClassId",
    descriptor: FieldDescriptorText.PLAIN,
    renderPreview: (twin, { disabled }) => {
      return twin.twinClass ? (
        <TwinClassResourceLink
          data={twin.twinClass as TwinClass_DETAILED}
          disabled={disabled}
        />
      ) : (
        twin.twinClassId
      );
    },
  },
  "00000000-0000-0000-0011-000000000014": {
    key: "aliases",
    descriptor: undefined,
  },
  "00000000-0000-0000-0011-000000000015": {
    key: "tags",
    descriptor: undefined,
  },
  "00000000-0000-0000-0011-000000000016": {
    key: "markers",
    descriptor: undefined,
  },
};
