"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useTransition } from "react";
import { useFormState } from "react-dom";

import { DomainPublicView } from "@/entities/domain";
import { loginFormAction } from "@/entities/user";
import { useAuthUser } from "@/features/auth";
import { ThemeToggle } from "@/features/ui/theme-toggle";
import { PlatformArea, ProductFlavorConfigContext } from "@/shared/config";
import { Button, Input } from "@/shared/ui";

type Props = {
  domains: DomainPublicView[];
};

export function LoginForm({ domains }: Props) {
  const router = useRouter();
  const { setAuthUser, logout } = useAuthUser();
  const config = useContext(ProductFlavorConfigContext);
  const [authUser, formAction] = useFormState(loginFormAction, null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Clear any existing user session
    logout();
  }, []);

  useEffect(() => {
    if (authUser) {
      setAuthUser(authUser);
      router.push(`/${PlatformArea.core}/twinclass`);
    }
  }, [authUser]);

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen relative">
      <div className="absolute flex top-3 right-6">
        <ThemeToggle />
      </div>

      <div className="flex flex-col my-5 items-center -mt-32 min-w-96">
        <Image
          className="rounded-full"
          src={config.favicon}
          width={56}
          height={56}
          alt="Domain icon"
        />
        <h1 className="text-lg font-bold my-3">
          {config.key ?? config.productName}
        </h1>

        <form
          className="flex flex-col gap-4 w-full"
          action={async (formData) => {
            return startTransition(() => formAction(formData));
          }}
        >
          <label htmlFor="domainId">
            Domain
            <select
              id="domainId"
              name="domainId"
              defaultValue={[]}
              className="block w-full border px-3 py-2 rounded-md"
            >
              {domains.map((domain) => (
                <option key={domain.key} value={domain.id}>
                  {domain.key}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="userId">
            User Id
            <Input
              type="text"
              id="userId"
              name="userId"
              defaultValue={config.loginPage.defaultFormValues.userId}
              required
            />
          </label>

          <label htmlFor="businessAccountId">
            Business Account Id
            <Input
              type="text"
              id="businessAccountId"
              name="businessAccountId"
            />
          </label>

          <Button
            type="submit"
            className="w-full"
            loading={isPending}
            size="lg"
          >
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}
