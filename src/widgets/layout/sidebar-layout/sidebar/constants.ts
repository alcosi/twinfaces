import {
  Asterisk,
  BriefcaseBusiness,
  Eraser,
  Factory,
  Link2,
  MessageCircle,
  Option,
  Paperclip,
  Play,
  Shapes,
  SquareActivity,
  SquareAsterisk,
  User,
  UsersRound,
} from "lucide-react";

import { DatalistIcon } from "@/entities/datalist";
import { FactoryBranchIcon } from "@/entities/factory-branch";
import { FactoryConditionSetIcon } from "@/entities/factory-condition-set";
import { FactoryPipelineIcon } from "@/entities/factory-pipeline";
import { FactoryPipelineStepIcon } from "@/entities/factory-pipeline-step";
import { PermissionIcon } from "@/entities/permission";
import { PermissionGroupIcon } from "@/entities/permission-group";
import { PermissionSchemaIcon } from "@/entities/permission-schema/components/permission-schema-icon";
import { TwinIcon } from "@/entities/twin";
import { TwinClassIcon } from "@/entities/twin-class";
import { FieldIcon } from "@/entities/twin-class-field";
import { TwinFlowIcon } from "@/entities/twin-flow";
import { TwinFlowTransitionIcon } from "@/entities/twin-flow-transition";
import { TwinStatusIcon } from "@/entities/twin-status";
import { TierIcon } from "@/shared/ui/icons/tier-icon";

import { Group, GroupKeys } from "./group";

export const SIDEBAR_GROUPS: Record<GroupKeys, Group> = {
  class: {
    title: "Class",
    items: [
      {
        title: "Classes",
        url: "/workspace/twinclass",
        icon: TwinClassIcon,
      },
      {
        title: "Fields",
        url: "/workspace/fields",
        icon: FieldIcon,
      },
      {
        title: "Statuses",
        url: "/workspace/statuses",
        icon: TwinStatusIcon,
      },
      {
        title: "Links",
        url: "/workspace/links",
        icon: Link2,
      },
    ],
  },
  twin: {
    title: "Twin",
    items: [
      {
        title: "Twins",
        url: "/workspace/twins",
        icon: TwinIcon,
      },
      {
        title: "Comments",
        url: "/workspace/comments",
        icon: MessageCircle,
      },
      {
        title: "Attachments",
        url: "/workspace/attachments",
        icon: Paperclip,
      },
    ],
  },
  user: {
    title: "User",
    items: [
      {
        title: "Users",
        url: "/workspace/users",
        icon: User,
      },
      {
        title: "Groups",
        url: "/workspace/user-groups",
        icon: UsersRound,
      },
    ],
  },
  datalist: {
    title: "Datalist",
    items: [
      {
        title: "Datalists",
        url: "/workspace/datalists",
        icon: DatalistIcon,
      },
      {
        title: "Options",
        url: "/workspace/datalist-options",
        icon: Option,
      },
      {
        title: "Subsets",
        url: "/workspace/subsets",
        icon: Shapes,
      },
    ],
  },
  permission: {
    title: "Permission",
    items: [
      {
        title: "Permissions",
        url: "/workspace/permissions",
        icon: PermissionIcon,
      },
      {
        title: "Permission Groups",
        url: "/workspace/permission-group",
        icon: PermissionGroupIcon,
      },
      {
        title: "Schemas",
        url: "/workspace/permission-schemas",
        icon: PermissionSchemaIcon,
      },
    ],
  },
  factory: {
    title: "Factory",
    items: [
      {
        title: "Factories",
        url: "/workspace/factories",
        icon: Factory,
      },
      {
        title: "Multipliers",
        url: "/workspace/multipliers",
        icon: Asterisk,
      },
      {
        title: "Multiplier filters",
        url: "/workspace/multiplier-filters",
        icon: SquareAsterisk,
      },
      {
        title: "Pipelines",
        url: "/workspace/pipelines",
        icon: FactoryPipelineIcon,
      },
      {
        title: "Pipeline steps",
        url: "/workspace/pipeline-steps",
        icon: FactoryPipelineStepIcon,
      },
      {
        title: "Branches",
        url: "/workspace/branches",
        icon: FactoryBranchIcon,
      },
      {
        title: "Erasers",
        url: "/workspace/erasers",
        icon: Eraser,
      },
      {
        title: "Condition sets",
        url: "/workspace/condition-sets",
        icon: FactoryConditionSetIcon,
      },
    ],
  },
  transition: {
    title: "Transition",
    items: [
      {
        title: "Transitions",
        url: "/workspace/transitions",
        icon: TwinFlowTransitionIcon,
      },
      {
        title: "Twinflows",
        url: "/workspace/twinflows",
        icon: TwinFlowIcon,
      },
      {
        title: "Schemas",
        url: "/workspace/twinflow-schemas",
        icon: SquareActivity,
      },
    ],
  },
  businessAccount: {
    title: "Business account",
    items: [
      {
        title: "Business accounts",
        url: "/workspace/business-accounts",
        icon: BriefcaseBusiness,
      },
      {
        title: "Tiers",
        url: "/workspace/tiers",
        icon: TierIcon,
      },
    ],
  },
  misc: {
    title: "Misc",
    items: [
      {
        title: "Featurers",
        url: "/workspace/featurers",
        icon: Play,
      },
    ],
  },
} as const;
