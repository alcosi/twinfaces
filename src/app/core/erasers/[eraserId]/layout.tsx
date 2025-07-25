import { ReactNode } from "react";

import { FactoryEraserContextProvider } from "@/features/factory-eraser";

type FactoryEraserLayoutProps = {
  params: Promise<{
    eraserId: string;
  }>;
  children: ReactNode;
};

export default async function FactoryEraserLayout(
  props: FactoryEraserLayoutProps
) {
  const params = await props.params;

  const { eraserId } = params;

  const { children } = props;

  return (
    <FactoryEraserContextProvider eraserId={eraserId}>
      {children}
    </FactoryEraserContextProvider>
  );
}
