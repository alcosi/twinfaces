import { ElementType } from "react";

import { MenuItem } from "./menu-item";
import { MenuItemProps } from "./types";

type CollapsibleMenuProps<T> = {
  items: T[];
  getItemProps: (
    item: T,
    index: number
  ) => {
    key: string;
    label: string;
    url?: string;
    iconSource?: string;
    Icon?: ElementType;
    hidden?: boolean;
    buttonClassName?: string;
  };
};

export function CollapsibleMenu<T>({
  items,
  getItemProps,
}: CollapsibleMenuProps<T>) {
  return items.map((item, index) => {
    const props = getItemProps(item, index);
    const { key, ...rest } = props;

    return <MenuItem key={key} {...(rest as MenuItemProps)} />;
  });
}
