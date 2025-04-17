import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
} from "@/entities/twin/libs/constants";

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
    resourceLinkKey: "ownerUser",
  },
  "00000000-0000-0000-0011-000000000007": {
    fieldName: "assignerUserId",
    fieldDescriptor: FieldDescriptorSelectUserV1,
    resourceLinkKey: "assignerUser",
  },
  "00000000-0000-0000-0011-000000000008": {
    fieldName: "authorUserId",
    fieldDescriptor: FieldDescriptorSelectUserV1,
    editable: false,
    resourceLinkKey: "authorUser",
  },
  "00000000-0000-0000-0011-000000000009": {
    fieldName: "headTwinId",
    fieldDescriptor: FieldDescriptorSelectSharedInHeadV1,
    editable: false,
    resourceLinkKey: "headTwin",
  },
  "00000000-0000-0000-0011-000000000010": {
    fieldName: "statusId",
    editable: false,
    resourceLinkKey: "status",
  },
  "00000000-0000-0000-0011-000000000011": {
    fieldName: "createdAt",
    fieldDescriptor: FieldDescriptorText,
    editable: false,
  },
};
