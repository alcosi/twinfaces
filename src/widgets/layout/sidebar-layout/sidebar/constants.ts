import {
  Activity,
  ArrowRightLeft,
  Asterisk,
  BookKey,
  Braces,
  BriefcaseBusiness,
  CircleDot,
  Eraser,
  Factory,
  Fence,
  Footprints,
  Key,
  LayoutTemplate,
  Leaf,
  Link2,
  ListTree,
  MessageCircle,
  Option,
  Paperclip,
  Play,
  Puzzle,
  Scroll,
  Shapes,
  Split,
  SquareActivity,
  SquareAsterisk,
  User,
  UsersRound,
} from "lucide-react";
import { Group, GroupKeys } from "./group";

export const SIDEBAR_GROUPS: Record<GroupKeys, Group> = {
  class: {
    title: "Class",
    items: [
      {
        title: "Classes",
        url: "/workspace/twinclass",
        icon: LayoutTemplate,
      },
      {
        title: "Fields",
        url: "/workspace/fields",
        icon: Puzzle,
      },
      {
        title: "Statuses",
        url: "/workspace/statuses",
        icon: CircleDot,
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
        url: "/workspace/twin",
        icon: Braces,
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
        icon: ListTree,
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
        url: "/workspace/permission",
        icon: Key,
      },
      {
        title: "Permission Groups",
        url: "/workspace/permission-group",
        icon: BookKey,
      },
      {
        title: "Schemas",
        url: "/workspace/permission-schemas",
        icon: Scroll,
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
        icon: Fence,
      },
      {
        title: "Pipeline steps",
        url: "/workspace/pipeline-steps",
        icon: Footprints,
      },
      {
        title: "Branches",
        url: "/workspace/branches",
        icon: Split,
      },
      {
        title: "Erasers",
        url: "/workspace/erasers",
        icon: Eraser,
      },
    ],
  },
  transition: {
    title: "Transition",
    items: [
      {
        title: "Transitions",
        url: "/workspace/transitions",
        icon: ArrowRightLeft,
      },
      {
        title: "Twinflows",
        url: "/workspace/twinflows",
        icon: Activity,
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
        icon: Leaf,
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
