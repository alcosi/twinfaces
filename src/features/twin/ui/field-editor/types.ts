import { ReactNode } from "react";

import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
  StaticTwinFieldKey,
} from "@/entities/twin";
import { Twin_HYDRATED } from "@/entities/twin/server";

type FieldDescriptor =
  | (typeof FieldDescriptorText)[keyof typeof FieldDescriptorText]
  | typeof FieldDescriptorSelectUserV1
  | typeof FieldDescriptorSelectSharedInHeadV1;

export type StaticTwinFieldMeta = {
  key: StaticTwinFieldKey;
  descriptor?: FieldDescriptor;
  renderPreview?: (twin: Twin_HYDRATED) => ReactNode;
  className?: string;
};
