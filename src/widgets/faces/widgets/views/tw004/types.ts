import {
  FieldDescriptorSelectSharedInHeadV1,
  FieldDescriptorSelectUserV1,
  FieldDescriptorText,
} from "@/entities/twin";

type FieldDescriptor =
  | typeof FieldDescriptorText
  | typeof FieldDescriptorSelectUserV1
  | typeof FieldDescriptorSelectSharedInHeadV1;

export type StaticTwinFieldMeta = {
  fieldName: string;
  fieldDescriptor?: FieldDescriptor;
  editable?: boolean;
  resourceLinkKey?: string;
};
