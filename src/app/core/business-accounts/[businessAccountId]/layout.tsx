"use client";

import { ReactNode, use } from "react";

import { BusinessAccountContextProvider } from "@/features/business-account";

type BusinessAccountLayoutProps = {
  params: Promise<{
    businessAccountId: string;
  }>;
  children: ReactNode;
};

export default function BusinessAccountLayout(
  props: BusinessAccountLayoutProps
) {
  const params = use(props.params);

  const { businessAccountId } = params;

  const { children } = props;

  return (
    <BusinessAccountContextProvider businessAccountId={businessAccountId}>
      {children}
    </BusinessAccountContextProvider>
  );
}
