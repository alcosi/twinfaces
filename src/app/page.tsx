import { redirect } from "next/navigation";

import { getDomainFromHeaders } from "@/entities/face";
import { DomainSelectorScreen } from "@/screens/domain-selector";
import { isPopulatedString } from "@/shared/libs";

export default async function Page() {
  const remoteConfig = await getDomainFromHeaders();

  if (isPopulatedString(remoteConfig?.id)) {
    redirect(`/auth?domainId=${encodeURIComponent(remoteConfig.id)}`);
  }

  return <DomainSelectorScreen />;
}
