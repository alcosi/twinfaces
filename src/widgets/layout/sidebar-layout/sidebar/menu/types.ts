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
  | "recipient";

export type Group = {
  title: string;
  items: GroupItem[];
};

type GroupItem = {
  title: string;
  url: string;
  icon: ElementType;
};

type MenuItemBase = {
  label: string;
  url?: string;
  hidden?: boolean;
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
