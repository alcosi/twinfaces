import { MenuItem } from "./menu-item";
import { MenuItemProps } from "./types";

type Props<T> = {
  items: T[];
  getItemProps: (
    item: T,
    index: number
  ) => {
    key: string;
  } & MenuItemProps;
};

export function CollapsedMenu<T>({ items, getItemProps }: Props<T>) {
  return items.map((item, index) => {
    const props = getItemProps(item, index);
    const { key, ...menuItemProps } = props;

    return <MenuItem key={key} {...menuItemProps} />;
  });
}
