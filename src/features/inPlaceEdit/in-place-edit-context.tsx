import { createContext, ReactNode, useState } from "react";

interface InPlaceEditContextProps {
  current: string | null;
  setCurrent: (key: string) => void;
  clearCurrent: () => void;
}

export const InPlaceEditContext = createContext<InPlaceEditContextProps | null>(
  null
);

export function InPlaceEditContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [current, setCurrent] = useState<string | null>(null);

  function clearCurrent() {
    setCurrent(null);
  }

  return (
    <InPlaceEditContext.Provider
      value={{ current, setCurrent, clearCurrent }}
    >
      {children}
    </InPlaceEditContext.Provider>
  );
}
