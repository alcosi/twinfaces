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
        url: "/twinclass",
        icon: LayoutTemplate,
      },
      {
        title: "Fields",
        url: "/fields",
        icon: Puzzle,
      },
      {
        title: "Statuses",
        url: "/statuses",
        icon: CircleDot,
      },
      {
        title: "Links",
        url: "/links",
        icon: Link2,
      },
    ],
  },
  twin: {
    title: "Twin",
    items: [
      {
        title: "Twins",
        url: "/twin",
        icon: Braces,
      },
      {
        title: "Comments",
        url: "/comments",
        icon: MessageCircle,
      },
      {
        title: "Attachments",
        url: "/attachments",
        icon: Paperclip,
      },
    ],
  },
  user: {
    title: "User",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: User,
      },
      {
        title: "Groups",
        url: "/user-groups",
        icon: UsersRound,
      },
    ],
  },
  datalist: {
    title: "Datalist",
    items: [
      {
        title: "Datalists",
        url: "/datalists",
        icon: ListTree,
      },
      {
        title: "Options",
        url: "/options",
        icon: Option,
      },
      {
        title: "Subsets",
        url: "/subsets",
        icon: Shapes,
      },
    ],
  },
  permission: {
    title: "Permission",
    items: [
      {
        title: "Permissions",
        url: "/permission",
        icon: Key,
      },
      {
        title: "Permission Groups",
        url: "/permission-group",
        icon: BookKey,
      },
      {
        title: "Schemas",
        url: "/permission-schemas",
        icon: Scroll,
      },
    ],
  },
  factory: {
    title: "Factory",
    items: [
      {
        title: "Factories",
        url: "/factories",
        icon: Factory,
      },
      {
        title: "Multipliers",
        url: "/multipliers",
        icon: Asterisk,
      },
      {
        title: "Multiplier filters",
        url: "/multiplier-filters",
        icon: SquareAsterisk,
      },
      {
        title: "Pipelines",
        url: "/pipelines",
        icon: Fence,
      },
      {
        title: "Pipeline steps",
        url: "/pipeline-steps",
        icon: Footprints,
      },
      {
        title: "Branches",
        url: "/branches",
        icon: Split,
      },
      {
        title: "Erasers",
        url: "/erasers",
        icon: Eraser,
      },
    ],
  },
  transition: {
    title: "Transition",
    items: [
      {
        title: "Transitions",
        url: "/transitions",
        icon: ArrowRightLeft,
      },
      {
        title: "Twinflows",
        url: "/twinflows",
        icon: Activity,
      },
      {
        title: "Schemas",
        url: "/twinflow-schemas",
        icon: SquareActivity,
      },
    ],
  },
  businessAccount: {
    title: "Business account",
    items: [
      {
        title: "Business accounts",
        url: "/business-accounts",
        icon: BriefcaseBusiness,
      },
      {
        title: "Tiers",
        url: "/tiers",
        icon: Leaf,
      },
    ],
  },
  misc: {
    title: "Misc",
    items: [
      {
        title: "Featurers",
        url: "/featurers",
        icon: Play,
      },
    ],
  },
} as const;
