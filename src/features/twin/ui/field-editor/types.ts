import { ReactNode } from "react";

import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
  TwinSelfFieldKey,
} from "@/entities/twin";
import { Twin_HYDRATED } from "@/entities/twin/server";

type FieldDescriptor =
  | (typeof FieldDescriptorText)[keyof typeof FieldDescriptorText]
  | typeof FieldDescriptorSelectUserV1
  | typeof FieldDescriptorSelectSharedInHeadV1;

export type TwinSelfFieldMeta = {
  key: TwinSelfFieldKey;
  descriptor?: FieldDescriptor;
  renderPreview?: (
    twin: Twin_HYDRATED,
    options: { disabled?: boolean }
  ) => ReactNode;
  className?: string;
};
