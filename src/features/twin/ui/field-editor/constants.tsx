import { StaticTwinFieldId } from "@/entities/twin";
import { TwinClass_DETAILED } from "@/entities/twin-class";
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
import { TwinClassResourceLink } from "../../../twin-class/ui";
import { TwinStatusActions } from "../twin-status-actions";
import { StaticTwinFieldMeta } from "./types";

export const STATIC_FIELD_MAP: Record<StaticTwinFieldId, StaticTwinFieldMeta> =
  {
    "00000000-0000-0000-0011-000000000003": {
      key: "name",
      descriptor: FieldDescriptorText.PLAIN,
    },
    "00000000-0000-0000-0011-000000000004": {
      key: "description",
      descriptor: FieldDescriptorText.MARKDOWN_GITHUB,
      renderPreview: (twin) => {
        return (
          twin.description && <MarkdownPreview source={twin.description} />
        );
      },
      className: "px-0",
    },
    "00000000-0000-0000-0011-000000000005": {
      key: "externalId",
      descriptor: FieldDescriptorText.PLAIN,
    },
    "00000000-0000-0000-0011-000000000006": {
      key: "ownerUserId",
      renderPreview: (twin, mode) => {
        return twin.ownerUser ? (
          <UserResourceLink data={twin.ownerUser} disabled={mode === "admin"} />
        ) : (
          twin.ownerUserId
        );
      },
    },
    "00000000-0000-0000-0011-000000000007": {
      key: "assignerUserId",
      descriptor: FieldDescriptorSelectUserV1,
      renderPreview: (twin, mode) => {
        return twin.assignerUser ? (
          <UserResourceLink
            data={twin.assignerUser}
            disabled={mode === "admin"}
          />
        ) : (
          twin.assignerUserId
        );
      },
    },
    "00000000-0000-0000-0011-000000000008": {
      key: "authorUserId",
      renderPreview: (twin, mode) => {
        return twin.authorUser ? (
          <UserResourceLink
            data={twin.authorUser}
            disabled={mode === "admin"}
          />
        ) : (
          twin.authorUserId
        );
      },
    },
    "00000000-0000-0000-0011-000000000009": {
      key: "headTwinId",
      descriptor: FieldDescriptorSelectSharedInHeadV1,
      renderPreview: (twin, mode) => {
        return twin.headTwin ? (
          <TwinResourceLink data={twin.headTwin} disabled={mode === "admin"} />
        ) : (
          twin.headTwinId
        );
      },
    },
    "00000000-0000-0000-0011-000000000010": {
      key: "statusId",
      renderPreview: (twin, mode) => {
        return twin.status ? (
          <TwinStatusActions
            twin={twin as Twin_DETAILED}
            allowNavigation={mode === "admin"}
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
          twin.createdAt && formatIntlDate(twin.createdAt, "datetime-local")
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
      renderPreview: (twin, mode) => {
        return twin.twinClass ? (
          <TwinClassResourceLink
            data={twin.twinClass as TwinClass_DETAILED}
            disabled={mode === "admin"}
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
