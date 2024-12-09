import {
  Activity,
  ArrowRightLeft,
  BookKey,
  Braces,
  CircleDot,
  Key,
  LayoutTemplate,
  Link2,
  ListTree,
  MessageCircle,
  Play,
  Puzzle,
  Scroll,
  SquareActivity,
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
      {
        title: "Featurers",
        url: "/featurers",
        icon: Play,
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
    ],
  },
  flow: {
    title: "Flow",
    items: [
      {
        title: "Flows",
        url: "/flows",
        icon: Activity,
      },
      {
        title: "Flow schemas",
        url: "/flow-schemas",
        icon: SquareActivity,
      },
      {
        title: "Flow transitions",
        url: "/flow-transitions",
        icon: ArrowRightLeft,
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
        title: "User Groups",
        url: "/user-groups",
        icon: UsersRound,
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
        title: "Permission Schemas",
        url: "/permission-schemas",
        icon: Scroll,
      },
    ],
  },
  misc: {
    title: "Misc",
    items: [
      {
        title: "Datalists",
        url: "/datalists",
        icon: ListTree,
      },
    ],
  },
} as const;
