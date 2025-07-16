import type { components } from "@/shared/api/generated/schema";
import { TwinClass_DETAILED } from "@/entities/twin-class";

export type PermissionGrantAssigneePropagation =
  components["schemas"]["PermissionGrantAssigneePropagationV2"];
export type PermissionGrantAssigneePropagation_DETAILED =
  Required<PermissionGrantAssigneePropagation> & {
    propagationTwinClass: TwinClass_DETAILED;
  };

export type PermissionGrantAssigneePropagationFilter =
  components["schemas"]["PermissionGrantAssigneePropagationSearchRqV1"];
