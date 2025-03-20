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
import { PermissionSchemaIcon } from "@/entities/permission-schema";
import { TwinIcon } from "@/entities/twin";
import { TwinClassIcon } from "@/entities/twin-class";
import { FieldIcon } from "@/entities/twin-class-field";
import { TwinFlowIcon } from "@/entities/twin-flow";
import { TwinFlowTransitionIcon } from "@/entities/twin-flow-transition";
import { TwinStatusIcon } from "@/entities/twin-status";
import { PlatformArea } from "@/shared/config";
import { TierIcon } from "@/shared/ui/icons";

import { Group, GroupKeys } from "./group";

export const SIDEBAR_GROUPS: Record<GroupKeys, Group> = {
  class: {
    title: "Class",
    items: [
      {
        title: "Classes",
        url: `/${PlatformArea.core}/twinclass`,
        icon: TwinClassIcon,
      },
      {
        title: "Fields",
        url: `/${PlatformArea.core}/fields`,
        icon: FieldIcon,
      },
      {
        title: "Statuses",
        url: `/${PlatformArea.core}/statuses`,
        icon: TwinStatusIcon,
      },
      {
        title: "Links",
        url: `/${PlatformArea.core}/links`,
        icon: Link2,
      },
    ],
  },
  twin: {
    title: "Twin",
    items: [
      {
        title: "Twins",
        url: `/${PlatformArea.core}/twins`,
        icon: TwinIcon,
      },
      {
        title: "Comments",
        url: `/${PlatformArea.core}/comments`,
        icon: MessageCircle,
      },
      {
        title: "Attachments",
        url: `/${PlatformArea.core}/attachments`,
        icon: Paperclip,
      },
    ],
  },
  user: {
    title: "User",
    items: [
      {
        title: "Users",
        url: `/${PlatformArea.core}/users`,
        icon: User,
      },
      {
        title: "Groups",
        url: `/${PlatformArea.core}/user-groups`,
        icon: UsersRound,
      },
    ],
  },
  datalist: {
    title: "Datalist",
    items: [
      {
        title: "Datalists",
        url: `/${PlatformArea.core}/datalists`,
        icon: DatalistIcon,
      },
      {
        title: "Options",
        url: `/${PlatformArea.core}/datalist-options`,
        icon: Option,
      },
      {
        title: "Subsets",
        url: `/${PlatformArea.core}/subsets`,
        icon: Shapes,
      },
    ],
  },
  permission: {
    title: "Permission",
    items: [
      {
        title: "Permissions",
        url: `/${PlatformArea.core}/permissions`,
        icon: PermissionIcon,
      },
      {
        title: "Permission Groups",
        url: `/${PlatformArea.core}/permission-groups`,
        icon: PermissionGroupIcon,
      },
      {
        title: "Schemas",
        url: `/${PlatformArea.core}/permission-schemas`,
        icon: PermissionSchemaIcon,
      },
    ],
  },
  factory: {
    title: "Factory",
    items: [
      {
        title: "Factories",
        url: `/${PlatformArea.core}/factories`,
        icon: Factory,
      },
      {
        title: "Multipliers",
        url: `/${PlatformArea.core}/multipliers`,
        icon: Asterisk,
      },
      {
        title: "Multiplier filters",
        url: `/${PlatformArea.core}/multiplier-filters`,
        icon: SquareAsterisk,
      },
      {
        title: "Pipelines",
        url: `/${PlatformArea.core}/pipelines`,
        icon: FactoryPipelineIcon,
      },
      {
        title: "Pipeline steps",
        url: `/${PlatformArea.core}/pipeline-steps`,
        icon: FactoryPipelineStepIcon,
      },
      {
        title: "Branches",
        url: `/${PlatformArea.core}/branches`,
        icon: FactoryBranchIcon,
      },
      {
        title: "Erasers",
        url: `/${PlatformArea.core}/erasers`,
        icon: Eraser,
      },
      {
        title: "Condition sets",
        url: `/${PlatformArea.core}/condition-sets`,
        icon: FactoryConditionSetIcon,
      },
    ],
  },
  transition: {
    title: "Transition",
    items: [
      {
        title: "Transitions",
        url: `/${PlatformArea.core}/transitions`,
        icon: TwinFlowTransitionIcon,
      },
      {
        title: "Twinflows",
        url: `/${PlatformArea.core}/twinflows`,
        icon: TwinFlowIcon,
      },
      {
        title: "Schemas",
        url: `/${PlatformArea.core}/twinflow-schemas`,
        icon: SquareActivity,
      },
    ],
  },
  businessAccount: {
    title: "Business account",
    items: [
      {
        title: "Business accounts",
        url: `/${PlatformArea.core}/business-accounts`,
        icon: BriefcaseBusiness,
      },
      {
        title: "Tiers",
        url: `/${PlatformArea.core}/tiers`,
        icon: TierIcon,
      },
    ],
  },
  misc: {
    title: "Misc",
    items: [
      {
        title: "Featurers",
        url: `/${PlatformArea.core}/featurers`,
        icon: Play,
      },
    ],
  },
} as const;
