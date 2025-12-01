import { PermissionSchema } from "@/entities/permission-schema";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinStatus } from "@/entities/twin-status";
import { User } from "@/entities/user";
import type { components } from "@/shared/api/generated/schema";

export type PermissionGrantAssigneePropagation =
  components["schemas"]["PermissionGrantAssigneePropagationV1"] & {
    grantedByUser?: User;
    permissionSchema?: PermissionSchema;
    propagationTwinStatus?: TwinStatus;
  };
export type PermissionGrantAssigneePropagation_DETAILED =
  Required<PermissionGrantAssigneePropagation> & {
    propagationTwinClass: TwinClass_DETAILED;
  };

export type PermissionGrantAssigneePropagationFilter =
  components["schemas"]["PermissionGrantAssigneePropagationSearchRqV1"];
