import { fetchDomains } from "@/entities/domain";
import { ThemeToggle } from "@/features/ui/theme-toggle";

import { AuthForm } from "./auth-form";
import { LoginForm } from "./form";

export async function Login() {
  const domains = await fetchDomains();

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute right-6 top-3 flex">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen w-full items-center justify-evenly p-4">
        <AuthForm />

        <LoginForm domains={domains} />
      </div>
    </main>
  );
}
