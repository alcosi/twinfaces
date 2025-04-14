import { fetchDomains } from "@/entities/domain";

import { LoginForm } from "./form";

export async function Login() {
  const domains = await fetchDomains();

  return <LoginForm domains={domains} />;
}
