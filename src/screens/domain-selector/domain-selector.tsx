import { fetchDomains } from "@/entities/domain";
import { ThemeToggle } from "@/features/ui/theme-toggle";

import { DomainSelectForm } from "./form";

export async function DomainSelector() {
  const domains = await fetchDomains();

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute top-3 right-6 flex">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen w-full items-center justify-evenly p-4">
        <DomainSelectForm domains={domains} />
      </div>
    </main>
  );
}
