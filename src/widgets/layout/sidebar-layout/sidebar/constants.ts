import { useTypedTranslations } from "@/i18n/useTypedTranslations.hook";

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

import { DatalistIcon } from "@/features/datalist/ui";
import { FactoryBranchIcon } from "@/features/factory-branch/ui";
import { FactoryConditionSetIcon } from "@/features/factory-condition-set/ui";
import { FactoryPipelineStepIcon } from "@/features/factory-pipeline-step/ui";
import { FactoryPipelineIcon } from "@/features/factory-pipeline/ui";
import { PermissionGroupIcon } from "@/features/permission-group/ui";
import { PermissionSchemaIcon } from "@/features/permission-schema/ui";
import { PermissionIcon } from "@/features/permission/ui";
import { TierIcon } from "@/features/tier/ui";
import { FieldIcon } from "@/features/twin-class-field/ui";
import { TwinClassIcon } from "@/features/twin-class/ui";
import { TwinFlowTransitionIcon } from "@/features/twin-flow-transition/ui";
import { TwinFlowIcon } from "@/features/twin-flow/ui";
import { TwinStatusIcon } from "@/features/twin-status/ui";
import { TwinIcon } from "@/features/twin/ui";
import { PlatformArea } from "@/shared/config";

import { Group, GroupKeys } from "./menu";

export const useSidebarGroups = () => {
  const t = useTypedTranslations();

  const SIDEBAR_GROUPS: Record<GroupKeys, Group> = {
    class: {
      title: t("groups.class"),
      items: [
        {
          title: t("items.classes"),
          url: `/${PlatformArea.core}/twinclass`,
          icon: TwinClassIcon,
        },
        {
          title: t("items.fields"),
          url: `/${PlatformArea.core}/fields`,
          icon: FieldIcon,
        },
        {
          title: t("items.statuses"),
          url: `/${PlatformArea.core}/statuses`,
          icon: TwinStatusIcon,
        },
        {
          title: t("items.links"),
          url: `/${PlatformArea.core}/links`,
          icon: Link2,
        },
      ],
    },
    twin: {
      title: t("groups.twin"),
      items: [
        {
          title: t("items.twins"),
          url: `/${PlatformArea.core}/twins`,
          icon: TwinIcon,
        },
        {
          title: t("items.comments"),
          url: `/${PlatformArea.core}/comments`,
          icon: MessageCircle,
        },
        {
          title: t("items.attachments"),
          url: `/${PlatformArea.core}/attachments`,
          icon: Paperclip,
        },
      ],
    },
    user: {
      title: t("groups.user"),
      items: [
        {
          title: t("items.users"),
          url: `/${PlatformArea.core}/users`,
          icon: User,
        },
        {
          title: t("items.groups"),
          url: `/${PlatformArea.core}/user-groups`,
          icon: UsersRound,
        },
      ],
    },
    datalist: {
      title: t("groups.datalist"),
      items: [
        {
          title: t("items.datalists"),
          url: `/${PlatformArea.core}/datalists`,
          icon: DatalistIcon,
        },
        {
          title: t("items.options"),
          url: `/${PlatformArea.core}/datalist-options`,
          icon: Option,
        },
        {
          title: t("items.subsets"),
          url: `/${PlatformArea.core}/subsets`,
          icon: Shapes,
        },
      ],
    },
    permission: {
      title: t("groups.permission"),
      items: [
        {
          title: t("items.permissions"),
          url: `/${PlatformArea.core}/permissions`,
          icon: PermissionIcon,
        },
        {
          title: t("items.permissionGroups"),
          url: `/${PlatformArea.core}/permission-groups`,
          icon: PermissionGroupIcon,
        },
        {
          title: t("items.schemas"),
          url: `/${PlatformArea.core}/permission-schemas`,
          icon: PermissionSchemaIcon,
        },
      ],
    },
    factory: {
      title: t("groups.factory"),
      items: [
        {
          title: t("items.factories"),
          url: `/${PlatformArea.core}/factories`,
          icon: Factory,
        },
        {
          title: t("items.multipliers"),
          url: `/${PlatformArea.core}/multipliers`,
          icon: Asterisk,
        },
        {
          title: t("items.multiplierFilters"),
          url: `/${PlatformArea.core}/multiplier-filters`,
          icon: SquareAsterisk,
        },
        {
          title: t("items.pipelines"),
          url: `/${PlatformArea.core}/pipelines`,
          icon: FactoryPipelineIcon,
        },
        {
          title: t("items.pipelineSteps"),
          url: `/${PlatformArea.core}/pipeline-steps`,
          icon: FactoryPipelineStepIcon,
        },
        {
          title: t("items.branches"),
          url: `/${PlatformArea.core}/branches`,
          icon: FactoryBranchIcon,
        },
        {
          title: t("items.erasers"),
          url: `/${PlatformArea.core}/erasers`,
          icon: Eraser,
        },
        {
          title: t("items.conditionSets"),
          url: `/${PlatformArea.core}/condition-sets`,
          icon: FactoryConditionSetIcon,
        },
      ],
    },
    transition: {
      title: t("groups.transition"),
      items: [
        {
          title: t("items.transitions"),
          url: `/${PlatformArea.core}/transitions`,
          icon: TwinFlowTransitionIcon,
        },
        {
          title: t("items.twinflows"),
          url: `/${PlatformArea.core}/twinflows`,
          icon: TwinFlowIcon,
        },
        {
          title: t("items.twinflowSchemas"),
          url: `/${PlatformArea.core}/twinflow-schemas`,
          icon: SquareActivity,
        },
      ],
    },
    businessAccount: {
      title: t("groups.businessAccount"),
      items: [
        {
          title: t("items.businessAccounts"),
          url: `/${PlatformArea.core}/business-accounts`,
          icon: BriefcaseBusiness,
        },
        {
          title: t("items.tiers"),
          url: `/${PlatformArea.core}/tiers`,
          icon: TierIcon,
        },
      ],
    },
    misc: {
      title: t("groups.misc"),
      items: [
        {
          title: t("items.featurers"),
          url: `/${PlatformArea.core}/featurers`,
          icon: Play,
        },
      ],
    },
  } as const;

  return SIDEBAR_GROUPS;
};
