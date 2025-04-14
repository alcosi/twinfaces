import { headers } from "next/headers";

import { fetchDomains } from "@/entities/domain";

import { LoginForm } from "./form";

export async function Login() {
  const domains = await fetchDomains();

  const domainConfigHeader = headers().get("x-domain-config");
  const domainConfig = domainConfigHeader
    ? JSON.parse(domainConfigHeader)
    : null;

  return <LoginForm domains={domains} domainConfig={domainConfig} />;
}
