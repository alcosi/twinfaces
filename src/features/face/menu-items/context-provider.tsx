"use client";

import { PropsWithChildren, createContext } from "react";

type Props = {
  data: any[];
};

export const MenuItemsContext = createContext<Props>({} as Props);

export function MenuItemsContextProvider({
  data,
  children,
}: PropsWithChildren<Props>) {
  return (
    <MenuItemsContext.Provider value={{ data }}>
      {children}
    </MenuItemsContext.Provider>
  );
}
