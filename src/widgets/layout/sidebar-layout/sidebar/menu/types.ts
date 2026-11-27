import { ElementType } from "react";

import { OneOf } from "@/shared/libs";

export type GroupKeys =
  | "class"
  | "twin"
  | "user"
  | "datalist"
  | "permission"
  | "factory"
  | "transition"
  | "businessAccount"
  | "misc"
  | "projection"
  | "notification"
  | "validator"
  | "triggers";

export type Group = {
  title: string;
  items: GroupItem[];
};

export type GroupItem = {
  title: string;
  url: string;
  icon: ElementType;
  children?: GroupItem[];
};

type MenuItemBase = {
  label: string;
  url?: string;
  hidden?: boolean;
  /** Not selectable: rendered dimmed and without a link. */
  disabled?: boolean;
  /** Badge number next to the label; not rendered when empty or 0. */
  counter?: number | null;
  className?: string;
  buttonClassName?: string;
};

export type ComponentIconItem = MenuItemBase & {
  Icon: ElementType;
  iconSource?: never;
};

export type UrlIconItem = MenuItemBase & {
  Icon?: never;
  iconSource?: string;
};

export type MenuItemProps = OneOf<[ComponentIconItem | UrlIconItem]>;
