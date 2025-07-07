import { ReactNode } from "react";

import { FactoryEraserContextProvider } from "@/features/factory-eraser";

type FactoryEraserLayoutProps = {
  params: {
    eraserId: string;
  };
  children: ReactNode;
};

export default function FactoryEraserLayout({
  params: { eraserId },
  children,
}: FactoryEraserLayoutProps) {
  return (
    <FactoryEraserContextProvider eraserId={eraserId}>
      {children}
    </FactoryEraserContextProvider>
  );
}
