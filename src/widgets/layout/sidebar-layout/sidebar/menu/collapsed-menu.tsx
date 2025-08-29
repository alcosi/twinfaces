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

export function CollapsedFooterMenu<T>({ items, getItemProps }: Props<T>) {
  return (
    <div className="flex flex-col items-center">
      {items.map((item, index) => {
        const props = getItemProps(item, index);
        const { key, ...menuItemProps } = props;

        return <MenuItem key={key} {...menuItemProps} className="pt-2" />;
      })}
    </div>
  );
}

export function CollapsedMenu<T>({ items, getItemProps }: Props<T>) {
  return (
    <div className="flex w-full flex-col items-center pt-6">
      {items.map((item, index) => {
        const props = getItemProps(item, index);
        const { key, ...menuItemProps } = props;

        return (
          <MenuItem
            key={key}
            {...menuItemProps}
            className="flex w-full justify-center"
            buttonClassName="flex justify-center items-center"
          />
        );
      })}
    </div>
  );
}
