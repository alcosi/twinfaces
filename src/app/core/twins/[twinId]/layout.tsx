import { ReactNode } from "react";

import { TwinContextProvider } from "@/features/twin";

type Props = {
  params: {
    twinId: string;
  };
  children: ReactNode;
};

export default function Layout({ params: { twinId }, children }: Props) {
  return <TwinContextProvider twinId={twinId}>{children}</TwinContextProvider>;
}
