import { ReactNode } from "react";

import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
} from "@/entities/twin";
import { Twin } from "@/entities/twin/server";

type FieldDescriptor =
  | typeof FieldDescriptorText
  | typeof FieldDescriptorSelectUserV1
  | typeof FieldDescriptorSelectSharedInHeadV1;

export type StaticTwinFieldMeta = {
  fieldName: string;
  fieldDescriptor?: FieldDescriptor;
  editable?: boolean;
  renderPreview?: (data: Twin, props?: any) => ReactNode;
};
